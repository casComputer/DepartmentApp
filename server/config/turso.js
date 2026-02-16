import "dotenv/config";

import { createClient } from "@libsql/client/web";
import { createClient as statsClient } from "@tursodatabase/api";

const PRIMARY_DATABASE_URL = process.env.PRIMARY_DATABASE_URL;
const PRIMARY_DATABASE_TOKEN = process.env.PRIMARY_DATABASE_TOKEN;
const PRIMARY_DATABASE_ADMIN_TOKEN = process.env.PRIMARY_DATABASE_ADMIN_TOKEN;
const PRIMARY_DATABASE_ORGANISATION = process.env.PRIMARY_DATABASE_ORGANISATION;

export const turso = createClient({
    url: PRIMARY_DATABASE_URL,
    authToken: PRIMARY_DATABASE_TOKEN
});

export const tursoStats = statsClient({
    org: PRIMARY_DATABASE_ORGANISATION,
    token: PRIMARY_DATABASE_ADMIN_TOKEN
});

turso.execute(`
  SELECT
    c.year  AS in_charge_year,
    c.course AS in_charge_course,
    tc.year  AS teaching_year,
    tc.course AS teaching_course,
    tc.course_name
  FROM classes c
  LEFT JOIN teacher_courses tc
    ON tc.teacherId = c.in_charge
  WHERE c.in_charge = 'femina'
`)
.then((res) => console.log(res.rows))
.catch((err) => console.log(err));
