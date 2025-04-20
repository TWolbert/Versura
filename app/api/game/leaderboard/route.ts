import { db } from "@/db";
import Cache from "@/db/cache";
import { highscoresTable } from "@/db/models/highscores";
import { roundsTable } from "@/db/models/rounds";
import { steamUsersTable } from "@/db/models/steamUsers";
import { desc, eq, gt } from "drizzle-orm";
import { StandardResponse } from "@/utils/StandardResponse";
import { NextRequest } from "next/server";
import { getLeaderBoardTop10 } from "../leaderboards/route";

export async function POST(req: NextRequest) {
    const body = await req.json().then((data) => new Map(Object.entries(data)));
    const type = body.get("type");
    const levelId = body.get("level_id");
    const steamId = req.headers.get("steamID") ?? 'e2b6330f-a6fc-4b96-8f55-0045b32b4cdb';
    const { id: playerId } = (await db.select({ id: steamUsersTable.id })
        .from(steamUsersTable)
        .where(eq(steamUsersTable.steamId, steamId)))[0]
    console.log('id', playerId)

    if (type === "top10") {
        const top10 = await new Cache().func("top10", async () => await getLeaderBoardTop10(Number(levelId)));
        return StandardResponse({
            status: "success",
            data: top10,
        });
    }

    if (type === "player" && playerId) {
        const cacheKey = `player_leaderboard_${playerId}`;
        if (process.env.NODE_ENV === "development") {
            await new Cache().del(cacheKey);
        }

        const result = await new Cache().func(cacheKey, async () => {
            const playerHighScore = await db
                .select({
                    id: highscoresTable.id,
                    score: roundsTable.score,
                })
                .from(highscoresTable)
                .innerJoin(roundsTable, eq(roundsTable.id, highscoresTable.roundId))
                .where(eq(highscoresTable.steamUserId, Number(playerId)))
                .orderBy(desc(roundsTable.score))
                .limit(1)
                .then((res) => res[0]);

            if (!playerHighScore) return null;

            const scoresAboveCount = await db
                .select()
                .from(roundsTable)
                .where(gt(roundsTable.score, playerHighScore.score))
                .then((rows) => rows.length);

            const offset = Math.max(0, scoresAboveCount - 4);

            const aroundScores = await db
                .select({
                    roundId: roundsTable.id,
                    levelId: roundsTable.levelId,
                    score: roundsTable.score,
                    highscoreId: highscoresTable.id,
                    playerId: steamUsersTable.id,
                    playerUsername: steamUsersTable.username,
                })
                .from(roundsTable)
                .innerJoin(highscoresTable, eq(highscoresTable.roundId, roundsTable.id))
                .innerJoin(steamUsersTable, eq(highscoresTable.steamUserId, steamUsersTable.id))
                .orderBy(desc(roundsTable.score))
                .offset(offset)
                .limit(10);

            const topPlayers = await db
                .select({
                    roundId: roundsTable.id,
                    levelId: roundsTable.levelId,
                    score: roundsTable.score,
                    highscoreId: highscoresTable.id,
                    playerId: steamUsersTable.id,
                    playerUsername: steamUsersTable.username,
                })
                .from(roundsTable)
                .innerJoin(highscoresTable, eq(highscoresTable.roundId, roundsTable.id))
                .innerJoin(steamUsersTable, eq(highscoresTable.steamUserId, steamUsersTable.id))
                .orderBy(desc(roundsTable.score))
                .limit(3);

            const combined = [...topPlayers, ...aroundScores];
            const deduplicated = combined
                .filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.highscoreId === item.highscoreId)
                )
                .sort((a, b) => b.score - a.score);

            const withRanks = await Promise.all(
                deduplicated.map(async (entry) => {
                    const higher = await db
                        .select()
                        .from(roundsTable)
                        .where(gt(roundsTable.score, entry.score));
                    const position = higher.length + 1;
                    return {
                        ...entry,
                        position,
                    };
                })
            );

            return withRanks;
        });

        if (!result) {
            return StandardResponse({ status: "error", error: "Player high score not found" }, 404);
        }

        return StandardResponse({
            status: "success",
            data: result,
        });
    }

    return StandardResponse({ status: "error", error: "Invalid type or missing playerId" }, 400);
}
