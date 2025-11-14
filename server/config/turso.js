import "dotenv/config";

import { createClient } from "@libsql/client/web";

export const turso = createClient({
  url: process.env.PRIMARY_DATABASE_URL,
  authToken: process.env.PRIMARY_DATABASE_TOKEN,
});

const createAllTables = () => {
  turso.execute(`
    CREATE TABLE students (
        studentId TEXT primary key,
        fullname TEXT not null,
        password TEXT not null,
        course TEXT CHECK (course IN ('Bca', 'Bsc')) not null,
        year_of_study text check (year_of_study IN ('First', 'Second', 'Third', 'Fourth')) not null
    );
    `);

    turso.execute(
      "CREATE TABLE teachers ( teacherId TEXT PRIMARY Key, fullname text not null, password text not null, in_charge_class text, in_charge_year text, is_verified BOOLEAN DEFAULT FALSE, is_in_charge BOOLEAN DEFAULT FALSE)"
    );
    
    turso.execute(
      "CREATE TABLE parents ( parentId TEXT PRIMARY Key, fullname text not null, password text not null, phone text)"
    );
    
    turso.execute(
      "CREATE TABLE parent_child (parentId INT NOT NULL, studentId INT NOT NULL, PRIMARY KEY (parentId, studentId), FOREIGN KEY (parentId) REFERENCES parents(parentId), FOREIGN KEY (studentId) REFERENCES students(studentId));"
    );
    
    turso.execute(
      "CREATE TABLE admin (adminId TEXT primary key, fullname text not null, password text not null);"
    );
};

const deleteAllTables = () => {
  turso.execute("drop table if exists students");
  turso.execute("drop table if exists teachers");
  turso.execute("drop table if exists parents");
  turso.execute("drop table if exists admins");
  turso.execute("drop table if exists parent_child");
};

const createAdmin = () => {
  turso.execute(
    "INSERT INTO admin (adminId, fullname, password) VALUES ('admin1234', 'Administrator', '$2b$10$FhjsbZTgm/yWOIkQlIYNluDYvZBi9nRRMjmLxmaYVsW6H9tAhIvU2');"
  );
}

// createAdmin()

// deleteAllTables()

// createStudentTable();
// createParentTable();
// createTeacherTable();
// createParentChildTable();
// createTableAdmin();