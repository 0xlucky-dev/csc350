/**
 * FILE: apps/admin/src/app/dashboard/accounts/page.tsx
 * PURPOSE: Admin Dashboard — Simplified Account Management with game autocomplete
 *          - Auto-increment account numbers (1, 2, 3...)
 *          - No account_name, no renter_contact fields
 *          - Game search with autocomplete
 *          - Selected games shown as tags with X button
 *          - Game collage image (up to 4 games)
 *          - All images same size with object-cover
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md
 *
 * DEPENDENCIES:
 *   - React (useState, useEffect)
 *   - Next.js Image component
 *   - /api/admin/accounts (GET, POST, PUT, DELETE)
 *   - /api/admin/games/search (GET)
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/accounts/route.ts
 *   - apps/admin/src/app/api/admin/accounts/[id]/route.ts
 *   - apps/admin/src/app/api/admin/games/search/route.ts
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// ── Types ────────────────────────────────────────────────────────────────────

interface Game {
  id: number
  title: string
  image_url: string
  genre: string
}

interface AccountRow {
  id: number
  account_number: string
  status: 'available' | 'rented'
  rented_until: string | null
  notes: string | null
  game_count: number
  games: Game[]
  price_ps5_own: number | null
  price_ps5_shop: number | null
  price_ps4: number | null
  status_ps5_own: 'available' | 'rented'
  status_ps5_shop: 'available' | 'rented'
  status_ps4: 'available' | 'rented'
  rented_until_ps5_own: string | null
  rented_until_ps5_shop: string | null
  rented_until_ps4: string | null
}

interface AccountFormState {
  status: 'available' | 'rented'
  rented_until: string
  rented_time: string
  notes: string
  selectedGames: Game[]
  price_ps5_own: string
  price_ps5_shop: string
  price_ps4: string
  status_ps5_own: 'available' | 'rented'
  status_ps5_shop: 'available' | 'rented'
  status_ps4: 'available' | 'rented'
  rented_until_ps5_own: string
  rented_time_ps5_own: string
  rented_until_ps5_shop: string
  rented_time_ps5_shop: string
  rented_until_ps4: string
  rented_time_ps4: string
}

const EMPTY_FORM: AccountFormState = {
  status: 'available',
  rented_until: '',
  rented_time: '',
  notes: '',
  selectedGames: [],
  price_ps5_own: '',
  price_ps5_shop: '',
  price_ps4: '',
  status_ps5_own: 'available',
  status_ps5_shop: 'available',
  status_ps4: 'available',
  rented_until_ps5_own: '',
  rented_time_ps5_own: '',
  rented_until_ps5_shop: '',
  rented_time_ps5_shop: '',
  rented_until_ps4: '',
  rented_time_ps4: '',
}

// ── Cookie helper ─────────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

function authHeaders(): HeadersInit {
  const token = getCookie('admin_token')
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

// ── Game Search Autocomplete ──────────────────────────────────────────────────

interface GameSearchProps {
  onSelect: (game: Game) => void
  selectedIds: number[]
}

function GameSearch({ onSelect, selectedIds }: GameSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/games/search?q=${encodeURIComponent(query)}`, {
          headers: authHeaders()
        })
        const json = await res.json()
        setResults(json.data || [])
        setShowResults(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const filteredResults = results.filter(g => !selectedIds.includes(g.id))

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="พิมพ์ชื่อเกมเพื่อค้นหา..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
      />
      
      {showResults && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-card-bg border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-text-secondary text-sm">กำลังค้นหา...</div>
          ) : filteredResults.length === 0 ? (
            <div className="px-3 py-2 text-text-secondary text-sm">ไม่พบเกม</div>
          ) : (
            filteredResults.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => {
                  onSelect(game)
                  setQuery('')
                  setResults([])
                }}
                className="w-full px-3 py-2 text-left hover:bg-secondary-bg transition-colors flex items-center gap-2"
              >
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={game.image_url}
                    alt={game.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary text-sm truncate">{game.title}</div>
                  <div className="text-text-secondary text-xs">{game.genre}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ── Game Tags Display ─────────────────────────────────────────────────────────

interface GameTagsProps {
  games: Game[]
  onRemove: (gameId: number) => void
}

function GameTags({ games, onRemove }: GameTagsProps) {
  if (games.length === 0) {
    return (
      <div className="text-text-secondary text-sm italic">ยังไม่ได้เลือกเกม</div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {games.map((game) => (
        <div
          key={game.id}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue/20 border border-accent-blue/30 rounded-full text-sm"
        >
          <span className="text-text-primary">{game.title}</span>
          <button
            type="button"
            onClick={() => onRemove(game.id)}
            className="text-text-secondary hover:text-red-400 transition-colors font-bold text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Game Collage Image ────────────────────────────────────────────────────────

interface GameCollageProps {
  games: Game[]
}

function GameCollage({ games }: GameCollageProps) {
  if (games.length === 0) {
    return (
      <div className="w-full aspect-square bg-card-bg flex items-center justify-center">
        <span className="text-text-secondary text-sm">ไม่มีเกม</span>
      </div>
    )
  }

  // Determine grid layout and aspect ratio based on number of games
  let gridClass = ''
  let aspectClass = ''
  let displayGames = games

  if (games.length === 1) {
    // 1 game: 1x1 grid, portrait aspect (game cover ratio)
    gridClass = 'grid-cols-1 grid-rows-1'
    aspectClass = 'aspect-[3/4]'
    displayGames = games.slice(0, 1)
  } else if (games.length === 2) {
    // 2 games: 2x1 grid, landscape
    gridClass = 'grid-cols-2 grid-rows-1'
    aspectClass = 'aspect-[3/2]'
    displayGames = games.slice(0, 2)
  } else if (games.length === 3) {
    // 3 games: 3x1 grid
    gridClass = 'grid-cols-3 grid-rows-1'
    aspectClass = 'aspect-[9/4]'
    displayGames = games.slice(0, 3)
  } else if (games.length <= 4) {
    // 4 games: 2x2 grid, square aspect
    gridClass = 'grid-cols-2 grid-rows-2'
    aspectClass = 'aspect-square'
    displayGames = games.slice(0, 4)
  } else if (games.length <= 6) {
    gridClass = 'grid-cols-3 grid-rows-2'
    aspectClass = 'aspect-[3/2]'
    displayGames = games.slice(0, 6)
  } else if (games.length <= 9) {
    gridClass = 'grid-cols-3 grid-rows-3'
    aspectClass = 'aspect-square'
    displayGames = games.slice(0, 9)
  } else if (games.length <= 12) {
    gridClass = 'grid-cols-4 grid-rows-3'
    aspectClass = 'aspect-[4/3]'
    displayGames = games.slice(0, 12)
  } else if (games.length <= 16) {
    gridClass = 'grid-cols-4 grid-rows-4'
    aspectClass = 'aspect-square'
    displayGames = games.slice(0, 16)
  } else if (games.length <= 20) {
    gridClass = 'grid-cols-5 grid-rows-4'
    aspectClass = 'aspect-[5/4]'
    displayGames = games.slice(0, 20)
  } else {
    gridClass = 'grid-cols-6 grid-rows-4'
    aspectClass = 'aspect-[3/2]'
    displayGames = games.slice(0, 24)
  }

  return (
    <div className={`grid ${gridClass} gap-0 w-full ${aspectClass} bg-card-bg overflow-hidden`}>
      {displayGames.map((game) => (
        <div key={game.id} className="relative w-full h-full">
          <Image
            src={game.image_url}
            alt={game.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'available' | 'rented' }) {
  return status === 'available' ? (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-900/60 text-green-300">
      ว่าง
    </span>
  ) : (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-red-900/60 text-red-300">
      เช่าแล้ว
    </span>
  )
}

// ── Account Form Modal ────────────────────────────────────────────────────────

interface AccountModalProps {
  initial: AccountFormState | null // null = add mode
  onClose: () => void
  onSaved: () => void
  editId?: number
  nextAccountNumber?: number
}

function AccountModal({ initial, onClose, onSaved, editId, nextAccountNumber }: AccountModalProps) {
  const [form, setForm] = useState<AccountFormState>(initial ?? EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [saving, setSaving] = useState(false)

  function handleGameSelect(game: Game) {
    if (!form.selectedGames.find(g => g.id === game.id)) {
      setForm(f => ({ ...f, selectedGames: [...f.selectedGames, game] }))
    }
  }

  function handleGameRemove(gameId: number) {
    setForm(f => ({ ...f, selectedGames: f.selectedGames.filter(g => g.id !== gameId) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    // Helper function to combine date and time
    const combineDatetime = (date: string, time: string) => {
      if (!date) return null
      const t = time || '23:59:59'
      return `${date} ${t}`
    }

    const payload = {
      account_number: editId ? undefined : String(nextAccountNumber),
      status: form.status,
      rented_until: combineDatetime(form.rented_until, form.rented_time),
      notes: form.notes || undefined,
      game_ids: form.selectedGames.map(g => g.id),
      price_ps5_own: form.price_ps5_own ? parseFloat(form.price_ps5_own) : null,
      price_ps5_shop: form.price_ps5_shop ? parseFloat(form.price_ps5_shop) : null,
      price_ps4: form.price_ps4 ? parseFloat(form.price_ps4) : null,
      status_ps5_own: form.status_ps5_own,
      status_ps5_shop: form.status_ps5_shop,
      status_ps4: form.status_ps4,
      rented_until_ps5_own: combineDatetime(form.rented_until_ps5_own, form.rented_time_ps5_own),
      rented_until_ps5_shop: combineDatetime(form.rented_until_ps5_shop, form.rented_time_ps5_shop),
      rented_until_ps4: combineDatetime(form.rented_until_ps4, form.rented_time_ps4),
    }

    const url = editId ? `/api/admin/accounts/${editId}` : '/api/admin/accounts'
    const method = editId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) })
      const json = await res.json()

      if (!res.ok) {
        if (json?.error?.fields) setErrors(json.error.fields)
        else setErrors({ _: [json?.error?.message ?? 'เกิดข้อผิดพลาด'] })
        setSaving(false)
        return
      }

      onSaved()
    } catch {
      setErrors({ _: ['เกิดข้อผิดพลาด กรุณาลองใหม่'] })
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 overflow-y-auto py-8">
      <div className="bg-secondary-bg border border-border rounded-xl w-full max-w-2xl p-6 shadow-2xl my-auto">
        <h2 className="text-lg font-bold text-text-primary mb-4">
          {editId ? 'แก้ไขไอดี' : `เพิ่มไอดีใหม่ (No.${nextAccountNumber})`}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Price Fields */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">PS5 ไอดีตัวเอง (30 วัน)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
                value={form.price_ps5_own}
                onChange={(e) => setForm(f => ({ ...f, price_ps5_own: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">PS5 ไอดีร้าน (30 วัน)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
                value={form.price_ps5_shop}
                onChange={(e) => setForm(f => ({ ...f, price_ps5_shop: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">PS4 (30 วัน)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
                value={form.price_ps4}
                onChange={(e) => setForm(f => ({ ...f, price_ps4: e.target.value }))}
              />
            </div>
          </div>

          {/* Game Search */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">เพิ่มเกม</label>
            <GameSearch 
              onSelect={handleGameSelect} 
              selectedIds={form.selectedGames.map(g => g.id)} 
            />
          </div>

          {/* Selected Games Tags */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">เกมที่เลือก ({form.selectedGames.length})</label>
            <GameTags games={form.selectedGames} onRemove={handleGameRemove} />
          </div>

          {/* Game Collage Preview */}
          {form.selectedGames.length > 0 && (
            <div>
              <label className="block text-sm text-text-secondary mb-2">ตัวอย่างรูปไอดี</label>
              <div className="max-w-sm mx-auto">
                <GameCollage games={form.selectedGames} />
              </div>
            </div>
          )}

          {/* Rental Status for each type */}
          <div className="border border-border rounded-lg p-3 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">สถานะการเช่า (แยกตามแบบ)</h3>
            
            {/* PS5 Own */}
            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-3 text-xs text-accent-blue font-semibold">PS5 ไอดีตัวเอง</div>
              <select
                className="w-full bg-card-bg border border-border rounded px-2 py-1 text-xs"
                value={form.status_ps5_own}
                onChange={(e) => setForm(f => ({ ...f, status_ps5_own: e.target.value as 'available' | 'rented' }))}
              >
                <option value="available">ว่าง</option>
                <option value="rented">เช่าแล้ว</option>
              </select>
              {form.status_ps5_own === 'rented' && (
                <>
                  <input 
                    type="date" 
                    lang="th" 
                    className="w-full bg-card-bg border border-border rounded px-2 py-1 text-xs" 
                    style={{ colorScheme: 'dark' }}
                    value={form.rented_until_ps5_own} 
                    onChange={(e) => setForm(f => ({ ...f, rented_until_ps5_own: e.target.value }))} 
                  />
                  <input 
                    type="time" 
                    className="w-full bg-card-bg border border-border rounded px-2 py-1 text-xs [&::-webkit-calendar-picker-indicator]:dark:invert" 
                    style={{ colorScheme: 'dark' }}
                    value={form.rented_time_ps5_own} 
                    onChange={(e) => setForm(f => ({ ...f, rented_time_ps5_own: e.target.value }))} 
                  />
                </>
              )}
            </div>

            {/* PS5 Shop */}
            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-3 text-xs text-accent-blue font-semibold">PS5 ไอดีร้าน</div>
              <select
                className="w-full bg-card-bg border border-border rounded px-2 py-1 text-xs"
                value={form.status_ps5_shop}
                onChange={(e) => setForm(f => ({ ...f, status_ps5_shop: e.target.value as 'available' | 'rented' }))}
              >
                <option value="available">ว่าง</option>
                <option value="rented">เช่าแล้ว</option>
              </select>
              {form.status_ps5_shop === 'rented' && (
                <>
                  <input 
                    type="date" 
                    lang="th" 
                    className="w-full bg-card-bg border border-border rounded px-2 py-1 text-xs" 
                    style={{ colorScheme: 'dark' }}
                    value={form.rented_until_ps5_shop} 
                    onChange={(e) => setForm(f => ({ ...f, rented_until_ps5_shop: e.target.value }))} 
                  />
                  <input 
                    type="time" 
                    className="w-full bg-card-bg border border-border rounded px-2 py-1 text-xs [&::-webkit-calendar-picker-indicator]:dark:invert" 
                    style={{ colorScheme: 'dark' }}
                    value={form.rented_time_ps5_shop} 
                    onChange={(e) => setForm(f => ({ ...f, rented_time_ps5_shop: e.target.value }))} 
                  />
                </>
              )}
            </div>

            {/* PS4 */}
            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-3 text-xs text-accent-blue font-semibold">PS4</div>
              <select
                className="w-full bg-card-bg border border-border rounded px-2 py-1 text-xs"
                value={form.status_ps4}
                onChange={(e) => setForm(f => ({ ...f, status_ps4: e.target.value as 'available' | 'rented' }))}
              >
                <option value="available">ว่าง</option>
                <option value="rented">เช่าแล้ว</option>
              </select>
              {form.status_ps4 === 'rented' && (
                <>
                  <input 
                    type="date" 
                    lang="th" 
                    className="w-full bg-card-bg border border-border rounded px-2 py-1 text-xs" 
                    style={{ colorScheme: 'dark' }}
                    value={form.rented_until_ps4} 
                    onChange={(e) => setForm(f => ({ ...f, rented_until_ps4: e.target.value }))} 
                  />
                  <input 
                    type="time" 
                    className="w-full bg-card-bg border border-border rounded px-2 py-1 text-xs [&::-webkit-calendar-picker-indicator]:dark:invert" 
                    style={{ colorScheme: 'dark' }}
                    value={form.rented_time_ps4} 
                    onChange={(e) => setForm(f => ({ ...f, rented_time_ps4: e.target.value }))} 
                  />
                </>
              )}
            </div>
          </div>

          {/* notes */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">หมายเหตุ</label>
            <textarea
              rows={2}
              className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue resize-none"
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {errors._ && <p className="text-red-400 text-xs">{errors._[0]}</p>}

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-text-secondary border border-border hover:bg-card-bg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-accent-blue text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete Confirmation Dialog ────────────────────────────────────────────────

interface DeleteDialogProps {
  account: AccountRow
  onClose: () => void
  onDeleted: () => void
}

function DeleteDialog({ account, onClose, onDeleted }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/accounts/${account.id}`, {
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
          ต้องการลบไอดี <span className="text-text-primary font-semibold">No.{account.account_number}</span> ใช่หรือไม่?
          การลบจะลบข้อมูลเกมที่เชื่อมโยงทั้งหมดด้วย
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

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal state
  const [showAdd, setShowAdd] = useState(false)
  const [editAccount, setEditAccount] = useState<AccountRow | null>(null)
  const [deleteAccount, setDeleteAccount] = useState<AccountRow | null>(null)

  async function fetchAccounts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/accounts', { headers: authHeaders() })
      if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ')
      const json = await res.json()
      setAccounts(json.data ?? [])
    } catch (err: any) {
      setError(err.message ?? 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAccounts() }, [])

  function toFormState(a: AccountRow): AccountFormState {
    // Helper to split datetime
    const splitDatetime = (dt: string | null) => {
      if (!dt) return { date: '', time: '' }
      const d = new Date(dt)
      return {
        date: d.toISOString().split('T')[0],
        time: d.toTimeString().slice(0, 5)
      }
    }

    const legacy = splitDatetime(a.rented_until)
    const ps5Own = splitDatetime(a.rented_until_ps5_own)
    const ps5Shop = splitDatetime(a.rented_until_ps5_shop)
    const ps4 = splitDatetime(a.rented_until_ps4)

    return {
      status: a.status,
      rented_until: legacy.date,
      rented_time: legacy.time,
      notes: a.notes ?? '',
      selectedGames: a.games ?? [],
      price_ps5_own: a.price_ps5_own?.toString() ?? '',
      price_ps5_shop: a.price_ps5_shop?.toString() ?? '',
      price_ps4: a.price_ps4?.toString() ?? '',
      status_ps5_own: a.status_ps5_own || 'available',
      status_ps5_shop: a.status_ps5_shop || 'available',
      status_ps4: a.status_ps4 || 'available',
      rented_until_ps5_own: ps5Own.date,
      rented_time_ps5_own: ps5Own.time,
      rented_until_ps5_shop: ps5Shop.date,
      rented_time_ps5_shop: ps5Shop.time,
      rented_until_ps4: ps4.date,
      rented_time_ps4: ps4.time,
    }
  }

  // Calculate next account number (find gaps in sequence)
  const nextAccountNumber = (() => {
    if (accounts.length === 0) return 1
    
    const accountNumbers = accounts.map(a => parseInt(a.account_number) || 0).sort((a, b) => a - b)
    
    // Find first gap in sequence
    for (let i = 1; i <= accountNumbers.length; i++) {
      if (!accountNumbers.includes(i)) {
        return i
      }
    }
    
    // No gaps, use next number
    return Math.max(...accountNumbers) + 1
  })()

  // Filter accounts by search query (account number or game name)
  const filteredAccounts = accounts.filter(account => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase().trim()
    const normalizedQuery = query.replace(/\s+/g, '')
    
    // Search by account number
    if (account.account_number.toLowerCase().includes(query)) return true
    
    // Search by game name
    return account.games?.some(game => {
      const gameTitle = game.title.toLowerCase()
      const normalizedTitle = gameTitle.replace(/\s+/g, '')
      return gameTitle.includes(query) || normalizedTitle.includes(normalizedQuery)
    })
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary">จัดการไอดี</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-accent-blue text-white hover:opacity-90 transition-opacity"
        >
          + เพิ่มไอดี
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ค้นหาด้วยหมายเลขไอดีหรือชื่อเกม..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md bg-card-bg border border-border rounded-lg px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
        />
        {searchQuery && (
          <p className="text-text-secondary text-sm mt-2">
            พบ {filteredAccounts.length} ไอดี
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchAccounts} className="ml-4 underline text-xs">ลองใหม่</button>
        </div>
      )}

      {/* Grid View */}
      {loading ? (
        <div className="text-center py-12 text-text-secondary">กำลังโหลด...</div>
      ) : filteredAccounts.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          {searchQuery ? 'ไม่พบไอดีที่ค้นหา' : 'ยังไม่มีไอดี'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {filteredAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-card-bg border border-border rounded-lg overflow-hidden hover:border-accent-blue/50 transition-colors"
            >
              {/* Collage */}
              <div className="aspect-square relative">
                <GameCollage games={account.games} />
              </div>

              {/* Info */}
              <div className="p-1.5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-text-primary">
                    ไอดี No.{account.account_number}
                  </h3>
                  <StatusBadge status={account.status} />
                </div>

                <div className="text-xs text-text-secondary mb-1">
                  <div>เกม: {account.game_count} เกม</div>
                  {account.rented_until && (
                    <div className="truncate">คืน: {new Date(account.rented_until).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  )}
                </div>

                {/* Game List */}
                {account.games.length > 0 && (
                  <div className="mb-1 max-h-16 overflow-y-auto">
                    <div className="text-xs text-text-secondary space-y-0.5">
                      {account.games.slice(0, 5).map((game) => (
                        <div key={game.id} className="truncate">• {game.title}</div>
                      ))}
                      {account.games.length > 5 && (
                        <div className="text-accent-blue">+ อีก {account.games.length - 5} เกม</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setEditAccount(account)}
                    className="flex-1 px-2 py-1 rounded text-xs border border-accent-blue text-accent-blue hover:bg-accent-blue/10 transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => setDeleteAccount(account)}
                    className="flex-1 px-2 py-1 rounded text-xs border border-red-800 text-red-400 hover:bg-red-900/30 transition-colors"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <AccountModal
          initial={null}
          nextAccountNumber={nextAccountNumber}
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); fetchAccounts() }}
        />
      )}

      {/* Edit Modal */}
      {editAccount && (
        <AccountModal
          initial={toFormState(editAccount)}
          editId={editAccount.id}
          onClose={() => setEditAccount(null)}
          onSaved={() => { setEditAccount(null); fetchAccounts() }}
        />
      )}

      {/* Delete Dialog */}
      {deleteAccount && (
        <DeleteDialog
          account={deleteAccount}
          onClose={() => setDeleteAccount(null)}
          onDeleted={() => { setDeleteAccount(null); fetchAccounts() }}
        />
      )}
    </div>
  )
}
