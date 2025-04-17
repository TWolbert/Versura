// lib/token.ts
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.STEAM_JWT_SECRET)

export async function signSteamToken(steamID: string): Promise<string> {
  return await new SignJWT({ steamID })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret)
}

export async function verifySteamToken(token: string): Promise<{ steamId: string }> {
  const { payload } = await jwtVerify(token, secret)
  return payload as { steamId: string }
}
