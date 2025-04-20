import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { steamUsersTable } from "./steamUsers";
import { roundsTable } from "./rounds";

export const highscoresTable = pgTable("highscores", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    steamUserId: integer().notNull().references(() => steamUsersTable.id),
    roundId: integer().notNull().references(() => roundsTable.id),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  });
  