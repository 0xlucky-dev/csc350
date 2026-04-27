/**
 * FILE: apps/customer/src/components/account/StatusBadge.tsx
 * PURPOSE: แสดงสถานะ Available/Rented ของ PlayStation ID
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 6.1)
 * REQUIREMENTS: 1.6, 1.7
 */

interface StatusBadgeProps {
  status: 'available' | 'rented'
  rented_until: string | null
}

export default function StatusBadge({ status, rented_until }: StatusBadgeProps) {
  if (status === 'available') {
    return (
      <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/40">
        Available
      </span>
    )
  }

  return (
    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/40">
      Rented until {rented_until ?? '—'}
    </span>
  )
}
