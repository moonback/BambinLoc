import { db } from './index.ts';
import { categories, listings, users, listingImages } from './schema.ts';

async function seed() {
  console.log("Seeding database...");

  // Seed Categories
  const cats = [
    { name: 'Poussettes', slug: 'poussette', image: '🚼' },
    { name: 'Vélos & Draisiennes', slug: 'velo', image: '🚲' },
    { name: 'Lits bébé', slug: 'lit-bebe', image: '🛌' },
    { name: 'Sièges auto', slug: 'siege-auto', image: '💺' },
    { name: 'Porte-bébés', slug: 'porte-bebe', image: '👶' },
    { name: 'Chaises hautes', slug: 'chaise-haute', image: '🪑' }
  ];
  
  console.log("Seeding categories...");
  const insertedCats = await db.insert(categories).values(cats).returning();

  // Create dummy user
  console.log("Seeding users...");
  const [user1] = await db.insert(users).values({
    uid: 'seed_uid_1',
    email: 'proprio1@bambinloc.com',
    firstName: 'Sophie',
    lastName: 'Martin',
    city: 'Nantes',
    description: 'Maman de 2 enfants, je loue mon matériel quand nous ne partons pas en vacances.',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  }).returning();

  const [user2] = await db.insert(users).values({
    uid: 'seed_uid_2',
    email: 'proprio2@bambinloc.com',
    firstName: 'Thomas',
    lastName: 'Dubois',
    city: 'Paris',
    description: 'Papa poule qui adore les balades à vélo.',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
  }).returning();

  console.log("Seeding listings...");
  const poussetteCatId = insertedCats.find(c => c.slug === 'poussette')!.id;
  const siegeAutoCatId = insertedCats.find(c => c.slug === 'siege-auto')!.id;
  const veloCatId = insertedCats.find(c => c.slug === 'velo')!.id;

  const demoListings = [
    {
      ownerId: user1.id,
      categoryId: poussetteCatId,
      title: 'Poussette Yoyo Babyzen ultra compacte',
      slug: 'poussette-yoyo-babyzen-ultra-compacte-1',
      description: 'Idéale pour les voyages en avion (passe en cabine) ou le train. Poussette très maniable et en excellent état.',
      brand: 'Babyzen',
      model: 'Yoyo+',
      condition: 'Excellent état',
      dailyPrice: '12.00',
      weeklyPrice: '60.00',
      depositAmount: '200.00',
      city: 'Nantes',
      latitude: '47.218371',
      longitude: '-1.553621'
    },
    {
      ownerId: user2.id,
      categoryId: siegeAutoCatId,
      title: 'Siège auto Cybex Sirona pivotant',
      slug: 'siege-auto-cybex-sirona-pivotant',
      description: 'Siège auto groupe 0+/1, isofix et pivotant 360° pour installer bébé facilement.',
      brand: 'Cybex',
      model: 'Sirona M2',
      condition: 'Très bon état',
      dailyPrice: '15.00',
      weeklyPrice: '80.00',
      depositAmount: '300.00',
      city: 'Paris',
      latitude: '48.856614',
      longitude: '2.352221'
    },
    {
      ownerId: user1.id,
      categoryId: veloCatId,
      title: 'Draisienne Puky LR M',
      slug: 'draisienne-puky-lr-m',
      description: 'Draisienne pour enfant de 2 à 4 ans. Très légère.',
      brand: 'Puky',
      model: 'LR M',
      condition: 'Bon état',
      dailyPrice: '5.00',
      weeklyPrice: '25.00',
      depositAmount: '50.00',
      city: 'Nantes',
      latitude: '47.228371',
      longitude: '-1.563621'
    }
  ];

  const insertedListings = await db.insert(listings).values(demoListings).returning();

  console.log("Seeding images...");
  await db.insert(listingImages).values([
    {
      listingId: insertedListings[0].id,
      url: 'https://images.unsplash.com/photo-1511894982998-132d72b217dc?w=800&auto=format&fit=crop'
    },
    {
      listingId: insertedListings[1].id,
      url: 'https://images.unsplash.com/photo-1621245788414-b49bcf20562e?w=800&auto=format&fit=crop'
    },
    {
      listingId: insertedListings[2].id,
      url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop'
    }
  ]);

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
}).then(() => {
  process.exit(0);
});
