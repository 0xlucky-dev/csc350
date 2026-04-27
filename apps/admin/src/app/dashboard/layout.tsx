/**
 * FILE: apps/admin/src/app/dashboard/layout.tsx
 * PURPOSE: Dashboard shell layout — fixed sidebar (desktop) + collapsible drawer (mobile)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 12.4, 12.5, 12.6
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/dashboard', label: 'ภาพรวม' },
  { href: '/dashboard/accounts', label: 'ไอดี' },
  { href: '/dashboard/games', label: 'เกม' },
  { href: '/dashboard/settings', label: 'ตั้งค่า' },
]

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <ul className="flex flex-col gap-1 px-3 py-4">
      {NAV_LINKS.map(({ href, label }) => {
        const isActive =
          href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onLinkClick}
              className={`flex items-center min-h-[44px] min-w-[44px] px-4 rounded-lg font-medium transition-colors
                ${
                  isActive
                    ? 'bg-card-bg text-accent-blue'
                    : 'text-text-secondary hover:bg-card-bg hover:text-text-primary'
                }`}
            >
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function LogoutButton() {
  function handleLogout() {
    document.cookie = 'admin_token=; max-age=0; path=/'
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center min-h-[44px] min-w-[44px] w-full px-4 mx-3 mb-4 rounded-lg
        text-text-secondary hover:bg-card-bg hover:text-text-primary transition-colors font-medium"
    >
      ออกจากระบบ
    </button>
  )
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border shrink-0">
        <Image
          src="/shop_logo.png"
          alt="NINJA SHOP"
          width={1200}
          height={400}
          className="h-14 w-auto md:h-16"
        />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto">
        <NavLinks onLinkClick={onLinkClick} />
      </div>

      {/* Logout */}
      <div className="shrink-0 border-t border-border pt-2">
        <LogoutButton />
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* ── Desktop sidebar (fixed, visible ≥1024px) ── */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 flex-col bg-secondary-bg border-r border-border z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar (visible <1024px) ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center h-16 px-4 bg-secondary-bg border-b border-border">
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="เปิดเมนู"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <line x1="3" y1="6"  x2="19" y2="6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <Image
          src="/shop_logo.png"
          alt="NINJA SHOP"
          width={1200}
          height={400}
          className="h-14 w-auto md:h-16 ml-3"
        />
      </header>

      {/* ── Mobile drawer overlay ── */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile drawer panel ── */}
      <nav
        role="navigation"
        aria-label="Admin navigation"
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-secondary-bg border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer header with close button */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <Image
            src="/shop_logo.png"
            alt="NINJA SHOP"
            width={1200}
            height={400}
            className="h-14 w-auto md:h-16"
          />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="ปิดเมนู"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <SidebarContent onLinkClick={() => setDrawerOpen(false)} />
      </nav>

      {/* ── Main content ── */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
