import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { db } from "./src/db/index.ts";
import { challenges, challengeLocations, challengeMedia, citizenResolutionFeedback, challengeSupport, integrityCases, integrityCaseSupport } from "./src/db/schema.ts";
import { eq, desc, sql, and } from "drizzle-orm";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Public Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
  });

  // Citizen Profile
  app.get("/api/v1/citizen/profile", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await db.query.citizens.findFirst({
        where: (citizens, { eq }) => eq(citizens.id, req.citizenId!),
      });
      res.json({ success: true, data: user });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Challenges (Reports)
  app.post("/api/v1/citizen/challenges", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { title, description, domain, latitude, longitude, districtId, blockId } = req.body;
      
      let locationId = null;
      if (latitude && longitude) {
        const [loc] = await db.insert(challengeLocations).values({
          latitude, longitude, districtId, blockId, source: 'GPS'
        }).returning();
        locationId = loc.id;
      }

      const publicId = `CH-JH-RNC-2026-${Math.floor(Math.random() * 10000).toString().padStart(6, '0')}`;

      // Simulate AI categorization synchronously for the MVP/demo
      const aiDomain = domain || "Public Service";
      const aiConfidence = 0.85 + (Math.random() * 0.1);
      const aiPriority = "Medium";

      const [challenge] = await db.insert(challenges).values({
        publicId,
        citizenId: req.citizenId!,
        locationId,
        title,
        description,
        domain: aiDomain,
        aiConfidence,
        aiPriority,
        status: 'SUBMITTED',
      }).returning();

      res.json({ success: true, data: challenge });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/api/v1/citizen/my/challenges", requireAuth, async (req: AuthRequest, res) => {
    try {
      const myChallenges = await db.query.challenges.findMany({
        where: eq(challenges.citizenId, req.citizenId!),
        orderBy: [desc(challenges.createdAt)],
      });
      res.json({ success: true, data: myChallenges });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Community Support for Challenges
  app.post("/api/v1/challenges/:id/support", requireAuth, async (req: AuthRequest, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      
      // Upsert to prevent duplicate support
      await db.insert(challengeSupport).values({
        challengeId,
        citizenId: req.citizenId!
      }).onConflictDoNothing();

      const supportCount = await db.select({ count: sql<number>`cast(count(*) as integer)` })
                                   .from(challengeSupport)
                                   .where(eq(challengeSupport.challengeId, challengeId));

      res.json({ success: true, data: { supportCount: supportCount[0].count } });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Verify Resolution
  app.post("/api/v1/citizen/challenges/:id/resolution-feedback", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { response, evidence } = req.body;
      const challengeId = parseInt(req.params.id);

      const [feedback] = await db.insert(citizenResolutionFeedback).values({
        challengeId,
        citizenId: req.citizenId!,
        response,
        evidence
      }).returning();

      res.json({ success: true, data: feedback });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Anonymous Integrity Reporting
  app.post("/api/v1/citizen/integrity/anonymous", async (req, res) => {
    // Note: This endpoint does NOT require Auth.
    try {
      const { title, description, department, officeOrScheme } = req.body;
      const publicId = `INT-JH-2026-${Math.floor(Math.random() * 10000).toString().padStart(6, '0')}`;
      const trackingPin = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit pin
      // In production, hash the pin. Here we'll store a naive hash for demonstration
      const trackingPinHash = Buffer.from(trackingPin).toString('base64');

      const [caseRecord] = await db.insert(integrityCases).values({
        publicId,
        trackingPinHash,
        title,
        description,
        department,
        officeOrScheme
      }).returning();

      res.json({ success: true, data: { publicId: caseRecord.publicId, trackingPin } });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Integrity Support
  app.post("/api/v1/citizen/integrity/:publicId/support", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { publicId } = req.params;
      const [caseRecord] = await db.select().from(integrityCases).where(eq(integrityCases.publicId, publicId));
      if (!caseRecord) {
        return res.status(404).json({ success: false, error: "Not found" });
      }

      await db.insert(integrityCaseSupport).values({
        integrityCaseId: caseRecord.id,
        citizenId: req.citizenId!
      }).onConflictDoNothing();

      const supportCount = await db.select({ count: sql<number>`cast(count(*) as integer)` })
                                   .from(integrityCaseSupport)
                                   .where(eq(integrityCaseSupport.integrityCaseId, caseRecord.id));

      if (supportCount[0].count >= 10000) {
         // Create INVESTIGATION_REQUEST
         await db.update(integrityCases).set({ status: 'INVESTIGATION_REQUEST' }).where(eq(integrityCases.id, caseRecord.id));
      }

      res.json({ success: true, data: { supportCount: supportCount[0].count, status: caseRecord.status } });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Public Transparency / Search
  app.get("/api/v1/public/challenges", async (req, res) => {
    try {
      const publicChallenges = await db.query.challenges.findMany({
        where: eq(challenges.visibility, 'PUBLIC'),
        orderBy: [desc(challenges.createdAt)],
        limit: 50,
      });
      res.json({ success: true, data: publicChallenges });
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
