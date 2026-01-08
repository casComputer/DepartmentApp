import "dotenv/config";

import { createClient } from "@libsql/client/web";

const PRIMARY_DATABASE_URL = process.env.PRIMARY_DATABASE_URL;
const PRIMARY_DATABASE_TOKEN = process.env.PRIMARY_DATABASE_TOKEN;

export const turso = createClient({
    url: PRIMARY_DATABASE_URL,
    authToken: PRIMARY_DATABASE_TOKEN,
});
