/**
 * FILE: apps/admin/src/app/api/admin/prices/[id]/route.ts
 * PURPOSE: PUT /api/admin/prices/[id] — update a rental price
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 13.1)
 *
 * DEPENDENCIES:
 *   - @ninja-shop/shared: priceUpdateSchema, pool (mysql2)
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/prices/route.ts: GET
 *   - apps/admin/src/app/dashboard/prices/page.tsx: UI
 *   - packages/shared/src/validators/index.ts: priceUpdateSchema
 *
 * Requirements: 10.2–10.6
 */

import { NextRequest, NextResponse } from 'next/server'
import { priceUpdateSchema, pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

// PUT /api/admin/prices/[id] — update rental price
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

  const parsed = priceUpdateSchema.safeParse(body)
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

  const { price, duration_days, description, is_active } = parsed.data

  try {
    const [result] = await pool.execute<any>(
      `UPDATE rental_prices
       SET price=?, duration_days=?, description=?, is_active=?, updated_at=NOW()
       WHERE id=?`,
      [
        price,
        duration_days,
        description ?? null,
        is_active ? 1 : 0,  // Convert boolean to TINYINT
        id,
      ]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'ไม่พบราคานี้' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { id } })
  } catch (err) {
    console.error('[PUT /api/admin/prices/[id]]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
