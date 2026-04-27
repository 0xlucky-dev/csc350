/**
 * FILE: apps/admin/src/app/api/admin/accounts/route.ts
 * PURPOSE: GET /api/admin/accounts — list all accounts with games
 *          POST /api/admin/accounts — create new account with games
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@ninja-shop/shared'
import { z } from 'zod'

export const runtime = 'nodejs'

// GET /api/admin/accounts — fetch all accounts with games
export async function GET() {
  try {
    const conn = await pool.getConnection()
    
    try {
      // Get all accounts
      const [accounts] = await conn.query<any[]>(
        `SELECT a.id, a.account_number, a.status, a.rented_until, a.notes,
                a.price_ps5_own, a.price_ps5_shop, a.price_ps4,
                a.status_ps5_own, a.status_ps5_shop, a.status_ps4,
                a.rented_until_ps5_own, a.rented_until_ps5_shop, a.rented_until_ps4,
                COUNT(ag.game_id) AS game_count
         FROM accounts a
         LEFT JOIN account_games ag ON ag.account_id = a.id
         GROUP BY a.id
         ORDER BY CAST(a.account_number AS UNSIGNED)`
      )

      // Get games for each account
      for (const account of accounts) {
        const [games] = await conn.query<any[]>(
          `SELECT g.id, g.title, g.image_url, g.genre
           FROM games g
           INNER JOIN account_games ag ON ag.game_id = g.id
           WHERE ag.account_id = ?
           ORDER BY g.title`,
          [account.id]
        )
        account.games = games
      }

      return NextResponse.json({ success: true, data: accounts })
    } finally {
      conn.release()
    }
  } catch (err) {
    console.error('[GET /api/admin/accounts]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว' } },
      { status: 500 }
    )
  }
}

// POST /api/admin/accounts — create new account with games
const createSchema = z.object({
  account_number: z.string().min(1),
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

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  const parsed = createSchema.safeParse(body)
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

  const { account_number, status, rented_until, notes, game_ids, price_ps5_own, price_ps5_shop, price_ps4,
    status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, rented_until_ps5_shop, rented_until_ps4 } = parsed.data

  const conn = await pool.getConnection()
  
  try {
    await conn.beginTransaction()

    // Insert account
    const [result] = await conn.execute<any>(
      `INSERT INTO accounts (account_number, status, rented_until, notes, price_ps5_own, price_ps5_shop, price_ps4,
        status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, rented_until_ps5_shop, rented_until_ps4)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [account_number, status, rented_until ?? null, notes ?? null, 
       price_ps5_own ?? null, price_ps5_shop ?? null, price_ps4 ?? null,
       status_ps5_own ?? 'available', status_ps5_shop ?? 'available', status_ps4 ?? 'available',
       rented_until_ps5_own ?? null, rented_until_ps5_shop ?? null, rented_until_ps4 ?? null]
    )

    const accountId = result.insertId

    // Insert games
    if (game_ids && game_ids.length > 0) {
      const values = game_ids.map(gameId => [accountId, gameId])
      await conn.query(
        `INSERT INTO account_games (account_id, game_id) VALUES ?`,
        [values]
      )
    }

    await conn.commit()

    return NextResponse.json({ success: true, data: { id: accountId } }, { status: 201 })
  } catch (err: any) {
    await conn.rollback()
    
    if (err?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_ACCOUNT_NUMBER',
            message: 'หมายเลขไอดีนี้มีอยู่แล้ว',
          },
        },
        { status: 409 }
      )
    }

    console.error('[POST /api/admin/accounts]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว' } },
      { status: 500 }
    )
  } finally {
    conn.release()
  }
}
