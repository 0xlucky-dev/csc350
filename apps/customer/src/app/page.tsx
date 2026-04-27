/**
 * FILE: apps/customer/src/app/page.tsx
 * PURPOSE: Home page — fetch accounts, prices, contact settings แล้ว render AccountGrid with search
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 7.4)
 * REQUIREMENTS: 1.1, 13.1, 15.1, 15.5, 15.6
 */

import HeroSection from '../components/HeroSection'
import AccountGridWithSearch from '../components/account/AccountGridWithSearch'
import type { Account, RentalPrice, ContactSettings, ApiSuccess } from '@ninja-shop/shared'

export const revalidate = 0 // Disable cache, always fetch fresh data

async function fetchData(): Promise<{
  accounts: Account[]
  prices: RentalPrice[]
  contactSettings: ContactSettings
} | null> {
  // Server-side fetch ใช้ internal URL เสมอ (ไม่ขึ้นกับ nginx public port)
  // INTERNAL_BASE_URL = http://localhost:7000 (internal port ของ customer app)
  // ถ้าใช้ nginx forward port ก็ยังทำงานได้เพราะ fetch ไปที่ internal port โดยตรง
  const base = process.env.INTERNAL_BASE_URL ?? 'http://localhost:7000'

  try {
    const [accountsRes, pricesRes, contactRes] = await Promise.all([
      fetch(`${base}/api/accounts`, { cache: 'no-store' }),
      fetch(`${base}/api/prices`, { cache: 'no-store' }),
      fetch(`${base}/api/settings/contact`, { cache: 'no-store' }),
    ])

    if (!accountsRes.ok || !pricesRes.ok || !contactRes.ok) {
      return null
    }

    const [accountsJson, pricesJson, contactJson]: [
      ApiSuccess<Account[]>,
      ApiSuccess<RentalPrice[]>,
      ApiSuccess<ContactSettings>,
    ] = await Promise.all([
      accountsRes.json(),
      pricesRes.json(),
      contactRes.json(),
    ])

    if (!accountsJson.success || !pricesJson.success || !contactJson.success) {
      return null
    }

    return {
      accounts: accountsJson.data,
      prices: pricesJson.data,
      contactSettings: contactJson.data,
    }
  } catch {
    return null
  }
}

export default async function HomePage() {
  const data = await fetchData()

  return (
    <main>
      {/* Animated background */}
      <div className="animated-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <HeroSection />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {data === null ? (
          <p className="text-center text-red-400 py-12">
            ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง
          </p>
        ) : (
          <AccountGridWithSearch
            accounts={data.accounts}
            prices={data.prices}
            contactSettings={data.contactSettings}
          />
        )}
      </div>
    </main>
  )
}
