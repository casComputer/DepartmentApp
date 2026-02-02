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

