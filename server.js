import express from "express";
import cors from "cors";
import { requireAuth } from "./src/middleware/auth.ts";
import { db } from "./src/db/index.ts";
import { users, listings, categories, listingImages, bookings } from "./src/db/schema.ts";
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
app.get("/api/bookings/tenant", requireAuth, async (req, res) => {
  try {
    const user = await db.query.users.findFirst({ where: eq(users.uid, req.user.uid) });
    if (!user) return res.status(404).json({ error: "User not found" });
    const result = await db.query.bookings.findMany({
      where: eq(bookings.tenantId, user.id),
      with: {
        listing: {
          with: {
            images: true
          }
        },
        owner: true
      },
      orderBy: [desc(bookings.createdAt)]
    });
    res.json(result);
  } catch (error) {
    console.error("Failed to fetch tenant bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});
app.get("/api/bookings/owner", requireAuth, async (req, res) => {
  try {
    const user = await db.query.users.findFirst({ where: eq(users.uid, req.user.uid) });
    if (!user) return res.status(404).json({ error: "User not found" });
    const result = await db.query.bookings.findMany({
      where: eq(bookings.ownerId, user.id),
      with: {
        listing: {
          with: {
            images: true
          }
        },
        tenant: true
      },
      orderBy: [desc(bookings.createdAt)]
    });
    res.json(result);
  } catch (error) {
    console.error("Failed to fetch owner bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});
app.post("/api/bookings", requireAuth, async (req, res) => {
  try {
    const user = await db.query.users.findFirst({ where: eq(users.uid, req.user.uid) });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { listingId, startDate, endDate, totalPrice } = req.body;
    const listing = await db.query.listings.findFirst({ where: eq(listings.id, listingId) });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    const result = await db.insert(bookings).values({
      listingId,
      tenantId: user.id,
      ownerId: listing.ownerId,
      startDate,
      endDate,
      totalPrice: totalPrice.toString(),
      status: "PENDING"
    }).returning();
    res.json(result[0]);
  } catch (error) {
    console.error("Failed to create booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});
app.patch("/api/bookings/:id/status", requireAuth, async (req, res) => {
  try {
    const user = await db.query.users.findFirst({ where: eq(users.uid, req.user.uid) });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { status } = req.body;
    const bookingId = parseInt(req.params.id);
    const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.ownerId !== user.id) return res.status(403).json({ error: "Unauthorized" });
    const result = await db.update(bookings).set({ status }).where(eq(bookings.id, bookingId)).returning();
    res.json(result[0]);
  } catch (error) {
    console.error("Failed to update booking status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
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
