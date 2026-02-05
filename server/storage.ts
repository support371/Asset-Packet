import { db } from "./db";
import { 
  users, organizations, teams, teamMembers, portfolio, 
  communications, auditLogs,
  type User, type Organization, type Communication,
  type Portfolio, type Team
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getOrganization(id: number): Promise<Organization | undefined>;
  getPortfolios(orgId: number): Promise<Portfolio[]>;
  getCommunications(orgId: number): Promise<Communication[]>;
  seedInitialData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async getPortfolios(orgId: number): Promise<Portfolio[]> {
    try {
      return await db.select().from(portfolio).where(eq(portfolio.organizationId, orgId));
    } catch { return []; }
  }

  async getCommunications(orgId: number): Promise<Communication[]> {
    try {
      return await db.select().from(communications).where(eq(communications.organizationId, orgId));
    } catch { return []; }
  }

  async seedInitialData(): Promise<void> {
    try {
      const [org] = await db.select().from(organizations).limit(1);
      if (!org) {
        const [newOrg] = await db.insert(organizations).values({
          name: "SSA Enterprise",
          slug: "ssa-enterprise",
          plan: "enterprise"
        }).returning();

        await db.insert(portfolio).values([
          { organizationId: newOrg.id, name: "Cyber Intel Node A", status: "active", valuation: 1200000 },
          { organizationId: newOrg.id, name: "Alliance Property Group", status: "active", valuation: 8500000 }
        ]);

        await db.insert(communications).values([
          { organizationId: newOrg.id, type: "newsletter", title: "Global Security Update Q1", content: "Updates on node synchronization...", status: "published" }
        ]);
      }
    } catch (e) { console.error("Seed error:", e); }
  }
}

export const storage = new DatabaseStorage();
storage.seedInitialData().catch(console.error);
