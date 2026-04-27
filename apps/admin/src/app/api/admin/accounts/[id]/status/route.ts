/**
 * FILE: apps/admin/src/app/api/admin/accounts/[id]/status/route.ts
 * PURPOSE: PUT /api/admin/accounts/[id]/status — update rental status
 *          rented: requires future rented_until date
 *          available: clears rented_until to NULL
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 11.7)
 *
 * DEPENDENCIES:
 *   - @ninja-shop/shared: rentalStatusSchema, pool (mysql2)
 *
 * RELATED FILES:
 *   - apps/admin/src/middleware.ts: JWT auth
 *   - apps/admin/src/app/api/admin/accounts/[id]/route.ts: PUT + DELETE
 *   - packages/shared/src/validators/index.ts: rentalStatusSchema
 *
 * Requirements: 7.1–7.5, Property 14, Property 15
 */

import { NextRequest, NextResponse } from 'next/server'
import { rentalStatusSchema, pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

// PUT /api/admin/accounts/[id]/status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ID', message: 'ID ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  const parsed = rentalStatusSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ข้อมูลไม่ถูกต้อง',
          fields: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    )
  }

  const { status, rented_until } = parsed.data
  // available → clear rented_until; rented → use provided date
  const rentedUntilValue = status === 'available' ? null : (rented_until ?? null)

  try {
    const [result] = await pool.execute<any>(
      'UPDATE accounts SET status=?, rented_until=?, updated_at=NOW() WHERE id=?',
      [status, rentedUntilValue, id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'ไม่พบไอดีนี้' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { id, status, rented_until: rentedUntilValue } })
  } catch (err) {
    console.error('[PUT /api/admin/accounts/[id]/status]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
