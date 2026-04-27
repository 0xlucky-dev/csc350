/**
 * FILE: apps/admin/src/app/layout.tsx
 * PURPOSE: Root layout for Ninja Shop Admin Dashboard
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 5.5, 5.6
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ninja Shop Admin',
  description: 'Admin Dashboard for Ninja Shop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-background text-text-primary min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
