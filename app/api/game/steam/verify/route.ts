import { jwtVerify } from 'jose';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json(
        { success: false, error: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return Response.json({ 
      success: true, 
      steamId: payload.steamId 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return Response.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}