import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AuthMidddleware } from './middlewares/AuthMiddleware';

export const config = {
    matcher: '/:path*',
}

const authProtectedPaths = [
    '/test',
];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // Check if the request is for a protected path
    const isProtectedPath = authProtectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
    if (isProtectedPath) {
        const res = await AuthMidddleware(request);
        if (!res) {
            // Return 401 Unauthorized response
            return NextResponse.json(
                { error: 'Unauthorized' },
                {
                    status: 401,
                    statusText: 'Unauthorized',
                    headers: {
                        'WWW-Authenticate': 'Bearer',
                    },
                }
            )
        }
    }

    return NextResponse.next()
}