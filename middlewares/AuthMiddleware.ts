import { verifySteamToken } from "@/utils/SteamToken";

export async function AuthMidddleware(request: Request) {
    // Get auth bearer token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return false;
    }

    const steamId = await verifySteamToken(authHeader);
    if (!steamId) {
        return false;
    }

    // Attach steamID to request object
    request.headers.set('steamID', steamId.steamId);
    return true;    
}