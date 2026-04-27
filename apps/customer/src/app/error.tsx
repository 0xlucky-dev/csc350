'use client'

/**
 * FILE: apps/customer/src/app/error.tsx
 * PURPOSE: Custom error boundary page for Ninja Shop Customer Website
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 15.6
 */

import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-primary mb-4">
          เกิดข้อผิดพลาด
        </h1>
        {error.message && (
          <p className="text-text-secondary text-sm mb-6">{error.message}</p>
        )}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-2 bg-accent-blue text-background font-medium rounded hover:opacity-90 transition-opacity"
          >
            ลองใหม่
          </button>
          <Link href="/" className="text-accent-blue hover:underline text-sm">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
}
