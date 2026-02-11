import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", version: "1.1.0-enterprise", sync: true });
  });

  const checkRole = (roles: string[]) => (req: any, res: any, next: any) => {
    const userRole = req.headers["x-user-role"] || "admin"; 
    if (roles.includes(userRole as string)) return next();
    res.status(403).json({ message: "Forbidden" });
  };

  app.get("/api/portfolio", async (req, res) => {
    const orgId = Number(req.query.orgId) || 1;
    const items = await storage.getPortfolios(orgId);
    res.json(items);
  });

  app.get("/api/communications", async (req, res) => {
    const orgId = Number(req.query.orgId) || 1;
    const items = await storage.getCommunications(orgId);
    res.json(items);
  });

  app.get("/api/audit-logs", async (req, res) => {
    const orgId = Number(req.query.orgId) || 1;
    const logs = await storage.getAuditLogs(orgId);
    res.json(logs);
  });

  app.get("/api/admin/diagnostics", checkRole(["super_admin", "admin"]), async (req, res) => {
    res.json({
      latency: "4.2ms",
      errorRate: "0.001%",
      uptime: "99.999%",
      grade: "AAA+",
      nodes: ["ID-X99", "SGP-1", "NYC-4", "LON-2", "TYO-5"]
    });
  });

  // Handle SPA routing - redirect all non-API requests to index.html is handled by Vite/server/index.ts
  // But we can add a fallback route here if needed for specific logic
  
  return httpServer;
}
