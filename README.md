# DC-Connect

> A full-stack mobile application built for a college's Computer Department — connecting students, teachers, parents, and administrators in one unified platform.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features by Role](#features-by-role)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running the Backend](#running-the-backend)
  - [Running the Client](#running-the-client)
- [Database Design](#database-design)
- [API Overview](#api-overview)

---

## Overview

DC-Connect is a department management app tailored for college students, teachers, parents, and admins. It handles attendance tracking, assignment submissions, internal marks, fee management, notes sharing, exam results, work logs, and push notifications — all from a mobile-first interface.

---

## Tech Stack

### Client
| Technology | Purpose |
|---|---|
| React Native + Expo (SDK 55) | Cross-platform mobile app |
| Expo Router | File-based navigation |
| TanStack Query | Server state management & caching |
| Zustand | Client-side global state |
| MMKV | Fast local storage |
| NativeWind / Tailwind CSS | Styling |
| Reanimated + Gesture Handler | Animations & gestures |
| Gifted Charts | Data visualizations |
| Expo Notifications | Push notifications |

### Server
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API |
| MongoDB + Mongoose | Non-relational data (assignments, notes, marks, etc.) |
| Turso (libSQL) | Relational data (users, classes, attendance, fees) |
| Cloudinary | File & image storage |

| JWT | Auth with access + refresh token flow |
| node-cron | Scheduled jobs (monthly attendance reports) |
| PDFKit + Puppeteer | PDF & report generation |
| ExcelJS | Excel export |
| Expo Server SDK | Push notification delivery |
| Vercel | Serverless deployment |

---

## Features by Role

### 🎓 Student
- View and upload assignment submissions
- Track attendance with a monthly calendar view
- Check internal marks and exam results
- View and download notes shared by teachers
- Monitor fee payment status
- Receive push notifications

### 👩‍🏫 Teacher
- Mark and manage attendance
- Create assignments and review student submissions (accept/reject)
- Enter internal marks and exam results
- Share notes with classes
- Manage student profiles and parent linkages
- Log daily work hours
- View monthly attendance reports

### 👨‍👩‍👧 Parent
- View their child's attendance summary and calendar
- Browse the teacher list
- Receive notifications about their child's activity

### 🛠️ Admin
- Verify and manage teacher accounts
- Assign teachers to classes
- View attendance history across the department
- Monitor teacher work logs
- Access the system dashboard with key metrics
- Perform advanced system operations

---

## Project Structure

```
DepartmentApp/
├── client/                       # React Native Expo app
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/          # Admin screens (tabs + others)
│   │   │   ├── (teacher)/        # Teacher screens
│   │   │   ├── (student)/        # Student screens
│   │   │   ├── (parent)/         # Parent screens
│   │   │   ├── auth/             # Signin, Signup
│   │   │   └── common/           # Shared screens (fees, notes, worklogs, etc.)
│   │   ├── components/           # Reusable UI components
│   │   └── ...
│   ├── assets/
│   ├── app.json
│   └── package.json
│
└── server/                       # Node.js Express API
    ├── config/                   # DB & service configs (mongoose, turso, cloudinary)
    ├── controllers/
    │   ├── auth/                 # Signup, signin, refresh, logout
    │   ├── admin/                # Teacher management, table ops
    │   ├── teacher/              # Attendance, assignments, fees, notes, etc.
    │   ├── student/              # Student-facing controllers
    │   ├── common/               # Shared controllers
    │   └── users/                # Notifications
    ├── models/                   # Mongoose schemas
    ├── routes/                   # Express route definitions
    ├── middleware/                # Auth + rate limiting
    ├── utils/                    # Turso table setup, Cloudinary helpers, token utils
    ├── workers/                  # Cron jobs (monthly attendance)
    ├── services/                 # (Email service scaffolded, currently disabled)
    ├── constants/                # App-wide constants
    └── server.js                 # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A MongoDB Atlas instance
- A Turso database
- A Cloudinary account
- A SendGrid / Resend API key (for emails — currently disabled, see note below)

---

### Environment Variables

#### Server (`server/.env`)

```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# Turso
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Email (currently disabled — no free-forever service available on Render)
# SENDGRID_API_KEY=your_sendgrid_key
# RESEND_API_KEY=your_resend_key

# Misc
NODE_ENV=development
```

#### Client (`client/.env`)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

---

### Running the Backend

```bash
cd server
npm install
npm run dev        # development (nodemon)
# or
npm start          # production
```

The server runs on `http://localhost:3000` by default.

---

### Running the Client

```bash
cd client
npm install
npx expo start
```

Then scan the QR code with the Expo Go app, or press `a` / `i` to launch on an Android/iOS emulator.

To build a development client (required for native modules like MMKV):

```bash
npx expo run:android
# or
npx expo run:ios
```

---

## Database Design

DC-Connect uses a **dual-database architecture**:

**Turso (SQLite/libSQL) — Relational data**

Stores structured, relational data where consistency and foreign key constraints matter:
- `users`, `students`, `teachers`, `parents`, `admins`
- `classes` (course + year combinations)
- `parent_child` (parent-to-student relationships)
- `attendance` records
- `fees` records

**MongoDB — Non-relational / document data**

Stores flexible, document-style data:
- `assignments` + submission arrays
- `notes` and note folders
- `internalMarks`
- `examResults`
- `monthlyAttendanceReports`
- `notifications`
- `otps`

**Cloudinary** is used for all file uploads — profile pictures, assignment submissions, and notes attachments.

---

## API Reference

All routes except `/auth/*` require a valid JWT `Authorization: Bearer <token>` header. The middleware extracts `userId` and `role` from the token and attaches them to `req.user`. Route-level `authorize(...roles)` guards reject requests where the role doesn't match.

Access tokens are short-lived (default `1m`, configurable via `ACCESS_TOKEN_EXPIRES`). Clients are expected to use the refresh token flow to stay authenticated. Refresh tokens are currently signed JWTs — the Redis-backed store is scaffolded but commented out, so tokens are stateless for now.

---

### Auth — `/auth`

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/auth/signup` | Public | Creates a user row in `users` (Turso). For students, also inserts into `students` with `course` + `year`. For parents, inserts `parent_child` rows linking them to their selected children. Returns both access and refresh tokens immediately. |
| POST | `/auth/signin` | Public | Verifies password with bcrypt. For teachers/admins, joins `classes` to attach `in_charge_course/year` and joins `teacher_courses` for subject list. For students, fetches `course`, `year`, `rollno`. For parents, fetches verified child `studentId` list. Returns tokens + enriched user object (password stripped). |
| POST | `/auth/refresh` | Public | Issues a new access token from a valid refresh token. |
| POST | `/auth/logout` | Public | Intended to revoke refresh token (token revocation is stubbed — Redis was removed). |
| POST | `/auth/getStudentsForParents` | Public | Queries Turso for verified students by `course` + `year` so parents can select their children during signup without being authenticated. |

---

### User — `/user`

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/user/addNotificationToken` | Any | Saves the Expo push token to the `users` table so the server can target that device. |
| POST | `/user/getUserNotifications` | Any | Fetches the user's notification history from MongoDB `notifications` collection. |
| POST | `/user/changePassword` | Any | Verifies the current password via bcrypt, hashes the new one, and updates `users` in Turso. |

---

### Profile — `/profile`

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/profile/uploadDp` | Any | Receives a Cloudinary `secure_url` + `public_id` (uploaded directly from client), updates `dp` and `dp_public_id` in Turso `users`, and deletes the old image from Cloudinary if one existed. On failure, the new upload is also deleted to avoid orphaned files. |
| POST | `/profile/getDp` | Any | Returns `dp` and `dp_public_id` for the requesting user. |
| POST | `/profile/removeDp` | Any | Nulls out `dp` in Turso and deletes the file from Cloudinary. |
| POST | `/profile/editProfile` | Any | Updates `fullname`, `phone`, and `about` fields in Turso `users`. |

---

### File — `/file`

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/file/getSignature` | Any | Generates a signed Cloudinary upload signature server-side. The client uploads files directly to Cloudinary using this signature — the server never handles the binary. Supported preset types: `note`, `assignment`, `dp`, `exam_result`, `internal_mark`. Each maps to a specific Cloudinary upload preset. |

> Files are uploaded client-to-Cloudinary directly. The server only handles the metadata (URL, public_id) after the upload completes.

---

### Attendance — `/attendance`

The attendance system tracks per-student, per-hour presence. Each session creates one `attendance` row (header) and N `attendance_details` rows (one per student). The day is split into two halves (hours 1–3 = morning, hours 4–5 = afternoon) for percentage calculations.

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/attendance/save` | teacher, admin | Creates or updates an attendance session using a **Turso write transaction**. On create: inserts an `attendance` header row + all `attendance_details`. On update: checks the edit window (20 min, constants.js), deletes old details, inserts fresh ones. After commit, sends push notifications to absent students and their verified parents via Expo. Enforces `UNIQUE` constraint to prevent duplicate sessions per hour/date. |
| POST | `/attendance/fetchStudentsForAttendance` | teacher, admin | Returns the verified+rolled student list for a class and also fetches any existing attendance for that hour/date so the teacher can see what was already marked. |
| POST | `/attendance/getAttandanceTakenByTeacher` | teacher, admin | Paginated list of attendance sessions created by the requesting teacher, ordered newest first. |
| POST | `/attendance/getClassAttendance` | teacher, admin | Paginated full attendance history for a course/year combination. |
| POST | `/attendance/getTodaysAttendanceReport` | student, parent | Returns today's attendance record for the student (or their child). |
| POST | `/attendance/overallAttendenceReport` | student, parent | Runs the half-day attendance SQL query across all recorded dates, returning `working_days`, `present_days`, `absent_days`, and `attendance_percentage`. |
| POST | `/attendance/generateAttendanceCalendarReport` | student, parent | Returns per-day attendance values for a given month, used to render the calendar view in the app. |
| POST | `/attendance/getYearlyAttendanceReport` | student | Returns a monthly breakdown of attendance percentages across the academic year for chart display. |
| POST | `/attendance/monthly-report-excel` | teacher, admin | Runs the date-range attendance SQL, generates a styled **Excel** file via ExcelJS and a branded **PDF** via Puppeteer (renders HTML → PDF with color-coded attendance badges), uploads both to Cloudinary, saves the metadata to MongoDB, and sends a push notification to the class with the PDF preview. Returns both file URLs. Deduplicates — if a report for the same range already exists, returns the existing URLs. |
| POST | `/attendance/deleteReport` | teacher, admin | Deletes both the Excel and PDF files from Cloudinary and removes the MongoDB document. |

---

### Assignment — `/assignment`

Assignments are stored in MongoDB. Each document holds the topic, description, due date, and an embedded `submissions` array that grows as students upload their work.

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/assignment/create` | teacher, admin | Creates a new assignment document in MongoDB. Looks up the current class strength from Turso to store it on the document. Sends a push notification to all students in that class. |
| POST | `/assignment/getAssignmentsCreatedByMe` | teacher, admin | Paginated list of assignment documents the requesting teacher created, sorted newest first. |
| POST | `/assignment/getAssignmentForStudent` | student | Fetches assignments for the student's course/year. |
| POST | `/assignment/saveAssignmentSubmissionDetails` | student | Pushes a new entry into the `submissions` array of the assignment document with `studentId`, Cloudinary `url`, `format`, and initial status `pending`. |
| POST | `/assignment/reject` | teacher, admin | Uses MongoDB `$set` on the matched `submissions.$` array element to set `status: "rejected"` and store a rejection message. Sends a push notification to the student. |
| POST | `/assignment/accept` | teacher, admin | Sets `submissions.$.status` to `"accepted"` and sends an approval notification to the student. |

---

### Notes — `/notes`

Notes are folder-based. A folder document holds metadata and a list of uploaded files (Cloudinary URLs).

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/notes/create` | teacher, admin | Creates a new note folder document in MongoDB. |
| POST | `/notes/upload` | teacher, admin | Adds a file entry (Cloudinary URL, name, format) to an existing note folder. |
| POST | `/notes/fetchByTeacher` | teacher, admin | Returns all note folders created by the requesting teacher. |
| POST | `/notes/delete` | teacher, admin | Deletes a note or folder and removes the associated Cloudinary file. |
| POST | `/notes/fetchByStudent` | student | Returns notes relevant to the student's course/year. |

---

### Fees — `/fees`

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/fees/create` | teacher, admin | Creates a fee record in Turso for a student or class. |
| POST | `/fees/fetchByTeacher` | teacher, admin | Returns all fee records the teacher created, for tracking payment status. |
| POST | `/fees/delete` | teacher, admin | Removes a fee record. |
| POST | `/fees/fetchByStudent` | student | Returns the student's own fee records. |

---

### Teacher — `/teacher`

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/teacher/saveWorklog` | teacher, admin | Inserts a work log entry into Turso `worklogs` (date, hour, subject, topics covered). Enforces a UNIQUE constraint per teacher/date/hour. |
| POST | `/teacher/getWorklogs` | teacher, admin | Paginated worklog history for a teacher. Admins can pass any `teacherId`; teachers default to their own. |
| GET | `/teacher/sync` | teacher, admin | Returns the teacher's current `in_charge` assignment and course list — used to refresh local state after admin changes. |
| POST | `/teacher/addCourse` | teacher, admin | Registers a teacher as the instructor for a subject/course/year combination in `teacher_courses`. |
| POST | `/teacher/fetchAllTeachers` | Any | Returns the list of verified teachers (used in student/parent views to display contact info). |
| POST | `/teacher/fetchExamResult` | teacher, admin | Fetches uploaded exam result documents from MongoDB for a course/semester. |
| POST | `/teacher/saveInternalMarkDetails` | teacher, admin | Saves an internal marks document (uploaded as a file to Cloudinary) to MongoDB `internalMarks`. Prevents duplicate uploads per teacher/course/sem. Sends a push notification to the affected class with a Cloudinary preview image of the marks sheet. |
| POST | `/teacher/checkInternalMarkUpload` | teacher, admin | Checks whether an internal mark document already exists for a given course/sem. |
| POST | `/teacher/getInternalMarkHistory` | teacher, admin | Paginated history of internal mark uploads by the requesting teacher. |
| POST | `/teacher/fetchParents` | teacher, admin | Returns verified parents linked to students in the teacher's assigned class. |
| POST | `/teacher/verifyParent` | teacher, admin | Marks a parent-child link as verified in Turso `parent_child`. |
| POST | `/teacher/removeParent` | teacher, admin | Removes a parent-child link. |

---

### Student — `/student`

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/student/fetchStudentsByClass` | Any | Returns all students for a course/year — used by parents and teachers. |
| GET | `/student/fetchStudentsByClassTeacher` | teacher, admin | Returns students in the class the requesting teacher is in-charge of. |
| POST | `/student/verifyStudent` | teacher, admin | Sets `is_verified = true` for a student in Turso, enabling them to be included in attendance. |
| POST | `/student/verifyMultipleStudents` | teacher, admin | Batch verification — verifies multiple students in one call. |
| POST | `/student/cancelStudentVerification` | teacher, admin | Reverts a student's verification status. |
| POST | `/student/saveStudentDetails` | teacher, admin | Updates additional student profile fields. |
| POST | `/student/autoAssignRollNoAlphabetically` | teacher, admin | Automatically assigns roll numbers to all students in a class sorted alphabetically by name. |
| POST | `/student/assignGroupedRollNo` | teacher, admin | Assigns roll numbers in a custom grouped order. |
| POST | `/student/removeAllByClassTeacher` | teacher, admin | Removes all students from the class the teacher is in-charge of (used for end-of-year resets). |
| POST | `/student/saveExamResultDetails` | Any | Saves an uploaded exam result document to MongoDB. |
| POST | `/student/checkExamResultUpload` | student | Checks if exam results have been uploaded for a given semester. |
| POST | `/student/getInternalMarks` | student | Fetches the student's internal marks documents from MongoDB. |
| GET | `/student/sync` | student | Returns the student's current `is_verified`, `rollno`, `course`, and `year` from Turso — used to re-sync local state after teacher actions. |

---

### Parent — `/parent`

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/parent/fetchByClassTeacher` | Any | Returns all parents linked to students in the teacher's class (joins `classes → students → parent_child → users`). |
| GET | `/parent/sync` | Any | Returns the parent's `is_verified` status and list of verified child `studentId`s from Turso. |

---

### Admin — `/admin`

All admin routes are gated behind both `authenticateToken` and `authorize("admin")`.

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/admin/teachers` | Returns all teacher accounts from Turso. |
| POST | `/admin/assignClass` | Sets a teacher as `in_charge` for a course/year in the `classes` table. |
| POST | `/admin/removeIncharge` | Clears the `in_charge` field for a class. |
| POST | `/admin/verifyTeacher` | Sets `is_verified = true` for a teacher account. |
| POST | `/admin/deleteTeacher` | Removes a teacher account and cascades deletions. |
| POST | `/admin/clearTable` | Clears a specific Turso table (used during dev/reset). |
| POST | `/admin/clearAllUsers` | Wipes all user rows — destructive, admin-only. |
| POST | `/admin/clearDbDocuments` | Drops MongoDB collections — destructive, admin-only. |

---

### Dashboard — `/dashboard`

Admin-only read endpoints for monitoring system health and usage.

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/dashboard/cloudinary` | Calls Cloudinary's `api.usage()` to return live storage and bandwidth stats. |
| GET | `/dashboard/turso` | Calls the Turso API client to return database usage stats. |
| GET | `/dashboard/users` | Runs `SELECT COUNT(userId), role FROM users GROUP BY role` in Turso and returns a role-keyed count object. |

---

## Current Infrastructure

DC-Connect runs entirely on **free-tier services**, keeping operational cost at zero while serving a small college department.

### Hosting & Availability

| Service | Role | Plan |
|---|---|---|
| **Render.com** | Primary backend host (Node.js / Express) | Free |
| **Vercel** | Fallback backend (serverless, same codebase) | Free |
| **UptimeRobot** | Pings Render every 5 minutes to prevent cold starts | Free |
| **Expo (EAS)** | Mobile app build & OTA updates | Free |

**Why the dual-host setup?**
Render's free tier spins down after 15 minutes of inactivity, causing ~30–50 second cold starts. UptimeRobot pings the `/` health endpoint on a schedule to keep the server warm. If Render is unresponsive, the client can be pointed to the Vercel deployment as a fallback. Vercel runs the same Express app via `@vercel/node` serverless functions.

> ⚠️ Note: Vercel serverless has stateless cold starts too, and does not support long-running processes like cron workers. The `monthlyAttendance` worker only runs reliably on Render.

### Data & Storage

| Service | What it stores | Plan |
|---|---|---|
| **MongoDB Atlas** | Assignments, notes, marks, reports, notifications | Free (M0 — 512 MB) |
| **Turso** | Users, classes, attendance, fees, relational records | Free (5 GB storage, 500M row reads/month, 10M writes/month) |
| **Cloudinary** | Profile pictures, assignment files, note attachments | Free (25 GB storage, 25 GB bandwidth/month) |

### Notifications

**Expo Push Notification Service (APNS/FCM bridge)** is used for all push notifications. The server uses the `expo-server-sdk` to dispatch notifications. No additional service or paid plan is required — Expo handles the APNS/FCM routing for free as long as you're on a managed Expo workflow.

---

## Capacity Estimate

The department runs **2 courses (BCA + BSC)** across **4 years each** = **8 classes total**.

### Assumed User Base

| Role | Count | Basis |
|---|---|---|
| Students | ~280 | 35 per class × 8 classes |
| Teachers | ~15 | ~1–2 per subject/class |
| Parents | ~250 | Most students have 1 linked parent |
| Admins | 1–3 | Department head + assistants |
| **Total** | **~548 users** | |

---

### Attendance Load — The Dominant Factor

Attendance is the most write-heavy and storage-heavy feature in DC-Connect. Every time a teacher marks attendance for a class hour, the server performs a **Turso write transaction** that inserts 1 row into `attendance` (the session header) and 35 rows into `attendance_details` (one per student).

**Given:**
- 35 students per class
- 5 attendance sessions per class per day (one per hour)
- 8 classes total (2 courses × 4 years)
- 27 working days per month
- ~10 academic months per year

#### Rows Written Per Attendance Session

Each call to `POST /attendance/save` (new session):

```
1 row  → attendance        (course, year, hour, date, teacherId, present_count, absent_count, ...)
35 rows → attendance_details (attendanceId, studentId, rollno, status)
─────────────────────────────────
36 rows written per session
```

#### Daily, Monthly, and Yearly Accumulation

```
Per day:
  8 classes × 5 hours = 40 sessions
  40 sessions × 36 rows = 1,440 rows written/day
    → 40 rows in attendance
    → 1,400 rows in attendance_details

Per month (27 working days):
  attendance:         40 × 27 = 1,080 rows
  attendance_details: 1,400 × 27 = 37,800 rows
  Total writes:       38,880 rows/month

Per academic year (~10 months):
  attendance:         10,800 rows
  attendance_details: 378,000 rows
  Total rows written: 388,800/year
```

#### Storage Impact on Turso

Schema-based byte estimates (from actual table definitions):

**`attendance` row** — `attendanceId` + `course` + `year` + `hour` + `date` + `timestamp` + `updated_timestamp` + `updated_by` + `teacherId` + `present_count` + `absent_count` + `late_count` + `strength` (computed stored) ≈ **~160 bytes/row**

**`attendance_details` row** — `attendanceDetailsId` + `attendanceId` + `studentId` + `rollno` + `status` ≈ **~48 bytes/row**

```
Annual storage:
  attendance:         10,800  × 160B  =  1.65 MB
  attendance_details: 378,000 × 48B   = 17.30 MB
  ─────────────────────────────────────────────
  Total per year:                       ~18.95 MB

Over 5 years:                           ~94.8 MB
```

**Turso free tier storage: 5 GB → attendance uses ~95 MB over 5 years (< 2% of limit).**

#### Row Reads Per Session

Each attendance save also triggers reads:
- `fetchStudentsForAttendance`: ~35 rows from `students` + ~35 from `attendance_details` (existing check)
- Update-window validation: ~1 read from `attendance`
- Push notification token lookup for absent students: ~35 rows from `users`

Conservatively ~106 reads per session:

```
Per day:    40 sessions × 106 = 4,240 reads
Per month:  4,240 × 27       = 114,480 reads
Per year:                    ~1,144,800 reads

Turso free limit: 500,000,000 reads/month
Attendance uses:  114,480/month → 0.023% of limit
```

#### Row Writes vs Turso Limit

```
Monthly writes from attendance:  38,880
Turso free limit:                10,000,000/month
Usage:                           0.39% of limit
```

✅ Attendance load is well within Turso's free tier on all dimensions — storage, reads, and writes.

---

### Attendance-Triggered Push Notifications

Every `attendance/save` call fires two sets of push notifications **after the transaction commits** — one to each absent student, one to each of their verified parents (queried from `parent_child`).

Assuming ~20% absence rate (~7 students absent per session):

```
Per session:  7 absent students + up to 7 parents = ~14 notifications
Per day:      40 sessions × 14 = 560 notifications
Per month:    560 × 27         = 15,120 notifications
Per year:                      ~151,200 notifications
```

Each notification also creates a document in MongoDB's `notifications` collection (~300 bytes each):

```
MongoDB storage for attendance notifications:
  151,200 docs × 300B = ~43 MB/year
```

Expo Push Notification Service handles the actual APNS/FCM delivery for free. The server just dispatches batched chunks via `expo-server-sdk` and schedules a receipt check 15 minutes later to auto-clean dead tokens from Turso.

---

### Per-Service Capacity vs. Expected Load

#### MongoDB Atlas — Free M0 (512 MB)

| Document Type | Est. Count/year | Avg Size | Total/year |
|---|---|---|---|
| Notifications (attendance-driven) | ~151,200 | ~300 B | ~43 MB |
| Assignments + submissions | ~500 | ~5 KB | ~2.5 MB |
| Notes metadata | ~200 | ~1 KB | ~0.2 MB |
| Attendance reports (Excel/PDF metadata) | ~96 (8 classes × 12 months) | ~1 KB | ~0.1 MB |
| Internal marks + exam results | ~2,000 | ~0.5 KB | ~1 MB |
| OTPs | — | disabled | — |
| **Total** | | | **~47 MB/year** |

Notifications dominate MongoDB storage because of volume, not size. At ~47 MB/year, the 512 MB M0 limit lasts roughly **10 years** at current load.

✅ MongoDB Atlas free tier is sufficient.

#### Turso — Free Tier (5 GB storage, 500M row reads/month, 10M writes/month)

| Table | Rows at end of year 1 |
|---|---|
| `attendance` | ~10,800 |
| `attendance_details` | ~378,000 |
| `students` | ~280 |
| `teachers` | ~15 |
| `parents` | ~250 |
| `worklogs` | ~10,800 (mirrors attendance sessions) |
| `fees`, `classes`, `teacher_courses` | < 1,000 combined |
| **Total rows** | **~400,000** |

| Metric | Monthly actual | Free limit | Usage |
|---|---|---|---|
| Row writes | ~38,880 | 10,000,000 | **0.39%** |
| Row reads | ~114,480 | 500,000,000 | **0.023%** |
| Storage (year 1) | ~19 MB | 5,000 MB | **0.38%** |
| Storage (year 5) | ~95 MB | 5,000 MB | **1.9%** |

✅ Turso free tier handles this with significant room to grow.

#### Cloudinary — Free (25 GB storage, 25 GB/month bandwidth)

| Asset Type | Est. Count/year | Avg Size | Total/year |
|---|---|---|---|
| Profile pictures | ~548 (one-time) | ~150 KB | ~80 MB |
| Assignment submissions | ~3,000 | ~500 KB | ~1.5 GB |
| Notes attachments | ~200 | ~1 MB | ~200 MB |
| Attendance reports (Excel + PDF) | ~192 files | ~200 KB | ~38 MB |
| Internal marks / exam sheets | ~100 | ~500 KB | ~50 MB |
| **Total** | | | **~1.87 GB/year** |

- **Bandwidth:** ~100 students downloading notes/assignments daily at ~500 KB avg = ~1.5 GB/month. Within the 25 GB free limit.

✅ Cloudinary free tier is sufficient. Monitor bandwidth if assignment files are large or re-downloaded frequently.

#### Render.com — Free Tier (512 MB RAM)

Peak load scenario: all 8 classes open the app at 8 AM for first-hour attendance.

- 8 teachers hit `/attendance/fetchStudentsForAttendance` simultaneously
- Then 8 teachers hit `/attendance/save` with 35-row bulk inserts
- Expo notifications dispatch async after each commit — non-blocking

Express handles each request in a few hundred milliseconds. With Node.js's event loop and the non-blocking notification dispatch, 8–16 concurrent requests is well within what a single free Render instance can manage. RAM usage for Express + Mongoose + libSQL client sits at ~150–250 MB at peak — within the 512 MB limit.

✅ Viable with UptimeRobot + Vercel fallback.

---

### Summary

| Service | Free Limit | Peak Monthly Usage | Headroom |
|---|---|---|---|
| MongoDB Atlas | 512 MB | ~4 MB/month | ~10 years |
| Turso — writes | 10M rows/month | ~38,880 | **0.39%** |
| Turso — reads | 500M rows/month | ~114,480 | **0.023%** |
| Turso — storage | 5 GB | ~19 MB/year | ~263 years |
| Cloudinary storage | 25 GB | ~1.87 GB/year | ~13 years |
| Cloudinary bandwidth | 25 GB/month | ~1.5 GB/month | ~16× headroom |
| Render RAM | 512 MB | ~150–250 MB at peak | Comfortable |
| Expo push notifications | Free (unlimited) | ~15,120/month | No limit |

> **Bottom line:** Attendance is by far the most active feature — generating ~38,880 Turso writes and ~151,200 push notifications per month — yet it barely registers against the free tier limits. The only real bottleneck to watch is **Cloudinary bandwidth** if assignment files are large or frequently re-downloaded, and **Render cold starts** if UptimeRobot pings are missed.

---

### Remaining Headroom for Other Features

After accounting for attendance (the dominant load), the free tier has a large amount of capacity left for every other feature in the app. Here's how that headroom gets consumed by the remaining functionality.

#### Turso — Writes (9,961,120 writes/month remaining after attendance)

Every other write-producing action in the app is low-frequency compared to attendance:

| Feature | Write operations | Est. monthly writes |
|---|---|---|
| User signups / profile edits | `users`, `students`, `parents` inserts + updates | ~50 |
| Teacher verification & class assignment | `teachers`, `classes` updates | ~10 |
| Roll number assignment | Batch `UPDATE students SET rollno` per class | ~280 (once per semester) |
| Student verification | `UPDATE users SET is_verified` | ~280 (once per semester) |
| Parent-child linking | `INSERT INTO parent_child` | ~250 (once, during signup) |
| Work logs | 1 `INSERT INTO worklogs` per teacher per hour | ~10,800/month (mirrors attendance sessions) |
| Fees | `INSERT INTO fees` per notice issued | ~50 |
| Token registration | `UPDATE users SET token` on login | ~548 (initial), occasional refreshes |
| **Total non-attendance writes** | | **~12,000/month** |

Combined with attendance: **~50,880 writes/month out of 10,000,000 → 0.5% of limit.**

Work logs are the second largest writer because teachers log a work entry for every class session alongside attendance — but even combined, the entire app uses less than 1% of Turso's write allowance.

#### Turso — Reads (499,885,520 reads/month remaining after attendance)

Reads spike when students or parents open the app and fetch their data. Key read-heavy flows:

| Feature | Query pattern | Est. reads per open |
|---|---|---|
| Student dashboard / sync | `students JOIN users` on login | ~3 rows |
| Attendance calendar view | CTE query across `attendance + attendance_details` for a month | ~1,400 rows (all sessions for the class) |
| Yearly attendance chart | Same CTE, scoped to full year | ~16,800 rows (one-time per year view) |
| Parent sync | `parent_child JOIN users` | ~3 rows |
| Teacher sign-in | `classes JOIN teacher_courses` for in-charge + courses | ~10 rows |
| Fetch students for attendance | `students LEFT JOIN users` for ~35 rows + existing session check | ~70 rows |
| Work log history (paginated) | `SELECT FROM worklogs WHERE teacherId` | ~15 rows/page |
| Fees list | `SELECT FROM fees WHERE course AND year` | ~10 rows |

Even if all 280 students open the attendance calendar view every day: 280 × 1,400 = 392,000 reads/day → ~10.6M reads/month. Combined with the attendance-taking reads (~114,480/month), total is still under **11M out of 500M → ~2.2% of limit.**

#### Turso — Storage (4,981 MB remaining after year 1 attendance)

At ~19 MB/year for attendance, all other Turso tables combined add negligible storage:

| Table | Est. size at end of year 1 |
|---|---|
| `users` (all roles) | ~548 rows × ~300B = ~0.16 MB |
| `worklogs` | ~10,800 rows × ~150B = ~1.6 MB |
| `fees` | ~600 rows × ~100B = ~0.06 MB |
| `teacher_courses`, `classes`, `parent_child` | < 0.1 MB combined |
| **All non-attendance tables** | **~1.9 MB** |

Total Turso storage after year 1: **~21 MB out of 5,000 MB.**

#### MongoDB — Remaining 465 MB after notifications (~43 MB/year)

The other MongoDB collections are well within budget:

| Collection | Annual volume | Notes |
|---|---|---|
| `assignments` | ~500 docs, ~2.5 MB | Each doc embeds the full `submissions` array; grows as students submit |
| `notes` | ~200 docs, ~0.2 MB | Metadata only — actual files are on Cloudinary |
| `internalMarks` | ~96 docs (8 classes × 12 sems over 4 years), ~0.1 MB | One doc per teacher/course/sem — enforced by unique index |
| `examResults` | ~96 docs, ~0.1 MB | Same structure as internal marks |
| `monthlyAttendanceReports` | ~96 docs × ~1 KB = ~0.1 MB | One doc per class per report generated; stores Cloudinary URLs, not the file |

All non-notification MongoDB data amounts to **~3 MB/year**, leaving the 512 MB Atlas M0 limit effectively unconstrained for the app's lifetime.

#### Cloudinary — Remaining ~23 GB storage and ~23.5 GB bandwidth after profile pictures

Profile pictures are uploaded once. The ongoing Cloudinary load is driven entirely by content uploads:

| Upload type | Frequency | Impact |
|---|---|---|
| Assignment submissions | ~3,000/year, ~500 KB avg | ~1.5 GB storage/year; bandwidth spikes when teachers review and students re-download |
| Notes (PDFs, slides) | ~200/year, ~1 MB avg | ~200 MB/year; downloaded repeatedly by the whole class |
| Internal marks / exam result sheets | ~200/year, ~500 KB avg | ~100 MB/year; one-time download per student |
| Attendance reports (Excel + PDF) | ~192 files/year, ~200 KB avg | ~38 MB/year; low re-download rate |

Notes are the bandwidth concern — a single popular notes file (~2 MB) downloaded by 280 students = 560 MB in one event. If teachers upload several such files per week, bandwidth can accumulate quickly. The 25 GB/month free limit gives room for this, but it's worth monitoring if file sizes are large.

---

## License

This project is intended for academic and educational use within the department.
