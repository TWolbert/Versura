import { faker } from "@faker-js/faker";
import { db } from "..";
import { highscoresTable } from "../models/highscores";
import { roundsTable } from "../models/rounds";
import { steamUsersTable } from "../models/steamUsers";

// Clear tables in order to avoid foreign key conflicts
async function clearTables() {
  await db.delete(highscoresTable);
  await db.delete(roundsTable);
  await db.delete(steamUsersTable);
}

async function seedSteamUsers(count = 100) {
  const users = Array.from({ length: count }).map(() => ({
    steamId: faker.string.uuid(),
    username: faker.internet.username(),
    avatar: faker.image.avatar(),
    last_seen: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(steamUsersTable).values(users);
  const inserted = await db.select().from(steamUsersTable);
  return inserted;
}

async function seedRounds(steamUsers: typeof steamUsersTable.$inferSelect[], countPerUser = 10) {
  const rounds = steamUsers.flatMap((user) =>
    Array.from({ length: countPerUser }).map(() => ({
      steamUserId: user.id,
      score: Number((Math.random() * 100).toFixed(2)),
      levelId: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );

  await db.insert(roundsTable).values(rounds);
  const inserted = await db.select().from(roundsTable);
  return inserted;
}

async function seedHighscores(
  steamUsers: typeof steamUsersTable.$inferSelect[],
  rounds: typeof roundsTable.$inferSelect[],
) {
  const highscores = rounds.map((round) => {
    const user = steamUsers.find((u) => u.id === round.steamUserId)!;
    return {
      steamUserId: user.id,
      roundId: round.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  await db.insert(highscoresTable).values(highscores);
}

async function runSeeder() {
  console.log("🌱 Seeding database...");
  await clearTables();

  const users = await seedSteamUsers();
  const rounds = await seedRounds(users);
  await seedHighscores(users, rounds);

  console.log("✅ Done seeding!");
  process.exit(0);
}

runSeeder().catch((err) => {
  console.error("❌ Seeder failed:", err);
  process.exit(1);
});
