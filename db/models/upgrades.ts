import { decimal, integer, numeric, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { db } from "..";

export const upgradesTable = pgTable("upgrades", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 500 }).notNull(),
    rarity: varchar({ length: 100 }).notNull(),
    category: varchar({ length: 255 }).notNull(),
    mode: varchar({ length: 100 }).notNull(),
    base_price: integer("base_price").notNull(),
    price_multiplier: decimal("price_multiplier").notNull(),
    max_upgrade: integer("max_upgrade").notNull(),
    spawn_chance: numeric("spawn_chance").notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export type Upgrade = typeof upgradesTable.$inferSelect;

export class Upgrades {
    static all() {
        return db.select().from(upgradesTable);
    }
}