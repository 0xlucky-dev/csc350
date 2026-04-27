/**
 * FILE: apps/admin/src/app/page.tsx
 * PURPOSE: Root redirect — sends unauthenticated users to login
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 5.5, 5.6
 */

import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/login')
}
