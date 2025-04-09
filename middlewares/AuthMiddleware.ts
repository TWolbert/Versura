import { db } from "@/db";
import getAppKey from "@/utils/AppKey";
import { decryptWithJose } from "@/utils/Crypto";
import { eq } from "drizzle-orm";

export async function AuthMidddleware(request: Request) {
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

    const decrypted = await decryptWithJose(token, getAppKey());
    console.log(decrypted);

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

    return true;
}