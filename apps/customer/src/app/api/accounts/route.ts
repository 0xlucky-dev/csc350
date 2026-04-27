/**
 * FILE: apps/customer/src/app/api/accounts/route.ts
 * PURPOSE: GET /api/accounts — ดึง accounts ทั้งหมดพร้อม games
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 7.1)
 * REQUIREMENTS: 1.1, 13.1
 */

import { NextResponse } from 'next/server'
import pool from '@ninja-shop/shared/db'
import type { Account, Game, ApiSuccess, ApiError } from '@ninja-shop/shared'

export const runtime = 'nodejs'
export const revalidate = 0 // No cache

export async function GET(): Promise<NextResponse<ApiSuccess<Account[]> | ApiError>> {
  try {
    const [accountRows] = await pool.execute(
      `SELECT id, account_number, account_name, status, rented_until, notes, 
              price_ps5_own, price_ps5_shop, price_ps4,
              status_ps5_own, status_ps5_shop, status_ps4,
              rented_until_ps5_own, rented_until_ps5_shop, rented_until_ps4
       FROM accounts ORDER BY id`
    ) as [any[], any]

    const [gameRows] = await pool.execute(
      `SELECT ag.account_id, g.id, g.title, g.title_en, g.image_url, g.thumbnail_url, g.playstation_url, g.genre
       FROM account_games ag
       JOIN games g ON g.id = ag.game_id
       ORDER BY ag.account_id, ag.added_at`
    ) as [any[], any]

    // Group games by account_id
    const gamesByAccount = new Map<number, Game[]>()
    for (const row of gameRows) {
      const game: Game = {
        id: row.id,
        title: row.title,
        title_en: row.title_en,
        image_url: row.image_url,
        thumbnail_url: row.thumbnail_url,
        playstation_url: row.playstation_url,
        genre: row.genre,
      }
      if (!gamesByAccount.has(row.account_id)) {
        gamesByAccount.set(row.account_id, [])
      }
      gamesByAccount.get(row.account_id)!.push(game)
    }

    const accounts: Account[] = accountRows.map((row) => ({
      id: row.id,
      account_number: row.account_number,
      account_name: row.account_name,
      status: row.status,
      rented_until: row.rented_until
        ? new Date(row.rented_until).toISOString().split('T')[0]
        : null,
      notes: row.notes,
      price_ps5_own: row.price_ps5_own,
      price_ps5_shop: row.price_ps5_shop,
      price_ps4: row.price_ps4,
      status_ps5_own: row.status_ps5_own || 'available',
      status_ps5_shop: row.status_ps5_shop || 'available',
      status_ps4: row.status_ps4 || 'available',
      rented_until_ps5_own: row.rented_until_ps5_own,
      rented_until_ps5_shop: row.rented_until_ps5_shop,
      rented_until_ps4: row.rented_until_ps4,
      games: gamesByAccount.get(row.id) ?? [],
    }))

    return NextResponse.json({ success: true, data: accounts })
  } catch (error) {
    console.error('[GET /api/accounts]', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch accounts' } },
      { status: 500 }
    )
  }
}
