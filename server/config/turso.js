import "dotenv/config";

import { createClient } from "@libsql/client/web";

export const turso = createClient({
	url: process.env.PRIMARY_DATABASE_URL,
	authToken: process.env.PRIMARY_DATABASE_TOKEN,
});







// turso.execute("PRAGMA foreign_keys = ON;");
// turso.execute("INSERT INTO classes (course, year, strength, in_charge) VALUES ('Bca', 'First', 0, NULL), ('Bca', 'Second', 0, NULL), ('Bca', 'Third', 0, 'femina123'), ('Bsc', 'First', 0, NULL), ('Bsc', 'Second', 0, NULL), ('Bsc', 'Third', 0, NULL);");

