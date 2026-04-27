/**
 * FILE: packages/shared/src/theme/colors.ts
 * PURPOSE: Dark/Blue theme color constants for Ninja Shop
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 4.1–4.8
 */

export const THEME = {
  background: '#0a0e27',
  secondaryBg: '#1a1f3a',
  accentBlue: '#00d4ff',
  accentBlue2: '#0066ff',
  textPrimary: '#ffffff',
  textSecondary: '#a0aec0',
  cardBg: '#151a30',
  border: '#2d3748',
} as const

export type ThemeColor = (typeof THEME)[keyof typeof THEME]
