/**
 * FILE: apps/customer/src/components/Footer.tsx
 * PURPOSE: Site footer — ชื่อร้านและ copyright
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 4.1–4.8
 */

export default function Footer() {
  return (
    <footer className="bg-secondary-bg border-t border-border py-6 px-4">
      <p className="text-center text-text-secondary text-sm">
        NINJA SHOP &copy; 2024
      </p>
    </footer>
  )
}
