import { db } from "..";
import { upgradeEffectsTable } from "../models/upgradeEffects";
import { upgradesTable } from "../models/upgrades";

export async function seedUpgrades() {
    const spawnChances = {
        Common: 0.8,
        Uncommon: 0.65,
        Rare: 0.4,
        Epic: 0.25,
        Legendary: 0.1,
    };

    type UpgradeSeed = {
        upgrade: {
            name: string;
            description: string;
            rarity: string;
            category: string;
            mode: string;
            base_price: number;
            price_multiplier: number;
            max_upgrade: number;
            spawn_chance: number;
        };
        effects: {
            stat: string;
            value: number;
            type: string;
        }[];
    };

    const seeds: UpgradeSeed[] = [
        // ----------------
        // Damage Upgrades
        // ----------------
        {
            upgrade: {
                name: 'Hollow Point Rounds',
                description: 'Bullets deal more damage to enemies with low HP.',
                rarity: 'Uncommon',
                category: 'damage',
                mode: 'topdown',
                base_price: 60,
                price_multiplier: 1.4,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'bullet_damage', value: 1.1, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'High Caliber',
                description: 'Bullets deal significantly more damage, but have slower fire rate.',
                rarity: 'Rare',
                category: 'damage',
                mode: 'topdown',
                base_price: 80,
                price_multiplier: 1.6,
                max_upgrade: 2,
                spawn_chance: spawnChances.Rare,
            },
            effects: [
                { stat: 'bullet_damage', value: 1.25, type: 'multiply' },
                { stat: 'fire_rate', value: 0.9, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Knockback Rounds',
                description: 'Bullets knock enemies back further.',
                rarity: 'Common',
                category: 'damage',
                mode: 'topdown',
                base_price: 50,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Common,
            },
            effects: [
                { stat: 'bullet_knockback', value: 1.2, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Overcharged Ammo',
                description: 'Bullet damage is significantly increased.',
                rarity: 'Epic',
                category: 'damage',
                mode: 'topdown',
                base_price: 90,
                price_multiplier: 1.6,
                max_upgrade: 3,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'bullet_damage', value: 1.15, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Devastator Rounds',
                description: '+250% bullet damage, but -70% fire rate.',
                rarity: 'Legendary',
                category: 'damage',
                mode: 'topdown',
                base_price: 120,
                price_multiplier: 1.8,
                max_upgrade: 1,
                spawn_chance: spawnChances.Legendary,
            },
            effects: [
                { stat: 'bullet_damage', value: 2.5, type: 'multiply' },
                { stat: 'fire_rate', value: 0.3, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Explosive Rounds',
                description: 'Bullets explode on impact, dealing area damage.',
                rarity: 'Epic',
                category: 'damage',
                mode: 'topdown',
                base_price: 100,
                price_multiplier: 1.7,
                max_upgrade: 2,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'explosion_radius', value: 1.2, type: 'multiply' },
                { stat: 'explosion_damage', value: 1.2, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Glass Cannon',
                description: 'Massively increases damage but significantly reduces max HP.',
                rarity: 'Legendary',
                category: 'damage',
                mode: 'both',
                base_price: 130,
                price_multiplier: 1.7,
                max_upgrade: 1,
                spawn_chance: spawnChances.Legendary,
            },
            effects: [
                { stat: 'bullet_damage', value: 1.5, type: 'multiply' },
                { stat: 'max_hp', value: 0.5, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Piercing Rounds',
                description: 'Bullets can pierce through enemies, hitting additional targets.',
                rarity: 'Uncommon',
                category: 'damage',
                mode: 'topdown',
                base_price: 70,
                price_multiplier: 1.5,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'bullet_pierce', value: 1, type: 'add' },
                { stat: 'pierce_damage', value: 0.9, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Splitting Shots',
                description: 'Bullets have a chance to split into smaller projectiles upon impact.',
                rarity: 'Epic',
                category: 'damage',
                mode: 'topdown',
                base_price: 120,
                price_multiplier: 1.5,
                max_upgrade: 2,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'split_chance', value: 0.08, type: 'add' },
                { stat: 'split_projectiles', value: 2, type: 'add' },
                { stat: 'split_damage', value: 0.5, type: 'multiply' },
                { stat: 'bullet_damage', value: 0.95, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Multishot',
                description: 'Fires additional projectiles with each shot.',
                rarity: 'Epic',
                category: 'damage',
                mode: 'topdown',
                base_price: 110,
                price_multiplier: 1.5,
                max_upgrade: 3,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'additional_projectiles', value: 1, type: 'add' },
                { stat: 'bullet_damage', value: 0.9, type: 'multiply' },
            ],
        },

        // ----------------
        // Speed Upgrades
        // ----------------
        {
            upgrade: {
                name: 'Adrenaline Rush',
                description: 'Increases movement speed when below 25% HP.',
                rarity: 'Common',
                category: 'speed',
                mode: 'both',
                base_price: 50,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Common,
            },
            effects: [
                { stat: 'move_speed', value: 1.1, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Speed Demon',
                description: 'Move faster, but harder to control your movement.',
                rarity: 'Uncommon',
                category: 'speed',
                mode: 'both',
                base_price: 65,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'move_speed', value: 1.15, type: 'multiply' },
                { stat: 'control_stability', value: 0.9, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Rapid Fire',
                description: 'Increase fire rate, but reduce bullet damage and accuracy.',
                rarity: 'Uncommon',
                category: 'speed',
                mode: 'topdown',
                base_price: 70,
                price_multiplier: 1.4,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'fire_rate', value: 1.2, type: 'multiply' },
                { stat: 'bullet_damage', value: 0.9, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Sonic Rounds',
                description: 'Bullets fly faster, but knockback is reduced.',
                rarity: 'Uncommon',
                category: 'speed',
                mode: 'topdown',
                base_price: 75,
                price_multiplier: 1.5,
                max_upgrade: 2,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'bullet_speed', value: 1.2, type: 'multiply' },
                { stat: 'bullet_knockback', value: 0.85, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Jetpack Protocol',
                description: 'Significantly boosts your movement speed.',
                rarity: 'Epic',
                category: 'speed',
                mode: 'both',
                base_price: 100,
                price_multiplier: 1.6,
                max_upgrade: 3,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'move_speed', value: 1.1, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Railgun Rounds',
                description: 'Bullets travel faster than ever.',
                rarity: 'Epic',
                category: 'speed',
                mode: 'topdown',
                base_price: 95,
                price_multiplier: 1.5,
                max_upgrade: 3,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'bullet_speed', value: 1.1, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Full Auto Core',
                description: 'Improves fire rate to rapid levels.',
                rarity: 'Epic',
                category: 'speed',
                mode: 'topdown',
                base_price: 105,
                price_multiplier: 1.5,
                max_upgrade: 3,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'fire_rate', value: 1.15, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Quick Strikes',
                description: 'Reduces melee attack cooldown.',
                rarity: 'Uncommon',
                category: 'speed',
                mode: 'side',
                base_price: 60,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'melee_cooldown', value: 0.9, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Wallslide',
                description: 'Reduces wall sliding speed for better control.',
                rarity: 'Common',
                category: 'speed',
                mode: 'side',
                base_price: 45,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Common,
            },
            effects: [
                { stat: 'wallslide_speed', value: 0.8, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Extended Reach',
                description: 'Increases melee attack range.',
                rarity: 'Common',
                category: 'speed',
                mode: 'side',
                base_price: 50,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Common,
            },
            effects: [
                { stat: 'melee_range', value: 1.15, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Extra dashes',
                description: 'Grants additional dashes for increased mobility.',
                rarity: 'Rare',
                category: 'speed',
                mode: 'side',
                base_price: 80,
                price_multiplier: 1.6,
                max_upgrade: 2,
                spawn_chance: spawnChances.Rare,
            },
            effects: [
                { stat: 'dash', value: 1, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Dash hit on impact',
                description: 'Dashing into enemies deals damage.',
                rarity: 'Epic',
                category: 'speed',
                mode: 'side',
                base_price: 110,
                price_multiplier: 1.6,
                max_upgrade: 1,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'dash_hit', value: 1, type: 'add' },
            ],
        },

        // ----------------
        // Health Upgrades
        // ----------------
        {
            upgrade: {
                name: 'Iron Skin',
                description: 'Increase max HP.',
                rarity: 'Common',
                category: 'health',
                mode: 'both',
                base_price: 50,
                price_multiplier: 1.2,
                max_upgrade: 5,
                spawn_chance: spawnChances.Common,
            },
            effects: [
                { stat: 'max_hp', value: 15, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Tank',
                description: 'Gain massive max HP, but move slower.',
                rarity: 'Rare',
                category: 'health',
                mode: 'both',
                base_price: 75,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Rare,
            },
            effects: [
                { stat: 'max_hp', value: 30, type: 'add' },
                { stat: 'move_speed', value: 0.85, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Healthy Aggression',
                description: 'Deal more damage when above 85% HP.',
                rarity: 'Common',
                category: 'health',
                mode: 'both',
                base_price: 55,
                price_multiplier: 1.4,
                max_upgrade: 3,
                spawn_chance: spawnChances.Common,
            },
            effects: [
                { stat: 'damage_boost_above_85_hp', value: 1.1, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Health Drops',
                description: 'Enemies have a chance to drop health pickups when killed.',
                rarity: 'Epic',
                category: 'health',
                mode: 'topdown',
                base_price: 100,
                price_multiplier: 1.4,
                max_upgrade: 3,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'health_drop_chance', value: 0.01, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Vampiric Strikes',
                description: 'Killing an enemy with melee has a chance to heal you.',
                rarity: 'Legendary',
                category: 'health',
                mode: 'side',
                base_price: 120,
                price_multiplier: 1.5,
                max_upgrade: 3,
                spawn_chance: spawnChances.Legendary,
            },
            effects: [
                { stat: 'melee_heal_chance', value: 0.04, type: 'add' },
                { stat: 'heal_amount', value: 5, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Vitality Boost',
                description: 'Killing an enemy with melee has a chance to permanently increase your max health.',
                rarity: 'Legendary',
                category: 'health',
                mode: 'side',
                base_price: 130,
                price_multiplier: 1.5,
                max_upgrade: 3,
                spawn_chance: spawnChances.Legendary,
            },
            effects: [
                { stat: 'max_health_increase_chance', value: 0.01, type: 'add' },
                { stat: 'max_health_increase', value: 10, type: 'add' },
            ],
        },

        // --------------------
        // Elemental Upgrades
        // --------------------
        {
            upgrade: {
                name: 'Firestorm',
                description: 'Bullets have a chance to ignite enemies and burn nearby targets.',
                rarity: 'Uncommon',
                category: 'elemental',
                mode: 'topdown',
                base_price: 70,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'ignite_chance', value: 0.03, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Frostbite',
                description: 'Bullets have a chance to slow enemies.',
                rarity: 'Uncommon',
                category: 'elemental',
                mode: 'topdown',
                base_price: 65,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'slow_chance', value: 0.03, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Shock Therapy',
                description: 'Bullets have a chance to stun enemies.',
                rarity: 'Uncommon',
                category: 'elemental',
                mode: 'topdown',
                base_price: 65,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'stun_chance', value: 0.03, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Toxic Rounds',
                description: 'Bullets have a chance to poison enemies.',
                rarity: 'Uncommon',
                category: 'elemental',
                mode: 'topdown',
                base_price: 65,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'poison_chance', value: 0.03, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Elemental Mastery',
                description: 'Increases elemental effect duration.',
                rarity: 'Epic',
                category: 'elemental',
                mode: 'topdown',
                base_price: 90,
                price_multiplier: 1.4,
                max_upgrade: 3,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'effect_duration', value: 1.2, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Elemental Surge',
                description: 'Increases all elemental chances.',
                rarity: 'Legendary',
                category: 'elemental',
                mode: 'topdown',
                base_price: 130,
                price_multiplier: 1.4,
                max_upgrade: 3,
                spawn_chance: spawnChances.Legendary,
            },
            effects: [
                { stat: 'elemental_damage', value: 0.01, type: 'add' },
            ],
        },

        // ------------------
        // Critical Upgrades
        // ------------------
        {
            upgrade: {
                name: 'Deadly Aim',
                description: 'Increase critical hit chance.',
                rarity: 'Uncommon',
                category: 'critical',
                mode: 'topdown',
                base_price: 70,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'crit_chance', value: 0.04, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Lethal Precision',
                description: 'Increase critical hit damage.',
                rarity: 'Uncommon',
                category: 'critical',
                mode: 'topdown',
                base_price: 65,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'crit_damage', value: 1.1, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Critical thinker',
                description: 'Increase critical hit damage, but decrease non critical hit damage.',
                rarity: 'Uncommon',
                category: 'critical',
                mode: 'topdown',
                base_price: 80,
                price_multiplier: 1.5,
                max_upgrade: 2,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'crit_damage', value: 1.25, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Ambush',
                description: 'Shots against full-health enemies have increased critical chance.',
                rarity: 'Uncommon',
                category: 'critical',
                mode: 'topdown',
                base_price: 70,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'crit_chance_full_health_target', value: 0.05, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Critical Surge',
                description: 'Landing a crit briefly increases the chance that your next shot will also crit.',
                rarity: 'Epic',
                category: 'critical',
                mode: 'topdown',
                base_price: 100,
                price_multiplier: 1.5,
                max_upgrade: 2,
                spawn_chance: spawnChances.Epic,
            },
            effects: [
                { stat: 'crit_chain_chance', value: 0.1, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Heartstopper',
                description: 'Critical hits have a chance to instantly eliminate non-elite enemies.',
                rarity: 'Legendary',
                category: 'critical',
                mode: 'topdown',
                base_price: 130,
                price_multiplier: 1.5,
                max_upgrade: 1,
                spawn_chance: spawnChances.Legendary,
            },
            effects: [
                { stat: 'instant_kill_chance_on_crit', value: 0.02, type: 'add' },
            ],
        },

        // ------------------
        // Economy Upgrades
        // ------------------
        {
            upgrade: {
                name: 'Rich Get Richer',
                description: 'Earn more per 100 gold you have.',
                rarity: 'Uncommon',
                category: 'economy',
                mode: 'both',
                base_price: 65,
                price_multiplier: 1.2,
                max_upgrade: 4,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'gold_gain', value: 1.2, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Scavenger',
                description: 'Earn more gold from enemies.',
                rarity: 'Uncommon',
                category: 'economy',
                mode: 'both',
                base_price: 70,
                price_multiplier: 1.2,
                max_upgrade: 4,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'gold_gain', value: 1.1, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Investor',
                description: 'Earn more gold from interest.',
                rarity: 'Common',
                category: 'economy',
                mode: 'both',
                base_price: 55,
                price_multiplier: 1.2,
                max_upgrade: 4,
                spawn_chance: spawnChances.Common,
            },
            effects: [
                { stat: 'interest', value: 1.1, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Paycheck',
                description: 'Earn gold per minute/round.',
                rarity: 'Uncommon',
                category: 'economy',
                mode: 'both',
                base_price: 65,
                price_multiplier: 1.2,
                max_upgrade: 4,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'gold_gain', value: 50, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: "Haggler's Instinct",
                description: 'Increases the chance of finding items on sale in shops.',
                rarity: 'Uncommon',
                category: 'economy',
                mode: 'both',
                base_price: 70,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'sale_chance', value: 0.1, type: 'add' },
            ],
        },
        {
            upgrade: {
                name: 'Black Market Access',
                description: 'Gives you a discount in shops.',
                rarity: 'Uncommon',
                category: 'economy',
                mode: 'both',
                base_price: 75,
                price_multiplier: 1.3,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'shop_price', value: 0.9, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: 'Coin Magnet',
                description: 'Increases the radius at which you automatically collect dropped gold.',
                rarity: 'Uncommon',
                category: 'economy',
                mode: 'both',
                base_price: 60,
                price_multiplier: 1.2,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'gold_pickup_radius', value: 1.25, type: 'multiply' },
            ],
        },
        {
            upgrade: {
                name: "Smuggler's Tactics",
                description: 'You gain more gold when selling unwanted items or upgrades.',
                rarity: 'Uncommon',
                category: 'economy',
                mode: 'both',
                base_price: 65,
                price_multiplier: 1.2,
                max_upgrade: 3,
                spawn_chance: spawnChances.Uncommon,
            },
            effects: [
                { stat: 'sell_price', value: 1.15, type: 'multiply' },
            ],
        },
    ];
    await db.transaction(async (tx) => {
        for (const { upgrade, effects } of seeds) {
            const inserted = await tx.insert(upgradesTable).values({
                name: upgrade.name,
                description: upgrade.description,
                rarity: upgrade.rarity,
                category: upgrade.category,
                mode: upgrade.mode,
                base_price: upgrade.base_price,
                price_multiplier: upgrade.price_multiplier.toString(),
                max_upgrade: upgrade.max_upgrade,
                spawn_chance: upgrade.spawn_chance.toString()
            }).returning({ id: upgradesTable.id });

            const upgradeId = inserted[0].id;
            // Insert all associated effects with a foreign key back to the upgrade
            const seedsWithFK = effects.map(effect => ({
                upgradeId,
                stat: effect.stat,
                value: effect.value,
                type: effect.type
            }));

            for (const seed of seedsWithFK) {
                await tx.insert(upgradeEffectsTable).values({
                    upgradeId: seed.upgradeId,
                    stat: seed.stat,
                    value: seed.value.toString(),
                    type: seed.type
                });
            }
        }
    });
}

await seedUpgrades();


// // Insert upgrade with pladceholder values
// await db.insert(upgradesTable).values({
//     name: 'Placeholder Upgrade',
//     description: 'This is a placeholder upgrade.',
//     rarity: 'Common',
//     category: 'placeholder',
//     mode: 'both',
//     base_price: 0,
//     price_multiplier: "1",
//     max_upgrade: 1,
//     spawn_chance: "0",
// }).returning({ id: upgradesTable.id });