/**
 * FILE: packages/shared/src/theme/breakpoints.ts
 * PURPOSE: Responsive breakpoint constants for Ninja Shop
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 1.2–1.4, 2.1–2.3, 12.1–12.5
 *
 * Grid layout rules:
 *   Account grid:  desktop ≥1024px → 3 cols | tablet 768–1023px → 2 cols | mobile <768px → 1 col
 *   Game grid:     desktop ≥1024px → 4 cols | tablet 768–1023px → 3 cols | mobile <768px → 2 cols
 *
 * Tailwind mapping: sm:640px, md:768px, lg:1024px, xl:1280px
 */

export const BREAKPOINTS = {
  mobile: 768,   // < 768px: mobile layout
  tablet: 1024,  // 768–1023px: tablet layout
  desktop: 1024, // >= 1024px: desktop layout
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS
