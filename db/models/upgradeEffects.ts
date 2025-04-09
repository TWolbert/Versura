import { decimal, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { upgradesTable } from "./upgrades";

export const upgradeEffectsTable = pgTable("upgrade_effects", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    upgradeId: integer("upgrade_id").notNull().references(() => upgradesTable.id),
    stat: varchar({ length: 255 }).notNull(),
    value: decimal().notNull(),
    type: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});
