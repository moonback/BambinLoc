import express from "express";
import cors from "cors";
import { requireAuth } from "./src/middleware/auth.ts";
import { db } from "./src/db/index.ts";
import { users, listings, categories, listingImages } from "./src/db/schema.ts";
import { eq, desc } from "drizzle-orm";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.NODE_ENV === "production" ? process.env.PORT || 3e3 : 3001;
app.use(cors());
app.use(express.json());
app.post("/api/auth/sync-user", requireAuth, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email;
    if (!uid || !email) {
      return res.status(400).json({ error: "Missing user details" });
    }
    const result = await db.insert(users).values({
      uid,
      email
    }).onConflictDoUpdate({
      target: users.uid,
      set: {
        email
      }
    }).returning();
    res.json(result[0]);
  } catch (error) {
    console.error("Failed to sync user:", error);
    res.status(500).json({ error: error.message || "Failed to sync user" });
  }
});
app.get("/api/categories", async (req, res) => {
  try {
    const result = await db.select().from(categories);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
app.get("/api/listings", async (req, res) => {
  try {
    const allListings = await db.select({
      id: listings.id,
      title: listings.title,
      slug: listings.slug,
      city: listings.city,
      dailyPrice: listings.dailyPrice,
      imageUrl: listingImages.url
    }).from(listings).leftJoin(listingImages, eq(listings.id, listingImages.listingId)).orderBy(desc(listings.createdAt));
    const dedupedMap = /* @__PURE__ */ new Map();
    for (const item of allListings) {
      if (!dedupedMap.has(item.id)) {
        dedupedMap.set(item.id, item);
      }
    }
    res.json(Array.from(dedupedMap.values()));
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});
app.get("/api/listings/:slug", async (req, res) => {
  try {
    const result = await db.query.listings.findFirst({
      where: eq(listings.slug, req.params.slug),
      with: {
        images: true,
        category: true,
        owner: true
      }
    });
    if (!result) return res.status(404).json({ error: "Listing not found" });
    res.json(result);
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
