import "dotenv/config";

import { createClient } from "@libsql/client";

export const turso = createClient({
  url: process.env.PRIMARY_DATABASE_URL,
  authToken: process.env.PRIMARY_DATABASE_TOKEN,
});

const studentTable = () => {
  // turso.execute(`DROP TABLE IF EXISTS students`);
  turso.execute(`
    CREATE TABLE students (
        username TEXT primary key,
        fullname TEXT not null,
        password TEXT not null,
        role TEXT CHECK (role IN ('student', 'admin', 'teacher', 'parent')) not null,
        course TEXT CHECK (course IN ('Bca', 'Bsc')) not null,
        year_of_study text check (year_of_study IN ('First', 'Second', 'Third', 'Fourth')) not null
    );
    `);
};

// studentTable();
