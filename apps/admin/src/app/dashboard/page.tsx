/**
 * FILE: apps/admin/src/app/dashboard/page.tsx
 * PURPOSE: Admin dashboard overview page with statistics and account list
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 6.1
 */

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import type { Account, Game } from '@ninja-shop/shared'
import Image from 'next/image'

interface AccountRow {
  id: number
  account_number: string
  account_name: string | null
  status: 'available' | 'rented'
  rented_until: string | null
  notes: string | null
  price_ps5_own: number | null
  price_ps5_shop: number | null
  price_ps4: number | null
  status_ps5_own: 'available' | 'rented'
  status_ps5_shop: 'available' | 'rented'
  status_ps4: 'available' | 'rented'
  rented_until_ps5_own: string | null
  rented_until_ps5_shop: string | null
  rented_until_ps4: string | null
  games: Game[]
}

interface DashboardStats {
  totalAccounts: number
  rentedAccounts: number
  expiringAccounts: number
}

function authHeaders() {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_token')?.value
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  }
}

async function getAccounts(): Promise<AccountRow[]> {
  try {
    const baseUrl = process.env.INTERNAL_BASE_URL || 'http://localhost:7001'
    const res = await fetch(`${baseUrl}/api/admin/accounts`, {
      headers: authHeaders(),
      cache: 'no-store',
    })

    if (res.status === 401) {
      redirect('/login')
    }

    if (!res.ok) {
      console.error('[getAccounts] Failed:', res.status)
      return []
    }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('[getAccounts]', error)
    return []
  }
}

function calculateStats(accounts: AccountRow[]): DashboardStats {
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  let rentedCount = 0
  let expiringCount = 0

  accounts.forEach(account => {
    // นับจำนวนที่ถูกเช่า (ถ้ามีอย่างน้อย 1 ประเภทที่ถูกเช่า)
    const hasRented = 
      account.status_ps5_own === 'rented' ||
      account.status_ps5_shop === 'rented' ||
      account.status_ps4 === 'rented'
    
    if (hasRented) {
      rentedCount++
    }

    // นับจำนวนที่ใกล้หมดอายุ (ภายใน 3 วัน)
    const expiringDates = [
      account.status_ps5_own === 'rented' ? account.rented_until_ps5_own : null,
      account.status_ps5_shop === 'rented' ? account.rented_until_ps5_shop : null,
      account.status_ps4 === 'rented' ? account.rented_until_ps4 : null,
    ].filter(Boolean)

    const hasExpiring = expiringDates.some(dateStr => {
      if (!dateStr) return false
      const expiryDate = new Date(dateStr)
      return expiryDate >= now && expiryDate <= threeDaysFromNow
    })

    if (hasExpiring) {
      expiringCount++
    }
  })

  return {
    totalAccounts: accounts.length,
    rentedAccounts: rentedCount,
    expiringAccounts: expiringCount,
  }
}

function GameCollage({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-secondary-bg rounded-lg flex items-center justify-center">
        <p className="text-text-secondary text-xs">ไม่มีเกม</p>
      </div>
    )
  }

  const displayGames = games.slice(0, 24)
  const cols = displayGames.length === 1 ? 1 : displayGames.length === 2 ? 2 : displayGames.length === 3 ? 3 : displayGames.length <= 6 ? 3 : displayGames.length <= 12 ? 4 : 6
  const rows = Math.ceil(displayGames.length / cols)
  
  let aspectRatio = '3/4'
  if (displayGames.length === 1) aspectRatio = '3/4'
  else if (displayGames.length === 2) aspectRatio = '3/2'
  else if (displayGames.length === 3) aspectRatio = '9/4'
  else if (displayGames.length === 4) aspectRatio = '1/1'
  else if (displayGames.length <= 6) aspectRatio = '3/2'
  else if (displayGames.length <= 9) aspectRatio = '4/3'
  else if (displayGames.length <= 12) aspectRatio = '16/9'
  else aspectRatio = '2/1'

  return (
    <div className="w-full" style={{ aspectRatio }}>
      <div className={`grid gap-0.5 h-full`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {displayGames.map((game) => (
          <div key={game.id} className="relative w-full h-full bg-secondary-bg overflow-hidden">
            {game.image_url ? (
              <Image
                src={game.image_url}
                alt={game.title}
                fill
                sizes="200px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-4 h-4 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-card-bg border border-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`text-4xl ${color}`}>{icon}</div>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const accounts = await getAccounts()
  const stats = calculateStats(accounts)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">ภาพรวม Dashboard</h1>
        <p className="text-text-secondary mt-1">สรุปข้อมูลและรายการไอดีทั้งหมด</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="จำนวนไอดีทั้งหมด"
          value={stats.totalAccounts}
          icon="📦"
          color="text-accent-blue"
        />
        <StatCard
          title="จำนวนที่ถูกเช่า"
          value={stats.rentedAccounts}
          icon="🔒"
          color="text-red-400"
        />
        <StatCard
          title="ใกล้หมดอายุ (3 วัน)"
          value={stats.expiringAccounts}
          icon="⏰"
          color="text-orange-400"
        />
      </div>

      {/* Accounts List */}
      <div className="bg-card-bg border border-border rounded-lg p-4">
        <h2 className="text-lg font-bold text-text-primary mb-4">รายการไอดีทั้งหมด</h2>
        
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">ยังไม่มีไอดี</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
            {accounts.map((account) => {
              const hasRented = 
                account.status_ps5_own === 'rented' ||
                account.status_ps5_shop === 'rented' ||
                account.status_ps4 === 'rented'

              return (
                <div
                  key={account.id}
                  className="bg-secondary-bg border border-border rounded-lg p-1 hover:border-accent-blue transition-colors"
                >
                  {/* Account Number */}
                  <div className="flex items-center justify-between mb-1 px-0.5">
                    <h3 className="text-text-primary font-semibold text-xs">
                      No.{account.account_number}
                    </h3>
                    {hasRented && (
                      <span className="text-[10px] px-1 py-0.5 rounded bg-red-500/20 text-red-400">
                        เช่า
                      </span>
                    )}
                  </div>

                  {/* Game Collage */}
                  <div className="mb-1 rounded overflow-hidden">
                    <GameCollage games={account.games} />
                  </div>

                  {/* Game Count */}
                  <div className="px-0.5">
                    <p className="text-text-secondary text-[10px]">
                      {account.games.length} เกม
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
