/**
 * FILE: apps/customer/src/app/detail/[game_id]/page.tsx
 * PURPOSE: Account detail page (using account_number instead of id)
 *          URL format: /detail/game_id=15
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Account, ContactSettings } from '@ninja-shop/shared'
import ContactButton from '@/components/account/ContactButton'
import PriceStatusCard from '@/components/account/PriceStatusCard'
import Header from '@/components/Header'

interface PageProps {
  params: {
    game_id: string
  }
}

async function getAccountByNumber(accountNumber: string): Promise<Account | null> {
  try {
    const baseUrl = process.env.INTERNAL_BASE_URL || 'http://localhost:7000'
    const res = await fetch(`${baseUrl}/api/accounts`, {
      cache: 'no-store'
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    const accounts = data.data as Account[]
    
    return accounts.find(acc => acc.account_number === accountNumber) || null
  } catch (error) {
    console.error('[getAccountByNumber]', error)
    return null
  }
}

async function getContactSettings(): Promise<ContactSettings> {
  try {
    const baseUrl = process.env.INTERNAL_BASE_URL || 'http://localhost:7000'
    const res = await fetch(`${baseUrl}/api/settings/contact`, {
      cache: 'no-store'
    })
    
    if (!res.ok) return { contact_url: null, line_url: null, facebook_url: null }
    
    const data = await res.json()
    return data.data as ContactSettings
  } catch (error) {
    console.error('[getContactSettings]', error)
    return { contact_url: null, line_url: null, facebook_url: null }
  }
}

export default async function AccountDetailPage({ params }: PageProps) {
  const [account, contactSettings] = await Promise.all([
    getAccountByNumber(params.game_id),
    getContactSettings()
  ])
  
  if (!account) {
    notFound()
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-blue transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับหน้าหลัก
        </Link>
        
        {/* Account header */}
        <div className="glass rounded-xl p-6 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            ID No.{account.account_number}
          </h1>
          
          <p className="text-text-secondary">
            จำนวนเกม: <span className="text-accent-blue font-bold">{account.games?.length || 0}</span> เกม
          </p>
        </div>
        
        {/* Games grid */}
        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">รายชื่อเกมทั้งหมด</h2>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {account.games?.map((game) => (
              <div key={game.id} className="group">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary-bg">
                  {game.image_url ? (
                    <Image
                      src={game.image_url}
                      alt={game.title}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-text-primary line-clamp-2 group-hover:text-accent-blue transition-colors">
                  {game.title}
                </p>
              </div>
            ))}
          </div>
          
          {(!account.games || account.games.length === 0) && (
            <p className="text-text-secondary text-center py-8">ไม่มีเกมในไอดีนี้</p>
          )}
        </div>
        
        {/* Pricing and contact */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">ราคาเช่าและสถานะ</h2>
          
          <div className="flex flex-col gap-3 mb-6">
            <PriceStatusCard
              label="PS5 ไอดีตัวเอง"
              price={account.price_ps5_own}
              duration={30}
              status={account.status_ps5_own}
              rentedUntil={account.rented_until_ps5_own}
            />
            <PriceStatusCard
              label="PS5 ไอดีร้าน"
              price={account.price_ps5_shop}
              duration={30}
              status={account.status_ps5_shop}
              rentedUntil={account.rented_until_ps5_shop}
            />
            <PriceStatusCard
              label="PS4"
              price={account.price_ps4}
              duration={30}
              status={account.status_ps4}
              rentedUntil={account.rented_until_ps4}
            />
          </div>
          
          {/* Contact button */}
          <ContactButton
            accountNumber={account.account_number}
            contactUrl={contactSettings.contact_url}
            lineUrl={contactSettings.line_url}
            facebookUrl={contactSettings.facebook_url}
          />
        </div>
        </div>
      </main>
    </>
  )
}
