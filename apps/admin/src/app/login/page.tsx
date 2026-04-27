/**
 * FILE: apps/admin/src/app/login/page.tsx
 * PURPOSE: Admin login page — form with username/password, JWT cookie on success
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 9.8)
 *
 * DEPENDENCIES:
 *   - next/navigation: useRouter for redirect after login
 *   - POST /api/admin/auth/login: Login API route
 *
 * RELATED FILES:
 *   - apps/admin/src/app/api/admin/auth/login/route.ts: Login endpoint
 *   - apps/admin/src/middleware.ts: Reads 'admin_token' cookie
 *
 * Requirements: 5.1, 5.3, 5.8
 */

'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
        return
      }

      // Store token in cookie (max-age = 86400 seconds = 24 hours)
      document.cookie = `admin_token=${data.token}; path=/; max-age=86400; SameSite=Lax`

      router.push('/dashboard')
    } catch {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-card-bg border border-border rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Ninja Shop Admin
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm text-text-secondary">
              ชื่อผู้ใช้
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
              placeholder="username"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-text-secondary">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-accent-blue text-background font-semibold py-2 px-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]"
          >
            {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </main>
  )
}
