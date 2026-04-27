/**
 * FILE: apps/customer/src/app/not-found.tsx
 * PURPOSE: Custom 404 page for Ninja Shop Customer Website
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 15.5
 */

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold text-accent-blue mb-4">404</p>
        <h1 className="text-2xl font-semibold text-text-primary mb-6">
          ไม่พบหน้าที่คุณต้องการ
        </h1>
        <Link
          href="/"
          className="text-accent-blue hover:underline text-sm"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  )
}
