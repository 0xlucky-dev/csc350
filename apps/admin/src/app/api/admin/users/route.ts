/**
 * FILE: apps/admin/src/app/api/admin/users/route.ts
 * PURPOSE: GET all admin users, POST create new user (super_admin only)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

import { NextRequest, NextResponse } from 'next/server'
import pool from '@ninja-shop/shared/db'
import { verifyToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

// GET /api/admin/users — list all users (super_admin only)
export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value ?? ''
  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const [rows] = await pool.query(
    'SELECT id, username, role, created_at FROM admin_users ORDER BY id ASC'
  ) as any[]

  return NextResponse.json({ success: true, data: rows })
}

// POST /api/admin/users — create user (super_admin only)
export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value ?? ''
  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const { username, password, role } = await request.json()
  if (!username || !password) {
    return NextResponse.json({ success: false, error: 'กรุณากรอก username และ password' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 10)
  const [result] = await pool.query(
    'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)',
    [username, hash, role ?? 'user']
  ) as any[]

  return NextResponse.json({ success: true, data: { id: result.insertId, username, role: role ?? 'user' } })
}
