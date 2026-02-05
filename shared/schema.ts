import { pgTable, text, serial, integer, jsonb, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Organizations (Tenants)
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().default("default"),
  plan: text("plan").notNull().default("enterprise"),
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
  role: text("role").notNull().default("viewer"), 
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teams within Organizations
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  division: text("division").notNull().default("GEM"), // GEM, Alliance
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
  status: text("status").notNull(), 
  valuation: doublePrecision("valuation").default(0),
  notes: text("notes"),
  attachments: jsonb("attachments").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Communications (Newsletters/Announcements)
export const communications = pgTable("communications", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  type: text("type").notNull(), // newsletter, announcement
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"), // draft, published
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit Logging
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  organizationId: integer("organization_id").references(() => organizations.id),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: integer("target_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertOrgSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true });
export const insertCommSchema = createInsertSchema(communications).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Communication = typeof communications.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Portfolio = typeof portfolio.$inferSelect;
