import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema, loginSchema, updateUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize default admin user
  await storage.createDefaultAdmin();

  // Authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ 
          message: "Invalid username or password" 
        });
      }
      
      // Store user session
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.json({ 
        message: "Login successful", 
        user: { id: user.id, username: user.username, role: user.role }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      }
      
      console.error("Login error:", error);
      res.status(500).json({ 
        message: "Login failed. Please try again." 
      });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Check auth status
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    res.json({ 
      user: { id: user.id, username: user.username, role: user.role }
    });
  });

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

  // Admin routes (protected)
  app.get("/api/admin/registrations", requireAuth, async (req, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Admin registrations error:", error);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.delete("/api/admin/registrations/:id", requireAuth, async (req, res) => {
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

  // Update admin credentials
  app.put("/api/admin/update-credentials", requireAuth, async (req, res) => {
    try {
      const validatedData = updateUserSchema.parse(req.body);
      const userId = req.session.userId;
      
      const updatedUser = await storage.updateUser(userId, validatedData);
      
      // Update session if username changed
      if (validatedData.username) {
        req.session.username = validatedData.username;
      }
      
      res.json({ 
        message: "Credentials updated successfully",
        user: { id: updatedUser.id, username: updatedUser.username, role: updatedUser.role }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      }
      
      console.error("Update credentials error:", error);
      res.status(500).json({ 
        message: "Failed to update credentials" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
