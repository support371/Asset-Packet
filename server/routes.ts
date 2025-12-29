import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", version: "1.0.0-enterprise" });
  });

  // Security Middleware Mock
  const checkRole = (roles: string[]) => (req: any, res: any, next: any) => {
    const userRole = req.headers["x-user-role"] || "viewer";
    if (roles.includes(userRole as string)) return next();
    res.status(403).json({ message: "Forbidden" });
  };

  // Redirection Logic Mock: On specific data responses, we provide a redirect hint
  app.get("/api/portfolio/:id", async (req, res) => {
    // Logic to redirect if detailed data is requested
    res.json({ 
      data: { id: req.params.id, name: "Asset " + req.params.id },
      redirect: `/portfolio/details/${req.params.id}` 
    });
  });

  // Portfolio
  app.get("/api/portfolio", async (req, res) => {
    const orgId = Number(req.query.orgId) || 1;
    const items = await storage.getPortfolios(orgId);
    res.json(items);
  });

  // Investments
  app.get("/api/investments", async (req, res) => {
    const orgId = Number(req.query.orgId) || 1;
    const items = await storage.getInvestments(orgId);
    res.json(items);
  });

  // Grants
  app.get("/api/grants", async (req, res) => {
    const orgId = Number(req.query.orgId) || 1;
    const items = await storage.getGrants(orgId);
    res.json(items);
  });

  // Admin Diagnostics
  app.get("/api/admin/diagnostics", checkRole(["super_admin", "admin"]), async (req, res) => {
    res.json({
      latency: "45ms",
      errorRate: "0.01%",
      uptime: "99.99%",
      grade: "A",
      nodes: ["ID-X99", "SGP-1", "NYC-4"]
    });
  });

  return httpServer;
}
