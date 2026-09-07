import { db } from './index.ts';
import { citizens } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name: string) {
  const result = await db.insert(citizens)
    .values({
      uid,
      publicId: `CIT-JH-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      email,
      name,
    })
    .onConflictDoUpdate({
      target: citizens.uid,
      set: {
        email,
        name,
        lastActiveAt: new Date(),
      },
    })
    .returning();

  return result[0];
}

export async function getUserById(id: number) {
  try {
    const result = await db.select().from(citizens).where(eq(citizens.id, id));
    return result[0];
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed", { cause: error });
  }
}
