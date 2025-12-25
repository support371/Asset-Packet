import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === ORGANIZATIONS & RBAC ===
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  replitId: text("replit_id").unique(), // For Replit Auth
  username: text("username").notNull().unique(),
  email: text("email"),
  organizationId: integer("organization_id").references(() => organizations.id),
  role: text("role").notNull().default("viewer"), // admin, editor, viewer, compliance
  createdAt: timestamp("created_at").defaultNow(),
});

// === DASHBOARDS ===
export const dashboards = pgTable("dashboards", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("personal"), // 'global', 'personal'
  isPublic: boolean("is_public").default(false),
  createdBy: integer("created_by").references(() => users.id),
  config: jsonb("config"), // Widget layout etc
  createdAt: timestamp("created_at").defaultNow(),
});

export const widgets = pgTable("widgets", {
  id: serial("id").primaryKey(),
  dashboardId: integer("dashboard_id").references(() => dashboards.id).notNull(),
  type: text("type").notNull(), // 'performance', 'accessibility', 'content', 'monitoring'
  title: text("title").notNull(),
  config: jsonb("config"),
  order: integer("order").notNull(),
});

// === LEGACY/PACKET TABLES (Refined) ===
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
