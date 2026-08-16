import { relations } from 'drizzle-orm';
import { boolean, decimal, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  city: text('city'),
  description: text('description'),
  phone: text('phone'),
  profilePicture: text('profile_picture'),
  role: text('role').default('USER'), // USER, ADMIN
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
});

export const listings = pgTable('listings', {
  id: serial('id').primaryKey(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  brand: text('brand'),
  model: text('model'),
  condition: text('condition'),
  recommendedAge: text('recommended_age'),
  maximumWeight: text('maximum_weight'),
  dimensions: text('dimensions'),
  dailyPrice: decimal('daily_price', { precision: 10, scale: 2 }).notNull(),
  weeklyPrice: decimal('weekly_price', { precision: 10, scale: 2 }),
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }).notNull(),
  city: text('city').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 6 }),
  longitude: decimal('longitude', { precision: 10, scale: 6 }),
  deliveryAvailable: boolean('delivery_available').default(false),
  pickupAvailable: boolean('pickup_available').default(true),
  status: text('status').default('ACTIVE'), // ACTIVE, INACTIVE, SUSPENDED
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const listingImages = pgTable('listing_images', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id').references(() => listings.id).notNull(),
  url: text('url').notNull(),
  displayOrder: integer('display_order').default(0),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id').references(() => listings.id).notNull(),
  tenantId: integer('tenant_id').references(() => users.id).notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  startDate: text('start_date').notNull(), // YYYY-MM-DD
  endDate: text('end_date').notNull(), // YYYY-MM-DD
  status: text('status').default('PENDING'), // PENDING, CONFIRMED, CANCELLED, COMPLETED
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id').references(() => listings.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  bookingsAsTenant: many(bookings, { relationName: 'tenant' }),
  bookingsAsOwner: many(bookings, { relationName: 'owner' }),
  favorites: many(favorites),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  listings: many(listings),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  owner: one(users, { fields: [listings.ownerId], references: [users.id] }),
  category: one(categories, { fields: [listings.categoryId], references: [categories.id] }),
  images: many(listingImages),
  bookings: many(bookings),
  favorites: many(favorites),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  listing: one(listings, { fields: [bookings.listingId], references: [listings.id] }),
  tenant: one(users, { fields: [bookings.tenantId], references: [users.id], relationName: 'tenant' }),
  owner: one(users, { fields: [bookings.ownerId], references: [users.id], relationName: 'owner' }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  listing: one(listings, { fields: [favorites.listingId], references: [listings.id] }),
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
}));
