/**
 * FILE: apps/admin/src/app/api/admin/settings/route.ts
 * PURPOSE: GET /api/admin/settings — list all system settings
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 13.2)
 *
 * DEPENDENCIES:
 *   - @ninja-shop/shared: pool (mysql2)
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/settings/[key]/route.ts: PUT
 *   - apps/admin/src/app/dashboard/settings/page.tsx: UI
 *
 * Requirements: 11.1–11.7
 */

import { NextResponse } from 'next/server'
import { pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

// GET /api/admin/settings — fetch all settings
export async function GET() {
  try {
    const [rows] = await pool.execute<any[]>(
      `SELECT id, setting_key, setting_value, description, data_type
       FROM settings
       ORDER BY id`
    )

    return NextResponse.json({ success: true, data: rows })
  } catch (err) {
    console.error('[GET /api/admin/settings]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
