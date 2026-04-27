/**
 * FILE: apps/customer/src/app/api/settings/contact/route.ts
 * PURPOSE: GET /api/settings/contact — ดึง contact_url จาก settings table
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * REQUIREMENTS: 3.3, 11.6
 */

import { NextResponse } from 'next/server'
import pool from '@ninja-shop/shared/db'
import type { ContactSettings, ApiSuccess, ApiError } from '@ninja-shop/shared'

export const runtime = 'nodejs'

export async function GET(): Promise<NextResponse<ApiSuccess<ContactSettings> | ApiError>> {
  try {
    const [rows] = await pool.execute(
      "SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('contact_url', 'line_url', 'facebook_url')"
    ) as [any[], any]

    const map: Record<string, string | null> = {}
    for (const row of rows) {
      map[row.setting_key] = row.setting_value ?? null
    }

    const contactSettings: ContactSettings = {
      contact_url: map['contact_url'] ?? null,
      line_url: map['line_url'] ?? null,
      facebook_url: map['facebook_url'] ?? null,
    }

    return NextResponse.json({ success: true, data: contactSettings })
  } catch (error) {
    console.error('[GET /api/settings/contact]', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch contact settings' } },
      { status: 500 }
    )
  }
}
