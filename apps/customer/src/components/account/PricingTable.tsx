/**
 * FILE: apps/customer/src/components/account/PricingTable.tsx
 * PURPOSE: ตารางราคาเช่า 3 ประเภท (PS5 เครื่องตัวเอง / PS5 เครื่องร้าน / PS4)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 6.6)
 * REQUIREMENTS: 1.9, 10.7
 */

import type { RentalPrice, RentalType } from '@ninja-shop/shared'

const RENTAL_TYPE_LABELS: Record<RentalType, string> = {
  ps5_own: 'PS5 (เครื่องตัวเอง)',
  ps5_shop: 'PS5 (เครื่องร้าน)',
  ps4: 'PS4',
}

interface PricingTableProps {
  prices: RentalPrice[]
}

export default function PricingTable({ prices }: PricingTableProps) {
  const activePrices = prices.filter((p) => p.is_active)

  if (activePrices.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-secondary border-b border-border">
            <th className="text-left py-1 font-medium">ประเภท</th>
            <th className="text-right py-1 font-medium">ราคา</th>
            <th className="text-right py-1 font-medium">ระยะเวลา</th>
          </tr>
        </thead>
        <tbody>
          {activePrices.map((price) => (
            <tr key={price.id} className="border-b border-border/50 last:border-0">
              <td className="py-1.5 text-text-primary">
                {RENTAL_TYPE_LABELS[price.rental_type]}
              </td>
              <td className="py-1.5 text-right text-accent-blue font-semibold">
                ฿{price.price.toLocaleString()}
              </td>
              <td className="py-1.5 text-right text-text-secondary">
                {price.duration_days} วัน
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
