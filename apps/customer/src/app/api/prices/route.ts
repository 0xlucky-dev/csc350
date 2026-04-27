/**
 * FILE: apps/customer/src/app/api/prices/route.ts
 * PURPOSE: GET /api/prices — ดึงเฉพาะ is_active = 1 rental prices
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 7.3)
 * REQUIREMENTS: 10.7
 */

import { NextResponse } from 'next/server'
import pool from '@ninja-shop/shared/db'
import type { RentalPrice, ApiSuccess, ApiError } from '@ninja-shop/shared'

export const runtime = 'nodejs'

export async function GET(): Promise<NextResponse<ApiSuccess<RentalPrice[]> | ApiError>> {
  try {
    const [rows] = await pool.execute(
      'SELECT id, rental_type, price, duration_days, description, is_active FROM rental_prices WHERE is_active = 1 ORDER BY id'
    ) as [any[], any]

    const prices: RentalPrice[] = rows.map((row) => ({
      id: row.id,
      rental_type: row.rental_type,
      price: Number(row.price),
      duration_days: row.duration_days,
      description: row.description,
      is_active: Boolean(row.is_active),
    }))

    return NextResponse.json({ success: true, data: prices })
  } catch (error) {
    console.error('[GET /api/prices]', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch prices' } },
      { status: 500 }
    )
  }
}
