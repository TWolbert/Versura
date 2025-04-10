import { decryptWithWebCrypto } from "@/utils/Crypto";

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function GameMiddleware(req: Request): Promise<boolean> {
  const isDev = process.env.APP_ENV === "local";
  if (isDev) {
    return true;
  }

  const encryptedToken = req.headers.get("X-Game-Signature");
  const timestamp = req.headers.get("X-Timestamp");
  const keyString = process.env.GAME_API_SECRET;

  if (!encryptedToken || !timestamp || !keyString) {
    return false;
  }

  try {
    const decrypted = await decryptWithWebCrypto(encryptedToken, keyString);
    return constantTimeCompare(decrypted, timestamp);
  } catch (err) {
    console.error("Godot request verification failed:", err);
    return false;
  }
}
