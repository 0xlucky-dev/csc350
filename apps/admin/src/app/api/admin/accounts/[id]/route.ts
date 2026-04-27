/**
 * FILE: apps/admin/src/app/api/admin/accounts/[id]/route.ts
 * PURPOSE: PUT /api/admin/accounts/[id] — update account with games
 *          DELETE /api/admin/accounts/[id] — delete account (cascade via FK)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@ninja-shop/shared'
import { z } from 'zod'

export const runtime = 'nodejs'

// PUT /api/admin/accounts/[id] — update account with games
const updateSchema = z.object({
  status: z.enum(['available', 'rented']),
  rented_until: z.string().nullable().optional(),
  notes: z.string().optional(),
  game_ids: z.array(z.number()).optional(),
  price_ps5_own: z.number().nullable().optional(),
  price_ps5_shop: z.number().nullable().optional(),
  price_ps4: z.number().nullable().optional(),
  status_ps5_own: z.enum(['available', 'rented']).optional(),
  status_ps5_shop: z.enum(['available', 'rented']).optional(),
  status_ps4: z.enum(['available', 'rented']).optional(),
  rented_until_ps5_own: z.string().nullable().optional(),
  rented_until_ps5_shop: z.string().nullable().optional(),
  rented_until_ps4: z.string().nullable().optional(),
})

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

  const parsed = updateSchema.safeParse(body)
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

  const { status, rented_until, notes, game_ids, price_ps5_own, price_ps5_shop, price_ps4,
    status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, rented_until_ps5_shop, rented_until_ps4 } = parsed.data

  const conn = await pool.getConnection()
  
  try {
    await conn.beginTransaction()

    // Update account
    const [result] = await conn.execute<any>(
      `UPDATE accounts
       SET status=?, rented_until=?, notes=?, 
           price_ps5_own=?, price_ps5_shop=?, price_ps4=?,
           status_ps5_own=?, status_ps5_shop=?, status_ps4=?,
           rented_until_ps5_own=?, rented_until_ps5_shop=?, rented_until_ps4=?,
           updated_at=NOW()
       WHERE id=?`,
      [
        status,
        rented_until ?? null,
        notes ?? null,
        price_ps5_own ?? null,
        price_ps5_shop ?? null,
        price_ps4 ?? null,
        status_ps5_own ?? 'available',
        status_ps5_shop ?? 'available',
        status_ps4 ?? 'available',
        rented_until_ps5_own ?? null,
        rented_until_ps5_shop ?? null,
        rented_until_ps4 ?? null,
        id,
      ]
    )

    if (result.affectedRows === 0) {
      await conn.rollback()
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'ไม่พบไอดีนี้' } },
        { status: 404 }
      )
    }

    // Update games if provided
    if (game_ids !== undefined) {
      // Delete existing games
      await conn.execute('DELETE FROM account_games WHERE account_id=?', [id])
      
      // Insert new games
      if (game_ids.length > 0) {
        const values = game_ids.map(gameId => [id, gameId])
        await conn.query(
          `INSERT INTO account_games (account_id, game_id) VALUES ?`,
          [values]
        )
      }
    }

    await conn.commit()

    return NextResponse.json({ success: true, data: { id } })
  } catch (err: any) {
    await conn.rollback()
    
    console.error('[PUT /api/admin/accounts/[id]]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  } finally {
    conn.release()
  }
}

// DELETE /api/admin/accounts/[id] — delete account (ON DELETE CASCADE handles account_games)
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
      'DELETE FROM accounts WHERE id=?',
      [id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'ไม่พบไอดีนี้' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { id } })
  } catch (err) {
    console.error('[DELETE /api/admin/accounts/[id]]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
