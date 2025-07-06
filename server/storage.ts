import { users, registrations, type User, type InsertUser, type Registration, type InsertRegistration } from "@shared/schema";
import { db } from "./db";
import { eq, count, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  getRegistrationByEmail(email: string): Promise<Registration | undefined>;
  createRegistration(insertRegistration: InsertRegistration): Promise<Registration>;
  getRegistrationCount(): Promise<number>;
  getAllRegistrations(): Promise<Registration[]>;
  deleteRegistration(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getRegistrationByEmail(email: string): Promise<Registration | undefined> {
    const [registration] = await db.select().from(registrations).where(eq(registrations.email, email));
    return registration || undefined;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const [registration] = await db
      .insert(registrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async getRegistrationCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(registrations);
    return Number(result.count);
  }

  async getAllRegistrations(): Promise<Registration[]> {
    const results = await db.select().from(registrations).orderBy(desc(registrations.createdAt));
    return results;
  }

  async deleteRegistration(id: number): Promise<void> {
    await db.delete(registrations).where(eq(registrations.id, id));
  }
}

export const storage = new DatabaseStorage();