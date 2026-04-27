/**
 * FILE: apps/admin/src/app/api/admin/accounts/[id]/games/route.ts
 * PURPOSE: POST /api/admin/accounts/[id]/games — bulk add games to an account (INSERT IGNORE)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 12.5)
 *
 * DEPENDENCIES:
 *   - @ninja-shop/shared: pool (mysql2)
 *
 * RELATED FILES:
 *   - apps/admin/src/middleware.ts: JWT auth
 *   - apps/admin/src/app/api/admin/accounts/[id]/games/[gameId]/route.ts: DELETE single game
 *
 * Requirements: 9.2, 9.3, 9.4, 9.7
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

// POST /api/admin/accounts/[id]/games — bulk add games; INSERT IGNORE handles duplicates silently
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const accountId = Number(params.id)
  if (!Number.isInteger(accountId) || accountId <= 0) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ID', message: 'Account ID ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  const { game_ids } = body ?? {}
  if (!Array.isArray(game_ids) || game_ids.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'กรุณาระบุ game_ids' } },
      { status: 400 }
    )
  }

  const validIds = game_ids.filter((id) => Number.isInteger(id) && id > 0)
  if (validIds.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'game_ids ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  try {
    for (const gameId of validIds) {
      await pool.execute(
        'INSERT IGNORE INTO account_games (account_id, game_id) VALUES (?, ?)',
        [accountId, gameId]
      )
    }

    return NextResponse.json({ success: true, data: { added: validIds.length } })
  } catch (err) {
    console.error('[POST /api/admin/accounts/[id]/games]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
