import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === ORGANIZATIONS & RBAC ===
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  plan: text("plan").default("standard"), // 'standard', 'global', 'enterprise'
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  replitId: text("replit_id").unique(),
  username: text("username").notNull().unique(),
  email: text("email"),
  organizationId: integer("organization_id").references(() => organizations.id),
  role: text("role").notNull().default("viewer"), // 'admin', 'client', 'viewer'
  gradedScore: integer("graded_score").default(0), // Graded version of profile
  is2FAEnabled: boolean("is_2fa_enabled").default(false),
  secret2FA: text("secret_2fa"), // Encrypted secret
  createdAt: timestamp("created_at").defaultNow(),
});

// === DASHBOARDS ===
export const dashboards = pgTable("dashboards", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("personal"), // 'global', 'personal'
  config: jsonb("config"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const widgets = pgTable("widgets", {
  id: serial("id").primaryKey(),
  dashboardId: integer("dashboard_id").references(() => dashboards.id).notNull(),
  type: text("type").notNull(), 
  title: text("title").notNull(),
  config: jsonb("config"),
  order: integer("order").notNull(),
});

// === CONTENT PACKETS ===
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
export const insertPacketSchema = createInsertSchema(packets).omit({ id: true, createdAt: true });
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Dashboard = typeof dashboards.$inferSelect;
export type Widget = typeof widgets.$inferSelect;
export type Packet = typeof packets.$inferSelect;
export type Section = typeof sections.$inferSelect;
