import { db } from "@/db";
import Cache from "@/db/cache";
import { highscoresTable } from "@/db/models/highscores";
import { roundsTable } from "@/db/models/rounds";
import { steamUsersTable } from "@/db/models/steamUsers";
import { StandardResponse } from "@/utils/StandardResponse";
import { desc, eq } from "drizzle-orm";

export async function GET() {
    const world_id = 1; // TODO: get this from the request
    const top10 = await new Cache().func("top10", async () => await getLeaderBoardTop10(world_id))
    return StandardResponse({
        status: 'success',
        data: top10,
    });
}

export async function getLeaderBoardTop10(world_id: number) {
    return await db
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
        .where(eq(roundsTable.levelId, world_id))
        .orderBy(desc(roundsTable.score))
        .limit(10);

}
