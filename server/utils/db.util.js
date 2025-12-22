import { turso } from "../config/turso.js";

export const createAllTables = async () => {
    await turso.execute(`
    CREATE TABLE students (
        studentId TEXT primary key,
        fullname TEXT not null,
        password TEXT not null,
        course TEXT CHECK (course IN ('Bca', 'Bsc')) not null,
        year_of_study text check (year_of_study IN ('First', 'Second', 'Third', 'Fourth')) not null,
        is_verified BOOLEAN DEFAULT FALSE,
        rollno integer default NULL,
        
        UNIQUE (course, year_of_study, rollno),
        CHECK (is_verified = 1 OR rollno IS NULL)
    );
    `);

    await turso.execute(
        `CREATE TABLE teachers ( 
          teacherId TEXT PRIMARY Key, 
          fullname text not null, 
          password text not null,
          is_verified BOOLEAN DEFAULT FALSE,
        );`
    );

    await turso.execute(
        "CREATE TABLE parents ( parentId TEXT PRIMARY Key, fullname text not null, password text not null, phone text)"
    );

    await turso.execute(
        "CREATE TABLE parent_child (parentId INT NOT NULL, studentId INT NOT NULL, PRIMARY KEY (parentId, studentId), FOREIGN KEY (parentId) REFERENCES parents(parentId), FOREIGN KEY (studentId) REFERENCES students(studentId));"
    );

    await turso.execute(
        "CREATE TABLE admins (adminId TEXT primary key, fullname text not null, password text not null);"
    );

    await turso.execute(`
        create table classes (
            course text check (course in ('Bca', 'Bsc')),
            year text check (year IN ('First', 'Second', 'Third', 'Fourth')),
            strength integer,
            in_charge text REFERENCES teachers(teacherId),
            primary key (course, year)
        )
    `);
};

export const deleteAllTables = () => {
    turso.execute("drop table if exists students");
    turso.execute("drop table if exists teachers");
    turso.execute("drop table if exists admins");
    turso.execute("drop table if exists parents");
    turso.execute("drop table if exists parent_child");
    turso.execute("drop table if exists classes");
};

export const insertDefaultValues = () => {
    turso.execute(`
        insert into classes values 
            ('Bca', 'First', 0),
            ('Bca', 'Second', 0),
            ('Bca', 'Third', 0),
            ('Bca', 'Fourth', 0),
            
            ('Bsc', 'First', 0),
            ('Bsc', 'Second', 0),
            ('Bsc', 'Third', 0),
            ('Bsc', 'Fourth', 0),
    `);
};
