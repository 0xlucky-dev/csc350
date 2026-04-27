/**
 * FILE: apps/admin/src/app/api/admin/prices/route.ts
 * PURPOSE: GET /api/admin/prices — list all rental prices
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 13.1)
 *
 * DEPENDENCIES:
 *   - @ninja-shop/shared: pool (mysql2)
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/prices/[id]/route.ts: PUT
 *   - apps/admin/src/app/dashboard/prices/page.tsx: UI
 *
 * Requirements: 10.1–10.6
 */

import { NextResponse } from 'next/server'
import { pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

// GET /api/admin/prices — fetch all rental prices
export async function GET() {
  try {
    const [rows] = await pool.execute<any[]>(
      `SELECT id, rental_type, price, duration_days, description, is_active
       FROM rental_prices
       ORDER BY id`
    )

    // Convert MySQL types: price (DECIMAL→string) to number, is_active (TINYINT) to boolean
    const data = rows.map((row) => ({
      ...row,
      price: Number(row.price),
      is_active: Boolean(row.is_active),
    }))

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[GET /api/admin/prices]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
