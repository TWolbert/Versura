import { doublePrecision, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { steamUsersTable } from "./steamUsers";

export const roundsTable = pgTable("rounds", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    steamUserId: integer().notNull().references(() => steamUsersTable.id),
    score:  doublePrecision().notNull(),
    levelId: integer().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  });
  