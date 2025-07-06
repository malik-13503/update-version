import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      
      // Check if email already exists
      const existingRegistration = await storage.getRegistrationByEmail(validatedData.email);
      if (existingRegistration) {
        return res.status(400).json({ 
          message: "Email already registered. Please use a different email address." 
        });
      }
      
      const registration = await storage.createRegistration(validatedData);
      res.json({ 
        message: "Registration successful!", 
        id: registration.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      }
      
      console.error("Registration error:", error);
      res.status(500).json({ 
        message: "Failed to register. Please try again." 
      });
    }
  });

  // Get registration count for trust indicator
  app.get("/api/stats", async (req, res) => {
    try {
      const count = await storage.getRegistrationCount();
      res.json({ registrationCount: count });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Admin routes
  app.get("/api/admin/registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Admin registrations error:", error);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.delete("/api/admin/registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid registration ID" });
      }
      
      await storage.deleteRegistration(id);
      res.json({ message: "Registration deleted successfully" });
    } catch (error) {
      console.error("Admin delete error:", error);
      res.status(500).json({ message: "Failed to delete registration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
