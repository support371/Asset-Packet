import { db } from "./db";
import { 
  users, organizations, teams, teamMembers, portfolio, 
  investments, grants, communications, auditLogs,
  type User, type Organization, type Grant, type Investment, 
  type Portfolio, type AuditLog 
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  
  // Organizations
  getOrganization(id: number): Promise<Organization | undefined>;
  createOrganization(org: any): Promise<Organization>;
  
  // Portfolio
  getPortfolios(orgId: number): Promise<Portfolio[]>;
  createPortfolio(data: any): Promise<Portfolio>;
  
  // Investments
  getInvestments(orgId: number): Promise<Investment[]>;
  createInvestment(data: any): Promise<Investment>;
  
  // Grants
  getGrants(orgId: number): Promise<Grant[]>;
  createGrant(data: any): Promise<Grant>;
  
  // Audit
  createAuditLog(log: any): Promise<AuditLog>;
  getAuditLogs(orgId: number): Promise<AuditLog[]>;

  // Seeds
  seedInitialData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: any): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async createOrganization(org: any): Promise<Organization> {
    const [newOrg] = await db.insert(organizations).values(org).returning();
    return newOrg;
  }

  async getPortfolios(orgId: number): Promise<Portfolio[]> {
    return await db.select().from(portfolio).where(eq(portfolio.organizationId, orgId));
  }

  async createPortfolio(data: any): Promise<Portfolio> {
    const [item] = await db.insert(portfolio).values(data).returning();
    return item;
  }

  async getInvestments(orgId: number): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.organizationId, orgId));
  }

  async createInvestment(data: any): Promise<Investment> {
    const [item] = await db.insert(investments).values(data).returning();
    return item;
  }

  async getGrants(orgId: number): Promise<Grant[]> {
    return await db.select().from(grants).where(eq(grants.organizationId, orgId));
  }

  async createGrant(data: any): Promise<Grant> {
    const [item] = await db.insert(grants).values(data).returning();
    return item;
  }

  async createAuditLog(log: any): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getAuditLogs(orgId: number): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).where(eq(auditLogs.organizationId, orgId));
  }

  async seedInitialData(): Promise<void> {
    const [org] = await db.select().from(organizations);
    if (!org) {
      const [newOrg] = await db.insert(organizations).values({
        name: "SSA Enterprise",
        domain: "ssa.global",
        settings: {}
      }).returning();

      await db.insert(portfolio).values([
        { organizationId: newOrg.id, name: "Cyber Intel Node A", type: "Security", status: "active", details: {} },
        { organizationId: newOrg.id, name: "Alliance Property Group", type: "Real Estate", status: "active", details: {} }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
storage.seedInitialData().catch(console.error);
