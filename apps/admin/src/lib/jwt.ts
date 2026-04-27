/**
 * FILE: apps/admin/src/lib/jwt.ts
 * PURPOSE: JWT sign/verify utilities for Admin Dashboard authentication
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 9.1)
 *
 * DEPENDENCIES:
 *   - jose: JWT library compatible with Next.js Edge Runtime
 *   - process.env.JWT_SECRET: Secret key for signing tokens
 *
 * RELATED FILES:
 *   - apps/admin/src/middleware.ts: Uses verifyToken for route protection
 *   - apps/admin/src/app/api/admin/auth/login/route.ts: Uses signToken on login
 *
 * Requirements: 5.2, 5.5
 */

import { SignJWT, jwtVerify } from 'jose'

export interface AdminJWTPayload {
  sub: number
  username: string
  role: 'admin' | 'super_admin'
  iat: number
  exp: number
}

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'ninja-shop-secret-change-in-production'
)

/**
 * Sign a JWT token for an admin user.
 * Expiration is set to exactly iat + 86400 seconds (24 hours).
 */
export async function signToken(
  payload: Omit<AdminJWTPayload, 'iat' | 'exp'>
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 86400

  return new SignJWT({ ...payload, iat, exp })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret)
}

/**
 * Verify a JWT token and return the decoded payload, or null if invalid/expired.
 */
export async function verifyToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as AdminJWTPayload
  } catch {
    return null
  }
}
