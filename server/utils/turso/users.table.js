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

    role TEXT CHECK(role IN('admin', 'teacher', 'student', 'parent')),

    is_verified BOOLEAN DEFAULT FALSE,
    joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    );
    `);

turso.execute(`
    CREATE TABLE students (
        studentId TEXT NOT NULL,
        
        course TEXT CHECK (course IN ('Bca', 'Bsc')) not null,
        year_of_study text check (year_of_study IN ('First', 'Second', 'Third', 'Fourth')) not null,
        rollno integer default NULL,

        UNIQUE (course, year_of_study, rollno),
        CHECK (is_verified = 1 OR rollno IS NULL),
        foreign key (course, year_of_study) references classes(course, year) ON DELETE SET NULL,
        foreign key (studentId) references users(userId) ON DELETE CASCADE,
    );
    `);

turso.execute(
    `CREATE TABLE teachers ( 
          teacherId TEXT NOT NULL, 
        );`,
  );
  
 turso.execute(
    `CREATE TABLE parents(
            parentId TEXT NOT NULL,
            
        )`,
  );
  
  turso.execute(
    `CREATE TABLE admins (
        adminId TEXT NOT NULL,
        );`
  );