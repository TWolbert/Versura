import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const imagesTable = pgTable("images", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    imageUrl: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  });
  