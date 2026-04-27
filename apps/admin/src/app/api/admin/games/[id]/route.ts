/**
 * FILE: apps/admin/src/app/api/admin/games/[id]/route.ts
 * PURPOSE: DELETE /api/admin/games/[id] — delete game (ON DELETE CASCADE handles account_games)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 12.4)
 *
 * DEPENDENCIES:
 *   - @ninja-shop/shared: pool (mysql2)
 *
 * RELATED FILES:
 *   - apps/admin/src/middleware.ts: JWT auth
 *   - apps/admin/src/app/api/admin/games/route.ts: GET + POST
 *
 * Requirements: 8.6, 8.7, 14.3
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

// DELETE /api/admin/games/[id] — delete game; FK ON DELETE CASCADE removes account_games rows
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ID', message: 'ID ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  try {
    const [result] = await pool.execute<any>(
      'DELETE FROM games WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'ไม่พบเกมนี้' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { id } })
  } catch (err) {
    console.error('[DELETE /api/admin/games/[id]]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
