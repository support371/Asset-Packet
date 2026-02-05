import { pgTable, text, serial, integer, jsonb, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Organizations (Tenants)
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().default("default"),
  plan: text("plan").notNull().default("enterprise"), // enterprise, professional, basic
  isSafeMode: boolean("is_safe_mode").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Users & RBAC
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  replitId: text("replit_id").unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  organizationId: integer("organization_id").references(() => organizations.id),
  role: text("role").notNull().default("viewer"), // super_admin, admin, team_member, client, partner, subscriber
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teams within Organizations
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User-Team Mapping
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: integer("userId").references(() => users.id).notNull(),
});

// Portfolio Assets
export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(), // active, pending, closed
  valuation: doublePrecision("valuation").default(0),
  notes: text("notes"),
  attachments: jsonb("attachments").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Investments
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  portfolioId: integer("portfolio_id").references(() => portfolio.id),
  amount: doublePrecision("amount").notNull(),
  returns: doublePrecision("returns").default(0),
  status: text("status").notNull(), // active, exited
  reportUrl: text("report_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Grants Lifecycle
export const grants = pgTable("grants", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(), // created, reviewed, approved, allocated, closed
  amount: doublePrecision("amount").default(0),
  beneficiary: text("beneficiary"),
  complianceNotes: text("compliance_notes"),
  attachments: jsonb("attachments").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Newsletter & Communications
export const communications = pgTable("communications", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  type: text("type").notNull(), // newsletter, announcement
  title: text("title").notNull(),
  content: text("content").notNull(),
  targetRoles: jsonb("target_roles").default([]), // For announcements
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit Logging
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  organizationId: integer("organization_id").references(() => organizations.id),
  action: text("action").notNull(),
  targetType: text("target_type"), // user, grant, investment, etc.
  targetId: integer("target_id"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertOrgSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true });
export const insertGrantSchema = createInsertSchema(grants).omit({ id: true, createdAt: true });
export const insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, createdAt: true });
export const insertPortfolioSchema = createInsertSchema(portfolio).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Grant = typeof grants.$inferSelect;
export type Investment = typeof investments.$inferSelect;
export type Portfolio = typeof portfolio.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
