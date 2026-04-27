/**
 * FILE: apps/admin/src/app/dashboard/prices/page.tsx
 * PURPOSE: Admin Dashboard — Rental Prices management page
 *          Inline edit cards for each rental type (ps5_own, ps5_shop, ps4)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 13.3)
 *
 * DEPENDENCIES:
 *   - React (useState, useEffect)
 *   - fetch: calls /api/admin/prices (GET) and /api/admin/prices/[id] (PUT)
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/prices/route.ts: GET
 *   - apps/admin/src/app/api/admin/prices/[id]/route.ts: PUT
 *
 * Requirements: 10.1–10.6
 */

'use client'

import { useState, useEffect } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface PriceRow {
  id: number
  rental_type: 'ps5_own' | 'ps5_shop' | 'ps4'
  price: number
  duration_days: number
  description: string | null
  is_active: boolean
}

interface EditState {
  price: string
  duration_days: string
  description: string
  is_active: boolean
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RENTAL_TYPE_LABELS: Record<string, string> = {
  ps5_own: 'PS5 (เครื่องตัวเอง)',
  ps5_shop: 'PS5 (เครื่องร้าน)',
  ps4: 'PS4',
}

// ── Cookie helper ─────────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

function authHeaders(): HeadersInit {
  const token = getCookie('admin_token')
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }
}

// ── Price Card ────────────────────────────────────────────────────────────────

interface PriceCardProps {
  row: PriceRow
  onSaved: () => void
}

function PriceCard({ row, onSaved }: PriceCardProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<EditState>({
    price: String(row.price),
    duration_days: String(row.duration_days),
    description: row.description ?? '',
    is_active: row.is_active,
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  function set(field: keyof EditState, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => { const n = { ...e }; delete n[field]; return n })
    setSaveError(null)
  }

  function handleCancel() {
    setForm({
      price: String(row.price),
      duration_days: String(row.duration_days),
      description: row.description ?? '',
      is_active: row.is_active,
    })
    setErrors({})
    setSaveError(null)
    setEditing(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setSaveError(null)

    const payload = {
      price: Number(form.price),
      duration_days: Number(form.duration_days),
      description: form.description || undefined,
      is_active: form.is_active,
    }

    try {
      const res = await fetch(`/api/admin/prices/${row.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!res.ok) {
        if (json?.error?.fields) setErrors(json.error.fields)
        else setSaveError(json?.error?.message ?? 'เกิดข้อผิดพลาด')
        setSaving(false)
        return
      }

      setEditing(false)
      onSaved()
    } catch {
      setSaveError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setSaving(false)
    }
  }

  return (
    <div className="bg-card-bg border border-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-text-primary">
            {RENTAL_TYPE_LABELS[row.rental_type] ?? row.rental_type}
          </h2>
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
              row.is_active
                ? 'bg-green-900/60 text-green-300'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {row.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
          </span>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border text-accent-blue hover:bg-secondary-bg transition-colors"
          >
            แก้ไข
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          {/* Price */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">ราคา (บาท) *</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="w-full bg-secondary-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              required
            />
            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price[0]}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">จำนวนวัน *</label>
            <input
              type="number"
              min="1"
              step="1"
              className="w-full bg-secondary-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
              value={form.duration_days}
              onChange={(e) => set('duration_days', e.target.value)}
              required
            />
            {errors.duration_days && <p className="text-red-400 text-xs mt-1">{errors.duration_days[0]}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">คำอธิบาย</label>
            <textarea
              rows={2}
              className="w-full bg-secondary-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue resize-none"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* is_active toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => set('is_active', !form.is_active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                form.is_active ? 'bg-accent-blue' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.is_active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-text-secondary">
              {form.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
            </span>
          </div>

          {saveError && <p className="text-red-400 text-xs">{saveError}</p>}

          <div className="flex gap-2 justify-end mt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg text-xs text-text-secondary border border-border hover:bg-secondary-bg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent-blue text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">ราคา</span>
            <span className="text-text-primary font-semibold">฿{row.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">จำนวนวัน</span>
            <span className="text-text-primary">{row.duration_days} วัน</span>
          </div>
          {row.description && (
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary shrink-0">คำอธิบาย</span>
              <span className="text-text-primary text-right">{row.description}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PricesPage() {
  const [prices, setPrices] = useState<PriceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchPrices() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/prices', { headers: authHeaders() })
      if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ')
      const json = await res.json()
      setPrices(json.data ?? [])
    } catch (err: any) {
      setError(err.message ?? 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPrices() }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">จัดการราคาเช่า</h1>
        <p className="text-sm text-text-secondary mt-1">ตั้งค่าราคาและรายละเอียดสำหรับแต่ละประเภทการเช่า</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchPrices} className="ml-4 underline text-xs">ลองใหม่</button>
        </div>
      )}

      {loading ? (
        <div className="text-center text-text-secondary py-12">กำลังโหลด...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prices.map((row) => (
            <PriceCard key={row.id} row={row} onSaved={fetchPrices} />
          ))}
        </div>
      )}
    </div>
  )
}
