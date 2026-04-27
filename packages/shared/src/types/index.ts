/**
 * FILE: packages/shared/src/types/index.ts
 * PURPOSE: Shared TypeScript types for Ninja Shop (accounts, games, prices, API responses)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 3.1)
 */

export type AccountStatus = 'available' | 'rented'
export type RentalType = 'ps5_own' | 'ps5_shop' | 'ps4'
export type AdminRole = 'admin' | 'super_admin'
export type SettingDataType = 'string' | 'number' | 'boolean' | 'json'

export interface Account {
  id: number
  account_number: string
  account_name: string | null
  status: AccountStatus // Legacy field (kept for backward compatibility)
  rented_until: string | null // Legacy field (ISO date string with time)
  notes: string | null
  price_ps5_own: number | null
  price_ps5_shop: number | null
  price_ps4: number | null
  // Separate status for each rental type
  status_ps5_own: AccountStatus
  status_ps5_shop: AccountStatus
  status_ps4: AccountStatus
  rented_until_ps5_own: string | null
  rented_until_ps5_shop: string | null
  rented_until_ps4: string | null
  games: Game[]
}

export interface Game {
  id: number
  title: string
  title_en: string | null
  image_url: string | null
  thumbnail_url: string | null
  playstation_url: string | null
  genre: string | null
}

export interface RentalPrice {
  id: number
  rental_type: RentalType
  price: number
  duration_days: number
  description: string | null
  is_active: boolean
}

export interface ContactSettings {
  contact_url: string | null
  line_url: string | null
  facebook_url: string | null
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    fields?: Record<string, string[]>
  }
}

export interface ApiSuccess<T> {
  success: true
  data: T
}
