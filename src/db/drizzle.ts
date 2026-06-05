import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle(databaseUrl, { schema });
