const createAllTables = () => {
    turso.execute(`
    CREATE TABLE students (
        studentId TEXT primary key,
        dp TEXT, 
        dp_public_id TEXT, 
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
          dp TEXT, 
          dp_public_id TEXT, 
          fullname text not null, 
          password text not null,
          in_charge_class text check (in_charge_class IN ('Bca', 'Bsc')) ,
          in_charge_year text check (in_charge_year IN ('First', 'Second', 'Third', 'Fourth')) , 
          is_verified BOOLEAN DEFAULT FALSE,
          is_in_charge BOOLEAN DEFAULT FALSE)`
    );

    turso.execute(
        "CREATE TABLE parents ( parentId TEXT PRIMARY Key, dp TEXT, dp_public_id TEXT, fullname text not null, password text not null, phone text)"
    );

    turso.execute(
        "CREATE TABLE parent_child (parentId INT NOT NULL, studentId INT NOT NULL, PRIMARY KEY (parentId, studentId), FOREIGN KEY (parentId) REFERENCES parents(parentId), FOREIGN KEY (studentId) REFERENCES students(studentId) ON DELETE CASCADE);"
    );

    turso.execute(
        "CREATE TABLE admins (adminId TEXT primary key, dp TEXT, dp_public_id TEXT, fullname text not null, password text not null);"
    );

    turso.execute(`
        create table classes (
            course text check (course in ('Bca', 'Bsc')),
            year text check (year IN ('First', 'Second', 'Third', 'Fourth')),
            strength integer,
            in_charge text REFERENCES teachers(teacherId) ON DELETE SET NULL,
            primary key (course, year)
        )
    `);

    turso.execute(`
		CREATE TABLE IF NOT EXISTS attendance (
			attendanceId INTEGER PRIMARY KEY AUTOINCREMENT,
			course TEXT NOT NULL,
			year TEXT NOT NULL,
			hour TEXT NOT NULL,
			date DATE NOT NULL,
			timestamp TEXT NOT NULL,
			teacherId TEXT NOT NULL,
			present_count int not null default 0,
			absent_count int not null default 0,
			late_count int not null default 0,
			strength INTEGER
      			GENERATED ALWAYS AS (present_count + absent_count + late_count) STORED,
			
			UNIQUE (course, year, hour, date),
			FOREIGN KEY (course, year) REFERENCES classes(course, year),
			FOREIGN KEY (teacherId) REFERENCES teachers(teacherId) ON DELETE SET NULL
		);`);

    turso.execute(`
		CREATE TABLE IF NOT EXISTS attendance_details (
			attendanceDetailsId INTEGER PRIMARY KEY AUTOINCREMENT,
			attendanceId INTEGER NOT NULL,
			studentId TEXT NOT NULL,
			status TEXT NOT NULL CHECK (status IN ('present','absent', 'late')),
			
			FOREIGN KEY (attendanceId) REFERENCES attendance(attendanceId) ON DELETE CASCADE,
			FOREIGN KEY (studentId) REFERENCES students(studentId) ON DELETE CASCADE
		);
	`);

    turso.execute(`
		CREATE TABLE worklogs (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			year TEXT NOT NULL, 
			course TEXT NOT NULL, 
			date TEXT NOT NULL, 
			hour TEXT NOT NULL,
			subject TEXT NOT NULL, 
			topics TEXT NOT NULL,
			teacherId TEXT NOT NULL,
			createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	
			UNIQUE(teacherId, date, hour),
			FOREIGN KEY (teacherId) REFERENCES teachers(teacherId) ON DELETE CASCADE,
			FOREIGN KEY (year, course) REFERENCES classes(year, course));
		`);

    turso.execute(`
      CREATE TABLE fees (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        year TEXT NOT NULL, 
        course TEXT NOT NULL, 
        dueDate TEXT NOT NULL, 
        details TEXT NOT NULL, 
        amount TEXT NOT NULL, 
        
        teacherId TEXT,
        adminId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
        FOREIGN KEY (teacherId) REFERENCES teachers(teacherId) ON DELETE SET NULL,
        FOREIGN KEY (adminId) REFERENCES admins(adminId) ON DELETE SET NULL,
        FOREIGN KEY (year, course) REFERENCES classes(year, course),
    
        CHECK (
          (teacherId IS NOT NULL AND adminId IS NULL)
          OR
          (teacherId IS NULL AND adminId IS NOT NULL)
        )
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
