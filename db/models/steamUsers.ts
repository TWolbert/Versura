import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const steamUsersTable = pgTable("steam_users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  steamId: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }).notNull(),
  avatar: varchar({ length: 255 }).notNull(),
  last_seen: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});