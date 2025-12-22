import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import fs from "fs";
import path from "path";

async function seedDatabase() {
  const existingPackets = await storage.getPackets();
  if (existingPackets.length > 0) return;

  console.log("Seeding database from HTML packet...");
  
  try {
    const packetPath = path.join(process.cwd(), "attached_assets", "GEM_ATR_enterprise_agency_packet_1766443025899.html");
    if (!fs.existsSync(packetPath)) {
      console.log("Packet file not found, skipping seed.");
      return;
    }

    const htmlContent = fs.readFileSync(packetPath, "utf-8");

    // Create the packet
    const packet = await storage.createPacket({
      title: "GEM & ATR Unified Digital Command Center",
      description: "Enterprise Agency Export Packet - Consolidated Transformation Dossier",
      meta: { compiled: "2025-12-22" }
    });

    // Parse and add sections (Simple parsing logic for MVP)
    
    // 1. Executive Summary
    const execSummaryMatch = htmlContent.match(/<h2>1\) Executive Summary.*?<pre>(.*?)<\/pre>/s);
    if (execSummaryMatch) {
      await storage.createSection({
        packetId: packet.id,
        title: "Executive Summary",
        type: "summary",
        content: execSummaryMatch[1].trim(),
        order: 1,
        data: {}
      });
    }

    // 2. Visual Evidence (Images)
    const images: string[] = [];
    const imgRegex = /<img src="(data:image\/[^;]+;base64,[^"]+)"/g;
    let match;
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      images.push(match[1]);
    }

    if (images.length > 0) {
      await storage.createSection({
        packetId: packet.id,
        title: "Visual Evidence",
        type: "gallery",
        content: "Visual documentation and evidence gathered.",
        order: 2,
        data: { images }
      });
    }

    // 3. Source Material
    const sourceMatch = htmlContent.match(/<h2>3\) Source Material A.*?<pre>(.*?)<\/pre>/s);
    if (sourceMatch) { // Note: The regex might need to be robust, but sticking to simple for now
       // Use a simpler approach if regex fails on large content or nested tags. 
       // Just grabbing the text content inside the details/pre block
       const cleanContent = sourceMatch[1] || "";
       
       await storage.createSection({
        packetId: packet.id,
        title: "Source Material A",
        type: "text",
        content: cleanContent.trim(),
        order: 3,
        data: {}
      });
    } else {
        // Fallback if regex misses
        await storage.createSection({
            packetId: packet.id,
            title: "Source Material",
            type: "text",
            content: "Performance, Accessibility, Content Ops data...",
            order: 3,
            data: {}
        });
    }
    
    // Cost Table
    const tableData = [
      { scale: "Small (10 users)", monthly: "$540", annual: "$6,480" },
      { scale: "Medium (1,000 users)", monthly: "$3,700", annual: "$44,400" },
      { scale: "Enterprise (10,000+ users)", monthly: "$18,500", annual: "$222,000" }
    ];
    
    await storage.createSection({
        packetId: packet.id,
        title: "Cost Analysis",
        type: "table",
        content: "Reference cost rollups.",
        order: 4,
        data: { headers: ["Scale", "Monthly", "Annual"], rows: tableData }
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed on startup
  seedDatabase();

  app.get(api.packets.list.path, async (_req, res) => {
    const packets = await storage.getPackets();
    res.json(packets);
  });

  app.get(api.packets.get.path, async (req, res) => {
    const packet = await storage.getPacket(Number(req.params.id));
    if (!packet) {
      return res.status(404).json({ message: 'Packet not found' });
    }
    res.json(packet);
  });

  return httpServer;
}
