/**
 * FILE: apps/customer/src/components/Header.tsx
 * PURPOSE: Site header — compact with navigation (no search bar)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MobileDrawer from './MobileDrawer'

interface HeaderProps {
  onSearch?: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo — left */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/shop_logo.png"
                  alt="NINJA SHOP"
                  width={1200}
                  height={400}
                  className="h-14 w-auto md:h-16"
                  priority
                />
              </Link>
            </div>

            {/* Desktop nav — center/right */}
            <nav aria-label="Desktop navigation" className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className="text-text-primary hover:text-accent-blue transition-colors font-medium min-h-[44px] flex items-center"
              >
                หน้าหลัก
              </Link>
              <Link
                href="/"
                className="text-text-primary hover:text-accent-blue transition-colors font-medium min-h-[44px] flex items-center"
              >
                ไอดีทั้งหมด
              </Link>
            </nav>

            {/* Hamburger — mobile */}
            <button
              aria-label="เปิดเมนู"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-[5px] text-text-primary hover:text-accent-blue transition-colors"
            >
              <div className="w-6 h-0.5 bg-current rounded-full" />
              <div className="w-6 h-0.5 bg-current rounded-full" />
              <div className="w-6 h-0.5 bg-current rounded-full" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}
