import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from "./src/middleware/auth";
import { storage } from "./src/db/storage";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  app.use(cors());
  app.use(express.json());

  // Public Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", portal: "Citizen_Dashboard_Jharkhand", port: PORT, timestamp: new Date() });
  });

  // Citizen Profile
  app.get("/api/v1/citizen/profile", requireAuth, (req: AuthRequest, res) => {
    try {
      const user = storage.getCitizen();
      res.json({ success: true, data: user });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Challenges (Problems) List with filtering & search
  app.get("/api/v1/citizen/challenges", (req, res) => {
    try {
      const { district, category, query, status } = req.query as Record<string, string>;
      const problems = storage.getProblems({ district, category, query, status });
      res.json({ success: true, data: problems, meta: { total: problems.length } });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Create Challenge (Problem Report)
  app.post("/api/v1/citizen/challenges", requireAuth, (req: AuthRequest, res) => {
    try {
      const { title, description, category, domain, location, media, voiceNoteUrl } = req.body;
      if (!title || !description) {
        return res.status(400).json({ success: false, error: "Title and description are required" });
      }

      const problem = storage.addProblem({
        title,
        description,
        category: category || domain || "Public Infrastructure",
        location: location || {
          district: "Ranchi",
          block: "Kanke",
          panchayat: "Boreya",
          village: "Boreya Basti",
          coordinates: { lat: 23.435, lng: 85.321 }
        },
        media: media || [],
        voiceNoteUrl,
        submittedBy: req.user?.name || "Rameshwar Murmu"
      });

      res.status(201).json({ success: true, data: problem });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Get Challenge by ID
  app.get("/api/v1/citizen/challenges/:id", (req, res) => {
    try {
      const problem = storage.getProblemById(req.params.id);
      if (!problem) {
        return res.status(404).json({ success: false, error: "Problem not found" });
      }
      res.json({ success: true, data: problem });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Support / Upvote Challenge
  app.post("/api/v1/citizen/challenges/:id/support", requireAuth, (req: AuthRequest, res) => {
    try {
      const type = req.body.type === 'EXPERIENCED_THIS' ? 'EXPERIENCED_THIS' : 'SUPPORT';
      const updated = storage.supportProblem(req.params.id, type);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Problem not found" });
      }
      res.json({ success: true, data: updated });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Add Comment to Challenge
  app.post("/api/v1/citizen/challenges/:id/comments", requireAuth, (req: AuthRequest, res) => {
    try {
      const { text, role, official } = req.body;
      if (!text) {
        return res.status(400).json({ success: false, error: "Comment text is required" });
      }
      const updated = storage.addProblemComment(req.params.id, {
        author: req.user?.name || "Verified Citizen",
        role: role || "Resident",
        text,
        official: Boolean(official)
      });
      if (!updated) {
        return res.status(404).json({ success: false, error: "Problem not found" });
      }
      res.json({ success: true, data: updated });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Integrity & Anti-Corruption Cases
  app.get("/api/v1/citizen/integrity", (req, res) => {
    try {
      const cases = storage.getIntegrityCases();
      res.json({ success: true, data: cases });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/v1/citizen/integrity", (req, res) => {
    try {
      const { title, description, department, officeOrScheme, suspectedAmount, evidenceUrl, location } = req.body;
      if (!title || !department) {
        return res.status(400).json({ success: false, error: "Title and department are required" });
      }
      const newCase = storage.addIntegrityCase({
        title,
        description,
        department,
        officeOrScheme: officeOrScheme || department,
        suspectedAmount: suspectedAmount || "Under Assessment",
        evidenceUrl,
        location: location || { district: "Ranchi", block: "Kanke" },
        anonymousTrackingPin: Math.floor(100000 + Math.random() * 900000).toString()
      });
      res.status(201).json({ success: true, data: newCase });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/v1/citizen/integrity/:id/support", requireAuth, (req: AuthRequest, res) => {
    try {
      const updated = storage.supportIntegrityCase(req.params.id);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Case not found" });
      }
      res.json({ success: true, data: updated });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Community Work Verification Audits
  app.get("/api/v1/citizen/verifications", (req, res) => {
    try {
      const verifications = storage.getVerifications();
      res.json({ success: true, data: verifications });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/v1/citizen/verifications/:id/vote", requireAuth, (req: AuthRequest, res) => {
    try {
      const { decision, comment, evidenceUrl } = req.body;
      if (!decision) {
        return res.status(400).json({ success: false, error: "Decision is required" });
      }
      const updated = storage.submitVerificationVote(req.params.id, {
        decision,
        comment: comment || "",
        evidenceUrl,
        author: req.user?.name || "Rameshwar Murmu"
      });
      if (!updated) {
        return res.status(404).json({ success: false, error: "Verification audit not found" });
      }
      res.json({ success: true, data: updated });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Infrastructure Assets
  app.get("/api/v1/citizen/infrastructure", (req, res) => {
    try {
      const assets = storage.getInfrastructure();
      res.json({ success: true, data: assets });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Notifications
  app.get("/api/v1/citizen/notifications", (req, res) => {
    try {
      const notifs = storage.getNotifications();
      res.json({ success: true, data: notifs });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.patch("/api/v1/citizen/notifications/:id/read", (req, res) => {
    try {
      storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/v1/citizen/notifications/read-all", (req, res) => {
    try {
      storage.markAllNotificationsRead();
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Citizen_Dashboard_Jharkhand] Server running on http://localhost:${PORT}`);
  });
}

startServer();
