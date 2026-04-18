import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DB_PATH = path.resolve(process.cwd(), "../../contacts.db");

const sqlite = new Database(DB_PATH);
export const db = drizzle(sqlite, { schema });

export { contacts } from "./schema";
export { sql } from "drizzle-orm";

