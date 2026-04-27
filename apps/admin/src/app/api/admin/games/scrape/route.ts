/**
 * FILE: apps/admin/src/app/api/admin/games/scrape/route.ts
 * PURPOSE: POST /api/admin/games/scrape — attempt to scrape PS Store, return empty with message
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 12.2)
 *
 * NOTE: PlayStation Store is JavaScript-rendered; simple HTML fetch won't return useful data.
 *       This route returns empty results and instructs admin to use manual entry instead.
 *
 * DEPENDENCIES:
 *   - Next.js server runtime
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/games/route.ts: POST to save game
 *   - apps/admin/src/app/dashboard/games/page.tsx: UI that calls this route
 *
 * Requirements: 8.1–8.9, 15.4
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface ScrapedGame {
  title: string
  image_url: string
  playstation_url: string
}

// POST /api/admin/games/scrape — search PS Store (returns empty; use manual entry)
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

  const { query } = body ?? {}
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'กรุณาระบุคำค้นหา' } },
      { status: 400 }
    )
  }

  // PlayStation Store is JavaScript-rendered — simple fetch returns no useful game data.
  // Return empty results and guide admin to use manual entry form.
  const data: ScrapedGame[] = []

  return NextResponse.json({
    success: true,
    data,
    message: 'กรุณาเพิ่มเกมด้วยตนเอง',
  })
}
