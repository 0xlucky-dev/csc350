/**
 * FILE: apps/customer/src/components/account/AccountGrid.tsx
 * PURPOSE: Grid layout สำหรับแสดง Account Cards ทั้งหมด (responsive 1/2/3 columns)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 6.11)
 * REQUIREMENTS: 1.1–1.4
 */

import type { Account, RentalPrice, ContactSettings } from '@ninja-shop/shared'
import AccountCard from './AccountCard'

interface AccountGridProps {
  accounts: Account[]
  prices: RentalPrice[]
  contactSettings: ContactSettings
}

export default function AccountGrid({ accounts, prices, contactSettings }: AccountGridProps) {
  if (accounts.length === 0) {
    return (
      <p className="text-center text-text-secondary py-12">ยังไม่มีไอดีในระบบ</p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          prices={prices}
          contactSettings={contactSettings}
        />
      ))}
    </div>
  )
}
