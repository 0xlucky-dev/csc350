/**
 * FILE: apps/admin/src/app/dashboard/settings/page.tsx
 * PURPOSE: Admin Dashboard — System Settings management page
 *          List all settings with inline edit form and URL validation
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 13.4)
 *
 * DEPENDENCIES:
 *   - React (useState, useEffect)
 *   - fetch: calls /api/admin/settings (GET) and /api/admin/settings/[key] (PUT)
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/settings/route.ts: GET
 *   - apps/admin/src/app/api/admin/settings/[key]/route.ts: PUT
 *
 * Requirements: 11.1–11.7
 */

'use client'

import { useState, useEffect } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface SettingRow {
  id: number
  setting_key: string
  setting_value: string | null
  description: string | null
  data_type: 'string' | 'number' | 'boolean' | 'json'
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

// ── Setting Row Component ─────────────────────────────────────────────────────

interface SettingRowProps {
  setting: SettingRow
  onSaved: () => void
}

function SettingItem({ setting, onSaved }: SettingRowProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(setting.setting_value ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function handleCancel() {
    setValue(setting.setting_value ?? '')
    setError(null)
    setEditing(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/settings/${setting.setting_key}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ value: value || null }),
      })
      const json = await res.json()

      if (!res.ok) {
        const msg =
          json?.error?.fields?.value?.[0] ??
          json?.error?.message ??
          'เกิดข้อผิดพลาด'
        setError(msg)
        setSaving(false)
        return
      }

      setEditing(false)
      onSaved()
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setSaving(false)
    }
  }

  return (
    <div className="border-t border-border first:border-t-0">
      {editing ? (
        <form onSubmit={handleSave} className="px-4 py-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <p className="text-sm font-semibold text-text-primary">{setting.setting_key}</p>
              {setting.description && (
                <p className="text-xs text-text-secondary mt-0.5">{setting.description}</p>
              )}
            </div>
          </div>
          <input
            type="text"
            className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(null) }}
            placeholder="ว่างเปล่า = ล้างค่า"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg text-xs text-text-secondary border border-border hover:bg-card-bg transition-colors"
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
        <div className="px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">{setting.setting_key}</p>
            {setting.description && (
              <p className="text-xs text-text-secondary mt-0.5">{setting.description}</p>
            )}
            <p className="text-sm text-text-secondary mt-1 break-all">
              {setting.setting_value ? (
                <span className="text-text-primary">{setting.setting_value}</span>
              ) : (
                <span className="italic text-gray-500">ไม่ได้ตั้งค่า</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border text-accent-blue hover:bg-card-bg transition-colors"
          >
            แก้ไข
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchSettings() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/settings', { headers: authHeaders() })
      if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ')
      const json = await res.json()
      setSettings(json.data ?? [])
    } catch (err: any) {
      setError(err.message ?? 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSettings() }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">ตั้งค่าระบบ</h1>
        <p className="text-sm text-text-secondary mt-1">จัดการการตั้งค่าต่างๆ ของระบบ เช่น ลิงก์ติดต่อ</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchSettings} className="ml-4 underline text-xs">ลองใหม่</button>
        </div>
      )}

      {loading ? (
        <div className="text-center text-text-secondary py-12">กำลังโหลด...</div>
      ) : settings.length === 0 ? (
        <div className="text-center text-text-secondary py-12">ไม่มีการตั้งค่า</div>
      ) : (
        <div className="bg-card-bg border border-border rounded-xl overflow-hidden">
          {settings.map((s) => (
            <SettingItem key={s.id} setting={s} onSaved={fetchSettings} />
          ))}
        </div>
      )}
    </div>
  )
}
