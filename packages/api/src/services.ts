import { randomUUID } from "node:crypto";

type DbModule = typeof import("@repo/db");
type DrizzleModule = typeof import("drizzle-orm");

async function getDb() {
  try {
    const [{ db, contacts }, { eq }] = await Promise.all([
      import("@repo/db") as Promise<DbModule>,
      import("drizzle-orm") as Promise<DrizzleModule>,
    ]);
    return { db, contacts, eq };
  } catch (e) {
    const hint =
      "Database driver failed to load. If you're on Windows, you may need to allow/install native builds for better-sqlite3 (and have C++ build tools available).";
    const err = new Error(`${hint}\n\n${(e as Error).message}`);
    (err as any).cause = e;
    throw err;
  }
}

export async function listContacts() {
  const { db, contacts } = await getDb();
  return await db.select().from(contacts).all();
}

export async function createContact(input: { name: string; phone: string; email?: string | null }) {
  const { db, contacts } = await getDb();
  const row = {
    id: randomUUID(),
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    createdAt: new Date(),
  };

  await db.insert(contacts).values(row);
  return row;
}

export async function deleteContact(id: string) {
  const { db, contacts, eq } = await getDb();
  await db.delete(contacts).where(eq(contacts.id, id));
}

