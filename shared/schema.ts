import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const packets = pgTable("packets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  meta: jsonb("meta"), // For date, version etc
  createdAt: timestamp("created_at").defaultNow(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  packetId: integer("packet_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'summary', 'gallery', 'text', 'table'
  content: text("content"), // Markdown or raw text
  data: jsonb("data"), // Structured data for tables or images array
  order: integer("order").notNull(),
});

export const insertPacketSchema = createInsertSchema(packets).omit({ id: true, createdAt: true });
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true });

export type Packet = typeof packets.$inferSelect;
export type Section = typeof sections.$inferSelect;

export type PacketWithSections = Packet & { sections: Section[] };
