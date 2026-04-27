/**
 * FILE: apps/admin/src/app/api/admin/games/search/route.ts
 * PURPOSE: Search games by title (autocomplete)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@ninja-shop/shared'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    
    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }
    
    const conn = await pool.getConnection()
    
    try {
      // Aggressive normalization: remove spaces, hyphens, colons, apostrophes, etc.
      // "spider-man" -> "spiderman", "grand theft auto" -> "grandtheftauto"
      const normalizedQuery = query.toLowerCase().replace(/[\s\-:''™®©]/g, '')
      
      // Split query into words for multi-word matching
      const words = query.trim().split(/\s+/).filter(w => w.length > 0)
      
      // Build LIKE conditions for word-by-word matching
      const likeConditions = words.map(() => 'LOWER(title) LIKE ?').join(' AND ')
      const likeParams = words.map(word => `%${word.toLowerCase()}%`)
      
      const [rows] = await conn.query(
        `SELECT id, title, image_url, genre 
         FROM games 
         WHERE ${likeConditions}
            OR LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(title, ' ', ''), '-', ''), ':', ''), '''', ''), '™', '')) LIKE ?
         ORDER BY 
           CASE 
             WHEN LOWER(title) LIKE ? THEN 1
             WHEN LOWER(title) LIKE ? THEN 2
             WHEN LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(title, ' ', ''), '-', ''), ':', ''), '''', ''), '™', '')) LIKE ? THEN 3
             ELSE 4
           END,
           title 
         LIMIT 20`,
        [...likeParams, `%${normalizedQuery}%`, `${query.toLowerCase()}%`, `%${query.toLowerCase()}%`, `%${normalizedQuery}%`]
      )
      
      return NextResponse.json({
        success: true,
        data: rows as any[]
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('[GET /api/admin/games/search]', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'เกิดข้อผิดพลาด'
        }
      },
      { status: 500 }
    )
  }
}
