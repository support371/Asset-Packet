import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === ORGANIZATIONS & TENANCY ===
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  tier: text("tier").notNull().default("standard"), // 'standard', 'enterprise', 'global'
  config: jsonb("config").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// === USERS & AUTH ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  replitId: text("replit_id").unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  organizationId: integer("organization_id").references(() => organizations.id),
  role: text("role").notNull().default("client"), // 'admin', 'client'
  isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  gradedProfile: jsonb("graded_profile").default({ score: 0, level: "bronze" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// === CONTENT & PORTAL ===
export const packets = pgTable("packets", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("draft"), // 'draft', 'published'
  meta: jsonb("meta").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  packetId: integer("packet_id").references(() => packets.id).notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'summary', 'gallery', 'table', 'profile'
  content: text("content"),
  data: jsonb("data").default({}),
  order: integer("order").notNull(),
});

// === SCHEMAS ===
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertOrgSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true });
export const insertPacketSchema = createInsertSchema(packets).omit({ id: true, createdAt: true });
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true });

// === API TYPES ===
export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Packet = typeof packets.$inferSelect;
export type Section = typeof sections.$inferSelect;

export type UserProfileResponse = User & { organization?: Organization | null };
export type PacketResponse = Packet & { sections: Section[] };
