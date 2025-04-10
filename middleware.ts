import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AuthMidddleware } from './middlewares/AuthMiddleware'
import { StandardResponse } from './utils/StandardResponse'

const isDev = process.env.APP_ENV === 'local'

export const config = {
    matcher: '/:path*',
}

enum AuthType {
    auth = 'auth',
    game = 'game',
}

const authRules: Record<AuthType, string[]> = {
    auth: ['/test'],
    game: ['/test'],
}

const getAuthTypeForPath = (pathname: string): 'auth' | 'game' | null => {
    for (const [type, paths] of Object.entries(authRules)) {
        if (paths.some(path => pathname.startsWith(path))) {
            return type as AuthType
        }
    }
    return null
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const authType = getAuthTypeForPath(path)

    if (authType) {
        const isAuthorized = await AuthMidddleware(request)
        if (!isAuthorized) {

            const errorMessage = isDev ? `Unauthorized access to ${path} because of missing or invalid ${authType} token` : `Unauthorized access to ${path}`

            return StandardResponse(
                { error: errorMessage },
                401,
                'Unauthorized'
            )
        }
    }

    return NextResponse.next()
}
