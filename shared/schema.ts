import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === ORGANIZATIONS & TENANTS ===
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  grade: integer("grade").default(1), // 1-5 rating for enterprise maturity
  createdAt: timestamp("created_at").defaultNow(),
});

// === USERS & AUTH ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  replitId: text("replit_id").unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  organizationId: integer("organization_id").references(() => organizations.id),
  role: text("role").notNull().default("viewer"), // 'admin', 'client', 'compliance'
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  profileGrade: integer("profile_grade").default(1), // Graded version of the online profile
  createdAt: timestamp("created_at").defaultNow(),
});

// === DASHBOARDS ===
export const dashboards = pgTable("dashboards", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("personal"), // 'global', 'personal'
  config: jsonb("config"), // Widget layout, theme, usage rules
  createdAt: timestamp("created_at").defaultNow(),
});

export const widgets = pgTable("widgets", {
  id: serial("id").primaryKey(),
  dashboardId: integer("dashboard_id").references(() => dashboards.id).notNull(),
  type: text("type").notNull(), // 'performance', 'accessibility', 'monitoring', 'security'
  title: text("title").notNull(),
  config: jsonb("config"),
  order: integer("order").notNull(),
});

// === PACKETS & CONTENT ===
export const packets = pgTable("packets", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  title: text("title").notNull(),
  description: text("description"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  packetId: integer("packet_id").references(() => packets.id).notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  content: text("content"),
  data: jsonb("data"),
  order: integer("order").notNull(),
});

// === SCHEMAS & TYPES ===
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertOrgSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true });
export const insertDashboardSchema = createInsertSchema(dashboards).omit({ id: true, createdAt: true });
export const insertWidgetSchema = createInsertSchema(widgets).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Dashboard = typeof dashboards.$inferSelect;
export type Widget = typeof widgets.$inferSelect;
export type Packet = typeof packets.$inferSelect;
export type Section = typeof sections.$inferSelect;

// Explicit Contract Types
export type AuthMeResponse = (User & { organization: Organization | null }) | null;
export type DashboardWithWidgets = Dashboard & { widgets: Widget[] };
