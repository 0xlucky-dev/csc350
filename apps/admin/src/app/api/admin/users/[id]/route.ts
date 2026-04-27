/**
 * FILE: apps/admin/src/app/api/admin/users/[id]/route.ts
 * PURPOSE: PUT update password/role, DELETE user
 *   - super_admin: แก้ไขได้ทุก user, ลบได้ทุก user (ยกเว้นตัวเอง)
 *   - user: แก้ไขได้แค่ password ของตัวเอง
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

import { NextRequest, NextResponse } from 'next/server'
import pool from '@ninja-shop/shared/db'
import { verifyToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

// PUT /api/admin/users/[id] — update password or role
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get('admin_token')?.value ?? ''
  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const targetId = Number(params.id)
  const isSelf = payload.sub === targetId
  const isSuperAdmin = payload.role === 'super_admin'

  // user role แก้ได้แค่ตัวเอง
  if (!isSuperAdmin && !isSelf) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const updates: string[] = []
  const values: any[] = []

  // เปลี่ยน password
  if (body.password) {
    const hash = await bcrypt.hash(body.password, 10)
    updates.push('password_hash = ?')
    values.push(hash)
  }

  // เปลี่ยน role (super_admin เท่านั้น)
  if (body.role && isSuperAdmin) {
    updates.push('role = ?')
    values.push(body.role)
  }

  if (updates.length === 0) {
    return NextResponse.json({ success: false, error: 'ไม่มีข้อมูลที่ต้องอัพเดท' }, { status: 400 })
  }

  values.push(targetId)
  await pool.query(`UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`, values)

  return NextResponse.json({ success: true })
}

// DELETE /api/admin/users/[id] — delete user (super_admin only, ลบตัวเองไม่ได้)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get('admin_token')?.value ?? ''
  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const targetId = Number(params.id)
  if (payload.sub === targetId) {
    return NextResponse.json({ success: false, error: 'ไม่สามารถลบบัญชีตัวเองได้' }, { status: 400 })
  }

  await pool.query('DELETE FROM admin_users WHERE id = ?', [targetId])
  return NextResponse.json({ success: true })
}
