/**
 * FILE: apps/admin/src/app/api/admin/accounts/[id]/games/[gameId]/route.ts
 * PURPOSE: DELETE /api/admin/accounts/[id]/games/[gameId] — remove a game from an account
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 12.7)
 *
 * DEPENDENCIES:
 *   - @ninja-shop/shared: pool (mysql2)
 *
 * RELATED FILES:
 *   - apps/admin/src/middleware.ts: JWT auth
 *   - apps/admin/src/app/api/admin/accounts/[id]/games/route.ts: POST bulk add
 *
 * Requirements: 9.5
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

// DELETE /api/admin/accounts/[id]/games/[gameId] — unlink game from account
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; gameId: string } }
) {
  const accountId = Number(params.id)
  const gameId = Number(params.gameId)

  if (!Number.isInteger(accountId) || accountId <= 0 || !Number.isInteger(gameId) || gameId <= 0) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ID', message: 'ID ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  try {
    const [result] = await pool.execute<any>(
      'DELETE FROM account_games WHERE account_id = ? AND game_id = ?',
      [accountId, gameId]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'ไม่พบเกมนี้ในไอดีดังกล่าว' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { accountId, gameId } })
  } catch (err) {
    console.error('[DELETE /api/admin/accounts/[id]/games/[gameId]]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
