import "dotenv/config";

import { createClient } from "@libsql/client/web";

export const turso = createClient({
  url: process.env.PRIMARY_DATABASE_URL,
  authToken: process.env.PRIMARY_DATABASE_TOKEN,
});
