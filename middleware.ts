import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AuthMidddleware } from './middlewares/AuthMiddleware'
import { GameMiddleware } from './middlewares/GameMiddleware'
import { StandardResponse } from './utils/StandardResponse'

const isDev = process.env.APP_ENV === 'local'

export const config = {
    matcher: '/:path*',
}

// Define known middleware identifiers
enum MiddlewareType {
    Auth = 'auth',
    Game = 'game',
}

// Middleware function signature
type MiddlewareFn = (req: NextRequest) => Promise<boolean>

// Central registry of all middleware implementations
const middlewareRegistry: Record<MiddlewareType, MiddlewareFn> = {
    [MiddlewareType.Auth]: AuthMidddleware,
    [MiddlewareType.Game]: GameMiddleware,
}

// Map paths to arrays of middleware types
const routeMiddlewareMap: Record<string, MiddlewareType[]> = {
    '/test': [MiddlewareType.Auth, MiddlewareType.Game],
    // add more paths and middleware combos here
}

// Get all applicable middlewares for a given path
const getMiddlewaresForPath = (pathname: string): MiddlewareType[] => {
    for (const [routePrefix, middlewareList] of Object.entries(routeMiddlewareMap)) {
        if (pathname.startsWith(routePrefix)) {
            return middlewareList
        }
    }
    return []
}

// Error response helpers
const handleUnauthorized = (path: string, reason: string) =>
    StandardResponse(
        { error: isDev ? `Unauthorized access to ${path} due to ${reason}` : `Unauthorized access to ${path}` },
        401,
        'Unauthorized'
    )

const handleForbidden = (path: string, reason: string) =>
    StandardResponse(
        { error: isDev ? `Access to ${path} denied: ${reason}` : `Access denied` },
        403,
        'Forbidden'
    )

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const middlewaresToRun = getMiddlewaresForPath(path)

    if (!middlewaresToRun.length) return NextResponse.next()

    for (const middlewareType of middlewaresToRun) {
        const middlewareFn = middlewareRegistry[middlewareType]

        const allowed = await middlewareFn(request)
        if (!allowed) {
            switch (middlewareType) {
                case MiddlewareType.Auth:
                    return handleUnauthorized(path, 'AuthMiddleware rejection')
                case MiddlewareType.Game:
                    return handleForbidden(path, 'GameMiddleware rejection')
                default:
                    return handleForbidden(path, `Unhandled middleware: ${middlewareType}`)
            }
        }
    }

    return NextResponse.next()
}
