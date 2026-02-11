import { db } from "./db";
import { 
  users, organizations, teams, teamMembers, portfolio, 
  communications, auditLogs,
  type User, type Organization, type Communication,
  type Portfolio, type Team, type AuditLog
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getOrganization(id: number): Promise<Organization | undefined>;
  getPortfolios(orgId: number): Promise<Portfolio[]>;
  getCommunications(orgId: number): Promise<Communication[]>;
  getAuditLogs(orgId: number, limit?: number): Promise<AuditLog[]>;
  createAuditLog(log: any): Promise<AuditLog>;
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

  async getAuditLogs(orgId: number, limit = 10): Promise<AuditLog[]> {
    try {
      return await db.select()
        .from(auditLogs)
        .where(eq(auditLogs.organizationId, orgId))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit);
    } catch { return []; }
  }

  async createAuditLog(log: any): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
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
          { organizationId: newOrg.id, name: "Cyber Intel Node A", status: "active", valuation: 1200000, performanceGrade: "AAA" },
          { organizationId: newOrg.id, name: "Alliance Property Group", status: "active", valuation: 8500000, performanceGrade: "A+" }
        ]);

        await db.insert(communications).values([
          { organizationId: newOrg.id, type: "newsletter", title: "Global Security Update Q1", content: "Updates on node synchronization and RSA-4096 implementation.", status: "published" }
        ]);

        await db.insert(auditLogs).values([
          { organizationId: newOrg.id, action: "Core Auth Synchronization", targetType: "System", severity: "info", metadata: { node: "Node-SGP-1" } },
          { organizationId: newOrg.id, action: "Security Policy Propagated", targetType: "Security", severity: "info", metadata: { scope: "Global-Root" } }
        ]);
      }
    } catch (e) { console.error("Seed error:", e); }
  }
}

export const storage = new DatabaseStorage();
storage.seedInitialData().catch(console.error);
