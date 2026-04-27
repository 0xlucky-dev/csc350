/**
 * FILE: apps/admin/src/app/dashboard/games/page.tsx
 * PURPOSE: Admin Dashboard — Game Management page
 *          Game Library table + Manual Add form + PS Store search (mock → manual fallback)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 12.8)
 *
 * DEPENDENCIES:
 *   - React (useState, useEffect)
 *   - fetch: /api/admin/games (GET, POST, DELETE)
 *            /api/admin/games/scrape (POST)
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/games/route.ts: GET + POST
 *   - apps/admin/src/app/api/admin/games/[id]/route.ts: DELETE
 *   - apps/admin/src/app/api/admin/games/scrape/route.ts: scrape
 *
 * Requirements: 8.1–8.9, 9.1–9.7
 */

'use client'

import { useState, useEffect } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface GameRow {
  id: number
  title: string
  title_en: string | null
  image_url: string | null
  thumbnail_url: string | null
  playstation_url: string | null
  genre: string | null
}

interface GameFormState {
  title: string
  title_en: string
  image_url: string
  thumbnail_url: string
  playstation_url: string
  genre: string
}

const EMPTY_FORM: GameFormState = {
  title: '',
  title_en: '',
  image_url: '',
  thumbnail_url: '',
  playstation_url: '',
  genre: '',
}

// ── Cookie / auth helpers ─────────────────────────────────────────────────────

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

// ── Delete Confirmation Dialog ────────────────────────────────────────────────

interface DeleteDialogProps {
  game: GameRow
  onClose: () => void
  onDeleted: () => void
}

function DeleteDialog({ game, onClose, onDeleted }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/games/${game.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json?.error?.message ?? 'เกิดข้อผิดพลาด')
        setDeleting(false)
        return
      }
      onDeleted()
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-secondary-bg border border-border rounded-xl w-full max-w-sm p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-text-primary mb-2">ยืนยันการลบ</h2>
        <p className="text-text-secondary text-sm mb-4">
          ต้องการลบเกม{' '}
          <span className="text-text-primary font-semibold">{game.title}</span> ใช่หรือไม่?
          การลบจะลบเกมออกจากไอดีทั้งหมดด้วย
        </p>
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-text-secondary border border-border hover:bg-card-bg transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? 'กำลังลบ...' : 'ลบ'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Add Game Form ─────────────────────────────────────────────────────────────

interface AddGameFormProps {
  onSaved: () => void
}

function AddGameForm({ onSaved }: AddGameFormProps) {
  const [form, setForm] = useState<GameFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  function set(field: keyof GameFormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setSuccessMsg(null)

    const payload = {
      title: form.title.trim(),
      title_en: form.title_en.trim() || undefined,
      image_url: form.image_url.trim() || undefined,
      thumbnail_url: form.thumbnail_url.trim() || undefined,
      playstation_url: form.playstation_url.trim() || undefined,
      genre: form.genre.trim() || undefined,
    }

    try {
      const res = await fetch('/api/admin/games', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!res.ok) {
        if (json?.error?.fields) setErrors(json.error.fields)
        else setErrors({ _: [json?.error?.message ?? 'เกิดข้อผิดพลาด'] })
        setSaving(false)
        return
      }

      setForm(EMPTY_FORM)
      setSuccessMsg('เพิ่มเกมสำเร็จ')
      onSaved()
    } catch {
      setErrors({ _: ['เกิดข้อผิดพลาด กรุณาลองใหม่'] })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-secondary-bg border border-border rounded-xl p-6">
      <h2 className="text-base font-bold text-text-primary mb-4">เพิ่มเกม</h2>

      {/* Manual entry form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm text-text-secondary mb-1">ชื่อเกม *</label>
          <input
            className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
            placeholder="เช่น Grand Theft Auto V"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title[0]}</p>}
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">แนวเกม (Genre)</label>
          <input
            className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
            placeholder="เช่น Action, RPG, Sports"
            value={form.genre}
            onChange={(e) => set('genre', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">URL รูปภาพ</label>
          <input
            className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
            placeholder="https://..."
            value={form.image_url}
            onChange={(e) => set('image_url', e.target.value)}
          />
        </div>

        {errors._ && <p className="text-red-400 text-xs">{errors._[0]}</p>}
        {successMsg && <p className="text-green-400 text-xs">{successMsg}</p>}

        <div className="flex justify-end mt-1">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-accent-blue text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'กำลังบันทึก...' : 'เพิ่มเกม'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function GamesPage() {
  const [games, setGames] = useState<GameRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteGame, setDeleteGame] = useState<GameRow | null>(null)

  async function fetchGames() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/games', { headers: authHeaders() })
      if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ')
      const json = await res.json()
      setGames(json.data ?? [])
    } catch (err: any) {
      setError(err.message ?? 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGames() }, [])

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <h1 className="text-xl font-bold text-text-primary">จัดการเกม</h1>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchGames} className="ml-4 underline text-xs">ลองใหม่</button>
        </div>
      )}

      {/* Add Game - MOVED TO TOP */}
      <AddGameForm onSaved={fetchGames} />

      {/* Game Library */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-3">คลังเกมทั้งหมด ({games.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-secondary-bg text-text-secondary text-left">
                <th className="px-4 py-3 font-medium whitespace-nowrap">ID</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">ชื่อเกม</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">แนวเกม</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-text-secondary">
                    กำลังโหลด...
                  </td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-text-secondary">
                    ยังไม่มีเกม
                  </td>
                </tr>
              ) : (
                games.map((g) => (
                  <tr key={g.id} className="border-t border-border hover:bg-card-bg/50 transition-colors">
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{g.id}</td>
                    <td className="px-4 py-3 text-text-primary font-medium">
                      <div className="flex items-center gap-2">
                        {g.thumbnail_url || g.image_url ? (
                          <img
                            src={g.thumbnail_url ?? g.image_url ?? ''}
                            alt={g.title}
                            className="w-8 h-8 rounded object-cover flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        ) : null}
                        <span>{g.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {g.genre ?? '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setDeleteGame(g)}
                        className="px-2 py-1 rounded text-xs border border-red-800 text-red-400 hover:bg-red-900/30 transition-colors"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Dialog */}
      {deleteGame && (
        <DeleteDialog
          game={deleteGame}
          onClose={() => setDeleteGame(null)}
          onDeleted={() => { setDeleteGame(null); fetchGames() }}
        />
      )}
    </div>
  )
}
