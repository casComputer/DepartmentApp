import "dotenv/config";

import { createClient } from "@libsql/client/web";
import { createClient as statsClient } from "@tursodatabase/api";

import { third_bsc as students } from "../constants/students.js";
import { teachers } from "../constants/teachers.js";

const PRIMARY_DATABASE_URL = process.env.PRIMARY_DATABASE_URL;
const PRIMARY_DATABASE_TOKEN = process.env.PRIMARY_DATABASE_TOKEN;
const PRIMARY_DATABASE_ADMIN_TOKEN = process.env.PRIMARY_DATABASE_ADMIN_TOKEN;
const PRIMARY_DATABASE_ORGANISATION = process.env.PRIMARY_DATABASE_ORGANISATION;

export const turso = createClient({
    url: PRIMARY_DATABASE_URL,
    authToken: PRIMARY_DATABASE_TOKEN,
});

export const tursoStats = statsClient({
    org: PRIMARY_DATABASE_ORGANISATION,
    token: PRIMARY_DATABASE_ADMIN_TOKEN,
});

const signupAllStudents = async () => {
    const url = "http://10.63.31.11:3000/auth/signup";

    for (const fullName of students) {
        const username = fullName
            .toLowerCase()
            .split(" ")
            .map((word, index) =>
                index === 0
                    ? word
                    : word.charAt(0).toUpperCase() + word.slice(1),
            )
            .join("");

        const studentData = {
            username: username,
            fullName: fullName,
            password: username,
            userRole: "student",
            course: "Bca",
            year: "Third",
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(studentData),
            });

            const data = await response.json();
            console.log(`✅ Created: ${fullName}`, data);
        } catch (error) {
            console.error(`❌ Error creating ${fullName}:`, error);
        }
    }
};

// turso.execute("alter table users add column is_email_verified boolean default false;");