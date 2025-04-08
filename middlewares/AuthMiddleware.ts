import { db } from "@/db";
import { steamUsersTable } from "@/db/schema";
import getAppKey from "@/utils/AppKey";
import DecryptAES256CBC from "@/utils/Crypto";
import { eq } from "drizzle-orm";

export function AuthMidddleware(request: Request) {
    // Get auth bearer token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return false;
    }

    // Check if the token is valid
    const token = authHeader.split(' ')[1];
    if (!token) {
        return false;
    }

    const decrypted = DecryptAES256CBC(getAppKey(), token);

    // Check if the decrypted token is empty
    if (!decrypted) {
        return false;
    }

    // Check if the decrypted token is valid
    const tokenParts = decrypted.split('.');

    // Check if the token has 3 parts
    if (tokenParts.length !== 3) {
        return false;
    }

    const playerId = Buffer.from(tokenParts[2], 'base64').toString('utf-8');
    const player = db.select().from(steamUsersTable).where(eq(steamUsersTable.id, parseInt(playerId)));

    if (!player) {
        return false;
    }
    
    request.headers.set('player', JSON.stringify(player));
    request.headers.set('playerId', playerId);
    return true;
}