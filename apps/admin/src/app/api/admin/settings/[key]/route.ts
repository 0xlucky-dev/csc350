/**
 * FILE: apps/admin/src/app/api/admin/settings/[key]/route.ts
 * PURPOSE: PUT /api/admin/settings/[key] — update a system setting value
 *          Validates LINE URL and Facebook URL formats
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 13.2)
 *
 * DEPENDENCIES:
 *   - @ninja-shop/shared: lineUrlSchema, facebookUrlSchema, pool (mysql2)
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/settings/route.ts: GET
 *   - apps/admin/src/app/dashboard/settings/page.tsx: UI
 *   - packages/shared/src/validators/index.ts: lineUrlSchema, facebookUrlSchema
 *
 * Requirements: 11.2–11.4
 */

import { NextRequest, NextResponse } from 'next/server'
import { lineUrlSchema, facebookUrlSchema, pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

// PUT /api/admin/settings/[key] — update setting value
export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const key = params.key

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  const { value } = body as { value?: string | null }

  // Allow null/empty to clear the setting
  if (value !== null && value !== undefined && value !== '') {
    // Validate LINE URL format
    if (key === 'line_url') {
      const parsed = lineUrlSchema.safeParse(value)
      if (!parsed.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: parsed.error.errors[0]?.message ?? 'LINE URL ไม่ถูกต้อง',
              fields: { value: [parsed.error.errors[0]?.message ?? 'LINE URL ไม่ถูกต้อง'] },
            },
          },
          { status: 400 }
        )
      }
    }

    // Validate Facebook URL format
    if (key === 'facebook_url') {
      const parsed = facebookUrlSchema.safeParse(value)
      if (!parsed.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: parsed.error.errors[0]?.message ?? 'Facebook URL ไม่ถูกต้อง',
              fields: { value: [parsed.error.errors[0]?.message ?? 'Facebook URL ไม่ถูกต้อง'] },
            },
          },
          { status: 400 }
        )
      }
    }
  }

  try {
    const [result] = await pool.execute<any>(
      `UPDATE settings SET setting_value=?, updated_at=NOW() WHERE setting_key=?`,
      [value ?? null, key]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'ไม่พบ setting นี้' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { key } })
  } catch (err) {
    console.error('[PUT /api/admin/settings/[key]]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
