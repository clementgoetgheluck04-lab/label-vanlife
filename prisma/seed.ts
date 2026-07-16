// Label Vanlife — Seed script
// Usage: npx tsx prisma/seed.ts

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Label Vanlife...");

  // ─── Badges ───
  const badges = [
    { code: "PREMIERE_ETAPE", name: "Première Étape", description: "Premier lieu visité", icon: "📍", category: "exploration" },
    { code: "GLOBE_TROTTEUR", name: "Globe-Trotteur", description: "5 régions visitées", icon: "🌍", category: "exploration" },
    { code: "ECO_RESPONSABLE", name: "Éco-Responsable", description: "10 nuits en éco-camping", icon: "🌱", category: "eco" },
    { code: "PHOTOGRAPHE", name: "Photographe", description: "20 photos partagées", icon: "📸", category: "social" },
    { code: "LOCAL", name: "Local", description: "15 avis déposés", icon: "🗣️", category: "social" },
    { code: "FAMILLE", name: "Famille Vanlife", description: "Road trip famille 5 jours", icon: "👨‍👩‍👧‍👦", category: "social" },
    { code: "INSOLITE", name: "Night & Day", description: "1 nuit insolite", icon: "🌙", category: "exploration" },
    { code: "LEGENDE", name: "Légende Vanlife", description: "2500 points accumulés", icon: "🏆", category: "premium" },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {},
      create: badge,
    });
  }
  console.log(`✅ ${badges.length} badges créés`);

  // ─── Blog categories ───
  const categories = [
    { name: "Guides", slug: "guides", description: "Guides et conseils vanlife" },
    { name: "Road Trips", slug: "road-trips", description: "Itinéraires et idées de voyage" },
    { name: "Lieux", slug: "lieux", description: "Découverte de lieux labellisés" },
    { name: "Communauté", slug: "communaute", description: "Vie de la communauté" },
    { name: "Éco", slug: "eco", description: "Vanlife responsable et écologie" },
  ];

  for (const cat of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} catégories blog créées`);

  // ─── Stats ───
  const counts = {
    users: await prisma.user.count(),
    places: await prisma.place.count(),
    memberships: await prisma.membership.count(),
    badges: await prisma.badge.count(),
  };
  console.log("📊 Stats :", counts);
  console.log("🎉 Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });