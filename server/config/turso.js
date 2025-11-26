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
        year_of_study text check (year_of_study IN ('First', 'Second', 'Third', 'Fourth')) not null,
        is_verified BOOLEAN DEFAULT FALSE,
        rollno integer default NULL,
        
        UNIQUE (course, year_of_study, rollno),
        CHECK (is_verified = 1 OR rollno IS NULL),
        foreign key (course, year_of_study) references classes(course, year)
    );
    `);

	turso.execute(
		`CREATE TABLE teachers ( 
          teacherId TEXT PRIMARY Key, 
          fullname text not null, 
          password text not null,
          in_charge_class text check (in_charge_class IN ('Bca', 'Bsc')) ,
          in_charge_year text check (in_charge_year IN ('First', 'Second', 'Third', 'Fourth')) , 
          is_verified BOOLEAN DEFAULT FALSE,
          is_in_charge BOOLEAN DEFAULT FALSE)`
	);

	turso.execute(
		"CREATE TABLE parents ( parentId TEXT PRIMARY Key, fullname text not null, password text not null, phone text)"
	);

	turso.execute(
		"CREATE TABLE parent_child (parentId INT NOT NULL, studentId INT NOT NULL, PRIMARY KEY (parentId, studentId), FOREIGN KEY (parentId) REFERENCES parents(parentId), FOREIGN KEY (studentId) REFERENCES students(studentId));"
	);

	turso.execute(
		"CREATE TABLE admins (adminId TEXT primary key, fullname text not null, password text not null);"
	);

	turso.execute(`
        create table classes (
            course text check (course in ('Bca', 'Bsc')),
            year text check (year IN ('First', 'Second', 'Third', 'Fourth')),
            strength integer,
            in_charge text REFERENCES teachers(teacherId),
            primary key (course, year)
        )
    `);

	turso.execute(`
        CREATE TABLE attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course TEXT,
            year TEXT,

            present TEXT,
            late_present TEXT,
            absent TEXT ,
            date DATE NOT NULL,

            teacherId TEXT NOT NULL,
            FOREIGN KEY (course, year) REFERENCES classes(course, year),
            FOREIGN KEY (teacherId) REFERENCES teachers(teacherId)
        );
    `);
};

const deleteAllTables = () => {
	turso.execute("drop table if exists students");
	turso.execute("drop table if exists teachers");
	turso.execute("drop table if exists parents");
	turso.execute("drop table if exists admins");
	turso.execute("drop table if exists parent_child");
};

const insertDefaultValues = () => {
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

// turso.execute("PRAGMA foreign_keys = ON;");
// turso.execute("INSERT INTO classes (course, year, strength, in_charge) VALUES ('Bca', 'First', 0, NULL), ('Bca', 'Second', 0, NULL), ('Bca', 'Third', 0, 'femina123'), ('Bsc', 'First', 0, NULL), ('Bsc', 'Second', 0, NULL), ('Bsc', 'Third', 0, NULL);");
