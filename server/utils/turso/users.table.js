turso.execute(`
    CREATE TABLE users (
    userId TEXT PRIMARY KEY,
    fullname TEXT not null,
    password TEXT not null,

    dp TEXT,
    dp_public_id TEXT,
    email TEXT,
    phone TEXT,
    about TEXT,

    role TEXT NOT NULL CHECK(role IN('admin', 'teacher', 'student', 'parent')),

    is_verified BOOLEAN DEFAULT FALSE,
    joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `);

turso.execute(`
    CREATE TABLE students (
    userId TEXT NOT NULL,

    course TEXT CHECK (course IN ('Bca', 'Bsc')),
    year text check (year IN ('First', 'Second', 'Third', 'Fourth')),
    rollno integer default NULL,

    UNIQUE (course, year, rollno),

    foreign key (course, year) references classes(course, year) ON DELETE SET NULL,
    foreign key (userId) references users(userId) ON DELETE CASCADE,
    );
    `);

turso.execute(
    `CREATE TABLE parent_child (
            parentId TEXT NOT NULL,
            studentId TEXT NOT NULL, 
            PRIMARY KEY (parentId, studentId), 
            FOREIGN KEY (parentId) REFERENCES users(userId) ON DELETE CASCADE,
            FOREIGN KEY (studentId) REFERENCES users(userId) ON DELETE CASCADE
        );`
);

turso.execute(`
    create table classes (
    course text check (course in ('Bca', 'Bsc')),
    year text check (year IN ('First', 'Second', 'Third', 'Fourth')),
    strength integer,
    in_charge text UNIQUE REFERENCES users(userId) ON DELETE SET NULL,
    primary key (course, year)
    )
    `);

turso.execute(`
    CREATE TABLE IF NOT EXISTS attendance (
    attendanceId INTEGER PRIMARY KEY AUTOINCREMENT,

    course TEXT,
    year TEXT,
    hour TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    date TEXT NOT NULL,
    updated_timestamp TEXT,
    updated_by TEXT,

    teacherId TEXT NOT NULL,

    present_count INTEGER NOT NULL DEFAULT 0,
    absent_count INTEGER NOT NULL DEFAULT 0,
    late_count INTEGER NOT NULL DEFAULT 0,

    strength INTEGER
    GENERATED ALWAYS AS (
    present_count + absent_count + late_count
    ) STORED,

    UNIQUE (course, year, hour, date),

    FOREIGN KEY (course, year)
    REFERENCES classes(course, year),

    FOREIGN KEY (teacherId) REFERENCES users(userId) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(userId) ON DELETE SET NULL,

    );
    `);

turso.execute(`
    CREATE TABLE IF NOT EXISTS attendance_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attendanceId INTEGER NOT NULL,
    studentId TEXT NOT NULL,
    rollno INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present','absent', 'late')),

    FOREIGN KEY (attendanceId) REFERENCES attendance(attendanceId) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES users(userId) ON DELETE CASCADE
    );
    `);

turso.execute(`
    CREATE TABLE worklogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    year TEXT,
    course TEXT,
    date TEXT NOT NULL,
    hour TEXT NOT NULL,
    subject TEXT NOT NULL,
    topics TEXT NOT NULL,

    teacherId TEXT NOT NULL,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(teacherId, date, hour),

    FOREIGN KEY (teacherId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (year, course) REFERENCES classes(year, course));
    `);

turso.execute(`
    CREATE TABLE fees (
    feeId INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT,
    course TEXT,
    dueDate TEXT NOT NULL,
    details TEXT NOT NULL,
    amount TEXT NOT NULL,

    teacherId TEXT NOT NULL,

    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (teacherId) REFERENCES users(userId) ON DELETE SET NULL,
    FOREIGN KEY (year, course) REFERENCES classes(year, course) ON DELETE SET NULL,


    );
    `);

turso.execute(`
    CREATE TABLE teacher_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacherId TEXT NOT NULL,

    year TEXT,
    course TEXT,
    course_name TEXT NOT NULL,

    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (course_name, year, course),

    FOREIGN KEY (year, course) REFERENCES classes(year, course) ON DELETE SET NULL,
    FOREIGN KEY (teacherId) REFERENCES users(userId) ON DELETE CASCADE
    );

    `);

////////////////////////////////////////////////////
///                    VIEWS                     ///
////////////////////////////////////////////////////

turso.execute(`CREATE VIEW class_strength AS
SELECT
  c.course,
  c.year,
  COUNT(s.student_id) AS strength,
  c.in_charge
FROM classes c
LEFT JOIN students s
  ON s.course = c.course
 AND s.year = c.year
GROUP BY c.course, c.year;`);
