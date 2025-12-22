import { db } from "./db";
import { packets, sections, type Packet, type Section, type PacketWithSections } from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getPackets(): Promise<Packet[]>;
  getPacket(id: number): Promise<PacketWithSections | undefined>;
  createPacket(packet: typeof packets.$inferInsert): Promise<Packet>;
  createSection(section: typeof sections.$inferInsert): Promise<Section>;
}

export class DatabaseStorage implements IStorage {
  async getPackets(): Promise<Packet[]> {
    return await db.select().from(packets);
  }

  async getPacket(id: number): Promise<PacketWithSections | undefined> {
    const packet = await db.select().from(packets).where(eq(packets.id, id)).limit(1);
    if (packet.length === 0) return undefined;

    const packetSections = await db.select()
      .from(sections)
      .where(eq(sections.packetId, id))
      .orderBy(asc(sections.order));

    return { ...packet[0], sections: packetSections };
  }

  async createPacket(packet: typeof packets.$inferInsert): Promise<Packet> {
    const [newPacket] = await db.insert(packets).values(packet).returning();
    return newPacket;
  }

  async createSection(section: typeof sections.$inferInsert): Promise<Section> {
    const [newSection] = await db.insert(sections).values(section).returning();
    return newSection;
  }
}

export const storage = new DatabaseStorage();
