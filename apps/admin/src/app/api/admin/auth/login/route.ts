/**
 * FILE: apps/admin/src/app/api/admin/auth/login/route.ts
 * PURPOSE: POST /api/admin/auth/login — authenticate admin user and return JWT
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 9.3)
 *
 * DEPENDENCIES:
 *   - bcryptjs: Password hash comparison
 *   - @ninja-shop/shared: loginSchema, pool (mysql2)
 *   - apps/admin/src/lib/jwt: signToken
 *
 * RELATED FILES:
 *   - apps/admin/src/lib/jwt.ts: JWT signing
 *   - apps/admin/src/middleware.ts: JWT verification on protected routes
 *   - packages/shared/src/validators/index.ts: loginSchema
 *   - packages/shared/src/db/client.ts: MySQL connection pool
 *
 * Requirements: 5.1–5.4, 5.7
 */

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { loginSchema, pool } from '@ninja-shop/shared'
import { signToken } from '@/lib/jwt'

export const runtime = 'nodejs'

const INVALID_CREDENTIALS_RESPONSE = NextResponse.json(
  {
    success: false,
    error: {
      code: 'INVALID_CREDENTIALS',
      message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
    },
  },
  { status: 401 }
)

export async function POST(request: NextRequest) {
  // 1. Parse and validate request body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INVALID_JSON', message: 'Request body ไม่ถูกต้อง' },
      },
      { status: 400 }
    )
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
          fields: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    )
  }

  const { username, password } = parsed.data

  // 2. Query admin_users table
  type AdminRow = {
    id: number
    username: string
    password_hash: string
    role: 'admin' | 'super_admin'
    is_active: number
  }

  let rows: AdminRow[]
  try {
    const [result] = await pool.execute<any[]>(
      'SELECT id, username, password_hash, role, is_active FROM admin_users WHERE username = ?',
      [username]
    )
    rows = result as AdminRow[]
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' },
      },
      { status: 500 }
    )
  }

  if (rows.length === 0) {
    return INVALID_CREDENTIALS_RESPONSE
  }

  const user = rows[0]

  // 3. Check is_active
  if (user.is_active !== 1) {
    return INVALID_CREDENTIALS_RESPONSE
  }

  // 4. Verify password with bcrypt
  const passwordMatch = await bcrypt.compare(password, user.password_hash)
  if (!passwordMatch) {
    return INVALID_CREDENTIALS_RESPONSE
  }

  // 5. Sign JWT token
  const token = await signToken({
    sub: user.id,
    username: user.username,
    role: user.role,
  })

  // 6. Update last_login timestamp
  try {
    await pool.execute(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [user.id]
    )
  } catch {
    // Non-fatal: log but don't fail the login
    console.error('[login] Failed to update last_login for user:', user.id)
  }

  return NextResponse.json({ success: true, token })
}
