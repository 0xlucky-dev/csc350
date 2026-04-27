/**
 * FILE: apps/admin/src/app/api/admin/games/route.ts
 * PURPOSE: GET /api/admin/games — list all games
 *          POST /api/admin/games — create new game (with duplicate check)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 12.1, 12.3)
 *
 * DEPENDENCIES:
 *   - @ninja-shop/shared: pool (mysql2)
 *
 * RELATED FILES:
 *   - apps/admin/src/middleware.ts: JWT auth
 *   - apps/admin/src/app/api/admin/games/[id]/route.ts: DELETE
 *   - apps/admin/src/app/api/admin/games/scrape/route.ts: PS Store scraper
 *
 * Requirements: 8.1–8.9, 9.1–9.7
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

// GET /api/admin/games — fetch all games
export async function GET() {
  try {
    const [rows] = await pool.execute<any[]>(
      `SELECT id, title, title_en, image_url, thumbnail_url, playstation_url, genre
       FROM games
       ORDER BY id`
    )
    return NextResponse.json({ success: true, data: rows })
  } catch (err) {
    console.error('[GET /api/admin/games]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}

// POST /api/admin/games — create new game
export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body ไม่ถูกต้อง' } },
      { status: 400 }
    )
  }

  const { title, title_en, image_url, thumbnail_url, playstation_url, genre } = body ?? {}

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ข้อมูลไม่ถูกต้อง',
          fields: { title: ['กรุณากรอกชื่อเกม'] },
        },
      },
      { status: 400 }
    )
  }

  try {
    // Check duplicate
    const [existing] = await pool.execute<any[]>(
      'SELECT id FROM games WHERE title = ? LIMIT 1',
      [title.trim()]
    )
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_GAME',
            message: 'เกมนี้มีอยู่ในระบบแล้ว',
            fields: { title: ['เกมนี้มีอยู่ในระบบแล้ว'] },
          },
        },
        { status: 409 }
      )
    }

    const [result] = await pool.execute<any>(
      `INSERT INTO games (title, title_en, image_url, thumbnail_url, playstation_url, genre)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        title_en ?? null,
        image_url ?? null,
        thumbnail_url ?? null,
        playstation_url ?? null,
        genre ?? null,
      ]
    )

    return NextResponse.json({ success: true, data: { id: result.insertId } }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/games]', err)
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่' } },
      { status: 500 }
    )
  }
}
