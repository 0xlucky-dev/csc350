/**
 * FILE: apps/customer/src/components/MobileDrawer.tsx
 * PURPOSE: Slide-in navigation drawer for mobile (<1024px)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 12.3, 12.7
 */

'use client'

import Link from 'next/link'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        role="navigation"
        aria-label="Mobile navigation"
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-secondary-bg border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <span className="text-accent-blue font-bold text-lg tracking-widest">
            NINJA SHOP
          </span>
          <button
            onClick={onClose}
            aria-label="ปิดเมนู"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            {/* X icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <ul className="flex flex-col px-4 py-6 gap-2">
          <li>
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center min-h-[44px] px-4 rounded-lg text-text-primary hover:bg-card-bg hover:text-accent-blue transition-colors font-medium"
            >
              หน้าหลัก
            </Link>
          </li>
          <li>
            <Link
              href="/accounts"
              onClick={onClose}
              className="flex items-center min-h-[44px] px-4 rounded-lg text-text-primary hover:bg-card-bg hover:text-accent-blue transition-colors font-medium"
            >
              ไอดีทั้งหมด
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
