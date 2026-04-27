/**
 * FILE: apps/admin/src/middleware.ts
 * PURPOSE: Next.js Edge middleware — JWT authentication for protected admin routes
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 9.6)
 *
 * DEPENDENCIES:
 *   - next/server: NextRequest, NextResponse (Edge Runtime)
 *   - apps/admin/src/lib/jwt: verifyToken (jose — Edge-compatible)
 *
 * RELATED FILES:
 *   - apps/admin/src/lib/jwt.ts: JWT verification
 *   - apps/admin/src/app/api/admin/auth/login/route.ts: Issues tokens
 *   - apps/admin/src/app/login/page.tsx: Redirect target for unauthenticated browsers
 *
 * Protected paths:
 *   - /dashboard/* — page routes (redirect to /login on failure)
 *   - /api/admin/* — API routes (return 401 JSON on failure)
 *   - Exception: /api/admin/auth/login is always public
 *
 * Requirements: 5.5, 5.6
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow the login endpoint through
  if (pathname === '/api/admin/auth/login') {
    return NextResponse.next()
  }

  // Extract token from Authorization header or cookie
  const authHeader = request.headers.get('authorization') ?? ''
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  const cookieToken = request.cookies.get('admin_token')?.value ?? null

  const token = bearerToken ?? cookieToken

  const isApiRoute = pathname.startsWith('/api/')

  if (!token) {
    return isApiRoute
      ? NextResponse.json(
          {
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'กรุณาเข้าสู่ระบบ' },
          },
          { status: 401 }
        )
      : NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = await verifyToken(token)

  if (!payload) {
    return isApiRoute
      ? NextResponse.json(
          {
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Token ไม่ถูกต้องหรือหมดอายุ' },
          },
          { status: 401 }
        )
      : NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
