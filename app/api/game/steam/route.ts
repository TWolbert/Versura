import axios from 'axios';
import { Buffer } from 'buffer';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { steam_id, ticket } = await req.json();

    // Decode base64 ticket to buffer
    const ticketBuffer = Buffer.from(ticket, 'base64');

    // Convert buffer to hexadecimal string
    const hexTicket = ticketBuffer.toString('hex');

    // Steam API configuration
    const steamApiUrl = `https://api.steampowered.com/ISteamUserAuth/AuthenticateUserTicket/v1/`;
    const params = {
      key: process.env.STEAM_WEB_API_KEY,
      appid: process.env.STEAM_APP_ID,
      ticket: hexTicket,
      steamid: steam_id
    };

    // Verify ticket with Steam
    const steamResponse = await axios.get(steamApiUrl, { params });
    const steamData = steamResponse.data;
    console.log('Steam response:', steamData);

    if (
      steamData.response?.params?.result === 'OK' &&
      steamData.response.params.steamid === steam_id
    ) {
      // Create JWT token using jose
      const secret = new TextEncoder().encode(process.env.STEAM_JWT_SECRET);
      const token = await new SignJWT({ steamId: steam_id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret);

      return Response.json({
        success: true,
        token
      });
    }

    return Response.json(
      { success: false, error: 'Invalid Steam authentication' },
      { status: 401 } 
    );
  } catch (error) {
    console.error('Steam authentication error:', error);
    return Response.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}