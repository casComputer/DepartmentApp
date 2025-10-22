import "dotenv/config";

import { createClient } from "@libsql/client";

export const turso = createClient({
  url: process.env.PRIMARY_DATABASE_URL,
  authToken: process.env.PRIMARY_DATABASE_TOKEN,
});

const createStudentTable = () => {
  turso.execute(`
    CREATE TABLE students (
        studentId TEXT primary key,
        fullname TEXT not null,
        password TEXT not null,
        course TEXT CHECK (course IN ('Bca', 'Bsc')) not null,
        year_of_study text check (year_of_study IN ('First', 'Second', 'Third', 'Fourth')) not null
    );
    `);
};

const createTeacherTable = () => {
  turso.execute(
    "CREATE TABLE teachers ( teacherId TEXT PRIMARY Key, fullname text not null, password text not null, in_charge text)"
  );
};

const createParentTable = () => {
  turso.execute(
    "CREATE TABLE parents ( parentId TEXT PRIMARY Key, fullname text not null, password text not null, phone text)"
  );
};

const createParentChildTable = () => {
  turso.execute(
    "CREATE TABLE parent_child (parentId INT NOT NULL, studentId INT NOT NULL, PRIMARY KEY (parentId, studentId), FOREIGN KEY (parentId) REFERENCES parents(parentId), FOREIGN KEY (studentId) REFERENCES students(studentId));"
  );
};

const createTableAdmin = () => {
  turso.execute(
    "CREATE TABLE admin (adminId TEXT primary key, fullname text not null, password text not null);"
  );
};

const clearStudentTable = () => {
  turso.execute(`DELETE FROM students`);
};

const deleteAllTables = () => {
  turso.execute("drop table if exists students");
  turso.execute("drop table if exists teachers");
  turso.execute("drop table if exists parents");
  turso.execute("drop table if exists admins");
  turso.execute("drop table if exists parent_child");
};

// deleteAllTables()

// createStudentTable();
// createParentTable();
// createTeacherTable();
// createParentChildTable();
// createTableAdmin();
