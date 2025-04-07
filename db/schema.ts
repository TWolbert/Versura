import {
  timestamp,
  integer,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

// Panel users, not game users
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  imageId: integer()
    .notNull()
    .references(() => imagesTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

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

export const imagesTable = pgTable("images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  imageUrl: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
