# Implementation Plan: Ninja Shop — PlayStation ID Rental Website

## Overview

แผนการ implement ระบบ Ninja Shop แบบ incremental โดยเริ่มจาก monorepo setup → shared packages → customer website → admin dashboard → testing ครบทุก property

Tech stack: TypeScript, Next.js App Router, Tailwind CSS, shadcn/ui, mysql2, Zod, Vitest, fast-check

---

## Tasks

- [x] 1. Setup Monorepo และ Project Structure
  - สร้าง Turborepo monorepo พร้อม `apps/customer`, `apps/admin`, `packages/shared`
  - ตั้งค่า `turbo.json`, root `package.json`, `.gitignore`, `tsconfig.json` base
  - ติดตั้ง dependencies หลัก: Next.js, Tailwind CSS, shadcn/ui, mysql2, Zod, Vitest, fast-check
  - สร้าง `packages/shared/src/theme/colors.ts` และ `breakpoints.ts` ตาม design
  - _Requirements: 4.1–4.8, 12.1–12.7_

- [x] 2. สร้าง Database Schema และ Connection Layer
  - [x] 2.1 สร้าง SQL schema ใน `packages/shared/src/db/schema.sql`
    - สร้าง tables: `accounts`, `games`, `account_games`, `rental_prices`, `admin_users`, `settings`
    - กำหนด ENUM, cascade deletes, unique constraints ตาม design
    - _Requirements: 14.1–14.9_

  - [x] 2.2 สร้าง mysql2 connection pool ใน `packages/shared/src/db/client.ts`
    - ใช้ `mysql2/promise` พร้อม connection pool (limit 10)
    - อ่านค่าจาก env: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
    - _Requirements: 14.1_

  - [ ]* 2.3 Write property test for cascade delete (Property 12 & 13)
    - **Property 12: Cascade Delete on Account Removal**
    - **Property 13: Cascade Delete on Game Removal**
    - **Validates: Requirements 6.8, 14.2, 14.3**

  - [x] 2.4 สร้าง database seed script (`packages/shared/src/db/seed.ts`)
    - Seed `rental_prices` (ps5_own, ps5_shop, ps4)
    - Seed `admin_users` (bcrypt hash password)
    - Seed `settings` (line_url, facebook_url)
    - _Requirements: 5.4, 10.1, 11.1_

- [x] 3. สร้าง Shared Types, Validators และ Utilities
  - [x] 3.1 สร้าง shared TypeScript types ใน `packages/shared/src/types/index.ts`
    - Export: `Account`, `Game`, `RentalPrice`, `ContactSettings`, `AccountStatus`, `RentalType`
    - Export: `ApiError`, `ApiSuccess<T>` response interfaces
    - _Requirements: 1.1–1.10, 3.1–3.7_

  - [x] 3.2 สร้าง Zod validators ใน `packages/shared/src/validators/index.ts`
    - `accountFormSchema`, `priceUpdateSchema`, `loginSchema`
    - `lineUrlSchema` (must start with `https://line.me/`)
    - `facebookUrlSchema` (must start with `https://facebook.com/` or `https://www.facebook.com/`)
    - `rentalStatusSchema` (rented requires future date)
    - _Requirements: 5.1, 7.2–7.4, 10.2, 11.3–11.4, 15.3_

  - [ ]* 3.3 Write property test for URL format validation (Property 19)
    - **Property 19: Contact URL Format Validation**
    - **Validates: Requirements 11.3, 11.4**

  - [ ]* 3.4 Write property test for price validation (Property 17)
    - **Property 17: Price Must Be Positive**
    - **Validates: Requirements 10.2**

  - [ ]* 3.5 Write property test for rented status date validation (Property 14)
    - **Property 14: Rented Status Requires Future Date**
    - **Validates: Requirements 7.2, 7.4**

  - [ ]* 3.6 Write property test for form validation errors (Property 20)
    - **Property 20: Form Validation Returns Field-Specific Errors**
    - **Validates: Requirements 15.3**

- [x] 4. Checkpoint — ตรวจสอบ shared package
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. สร้าง Customer Website — Layout และ Theme
  - [x] 5.1 ตั้งค่า `apps/customer` Next.js App Router
    - สร้าง `app/layout.tsx` พร้อม font, metadata, Tailwind theme (`#0a0e27` bg)
    - ตั้งค่า `tailwind.config.ts` ให้ใช้ custom colors จาก `packages/shared/theme/colors.ts`
    - _Requirements: 4.1–4.8_

  - [x] 5.2 สร้าง `Header.tsx` component
    - Logo + navigation links
    - Desktop: horizontal nav (≥1024px)
    - Mobile: hamburger icon (<1024px) ที่ trigger `MobileDrawer`
    - Touch targets ≥44×44px
    - _Requirements: 12.1–12.3, 12.6_

  - [x] 5.3 สร้าง `MobileDrawer.tsx` component
    - Slide-in navigation drawer
    - ปิดเมื่อ click outside
    - _Requirements: 12.3, 12.7_

  - [x] 5.4 สร้าง `HeroSection.tsx` และ `Footer.tsx`
    - HeroSection: banner แนะนำบริการ พร้อม accent color `#00d4ff`
    - Footer: shop info + links
    - _Requirements: 4.1–4.8_

- [x] 6. สร้าง Customer Website — Account Components
  - [x] 6.1 สร้าง `StatusBadge.tsx` component
    - รับ `status: 'available' | 'rented'` และ `rented_until: string | null`
    - Available → แสดง "Available"
    - Rented → แสดง "Rented until YYYY-MM-DD"
    - _Requirements: 1.6, 1.7_

  - [ ]* 6.2 Write property test for status display (Property 1 & 2)
    - **Property 1: Account Number Format** — ตรวจสอบ "ID No.X" pattern
    - **Property 2: Rental Status Display** — ตรวจสอบ available/rented formatting
    - **Validates: Requirements 1.5, 1.6, 1.7**

  - [x] 6.3 สร้าง `GameThumbnail.tsx` component
    - แสดงรูปเกมด้วย `next/image` (lazy loading, WebP)
    - Hover/tap แสดง game title overlay
    - Fallback placeholder เมื่อรูปโหลดไม่ได้
    - _Requirements: 2.4–2.8_

  - [x] 6.4 สร้าง `GameGrid.tsx` component
    - Desktop (≥1024px): 4-column grid
    - Tablet (768–1023px): 3-column grid
    - Mobile (<768px): 2-column grid
    - _Requirements: 2.1–2.3_

  - [ ]* 6.5 Write property test for game library completeness (Property 3)
    - **Property 3: Game Library Completeness** — N games → N thumbnails
    - **Validates: Requirements 1.8**

  - [x] 6.6 สร้าง `PricingTable.tsx` component
    - แสดงราคาเฉพาะ `is_active = true`
    - แสดง rental_type, price, duration_days
    - _Requirements: 1.9, 10.7_

  - [ ]* 6.7 Write property test for pricing table completeness (Property 4 & 18)
    - **Property 4: Pricing Table Completeness** — active prices ทุกตัวต้องแสดง
    - **Property 18: Inactive Rental Types Hidden from Customers**
    - **Validates: Requirements 1.9, 10.7**

  - [x] 6.8 สร้าง `ContactButton.tsx` component
    - แสดง LINE button เมื่อ `line_url` ไม่ใช่ null
    - แสดง Facebook button เมื่อ `facebook_url` ไม่ใช่ null
    - เปิด link ใน new tab
    - Touch target ≥44×44px
    - _Requirements: 3.1–3.7_

  - [ ]* 6.9 Write property test for contact button rendering (Property 5)
    - **Property 5: Contact Button Conditional Rendering**
    - **Validates: Requirements 3.1, 3.4, 3.5**

  - [x] 6.10 สร้าง `AccountCard.tsx` component
    - รวม StatusBadge, GameGrid, PricingTable, ContactButton
    - แสดง account number ในรูปแบบ "ID No.X"
    - Card background `#151a30`
    - _Requirements: 1.5–1.10_

  - [x] 6.11 สร้าง `AccountGrid.tsx` component
    - Desktop (≥1024px): 3-column grid
    - Tablet (768–1023px): 2-column grid
    - Mobile (<768px): 1-column
    - _Requirements: 1.1–1.4_

- [x] 7. สร้าง Customer Website — Public API Routes
  - [x] 7.1 สร้าง `GET /api/accounts` route
    - ดึง accounts ทั้งหมดพร้อม games และ active prices
    - ใช้ ISR revalidate 60 วินาที
    - Return `ApiSuccess<Account[]>`
    - _Requirements: 1.1, 13.1_

  - [x] 7.2 สร้าง `GET /api/settings/contact` route
    - ดึง `line_url` และ `facebook_url` จาก settings table
    - Return `ApiSuccess<ContactSettings>`
    - _Requirements: 3.3, 11.6_

  - [x] 7.3 สร้าง `GET /api/prices` route
    - ดึงเฉพาะ `is_active = true` rental prices
    - Return `ApiSuccess<RentalPrice[]>`
    - _Requirements: 10.7_

  - [x] 7.4 สร้าง Customer Website home page (`app/page.tsx`)
    - Fetch จาก API routes ด้วย ISR
    - Render `AccountGrid` พร้อม accounts, prices, contactSettings
    - Error state และ empty state
    - _Requirements: 1.1, 13.1, 15.1, 15.5, 15.6_

- [x] 8. Checkpoint — ตรวจสอบ Customer Website
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. สร้าง Admin Dashboard — Auth System
  - [x] 9.1 สร้าง JWT utility functions ใน `apps/admin/lib/jwt.ts`
    - `signToken(payload)` → JWT ที่ expire ใน 24 ชั่วโมง (exp = iat + 86400)
    - `verifyToken(token)` → decode และ verify
    - _Requirements: 5.2, 5.5_

  - [ ]* 9.2 Write property test for JWT expiration (Property 6)
    - **Property 6: JWT Expiration Invariant** — exp = iat + 86400
    - **Validates: Requirements 5.2**

  - [x] 9.3 สร้าง `POST /api/admin/auth/login` route
    - Validate ด้วย `loginSchema`
    - ตรวจสอบ username/password ด้วย bcrypt compare
    - อัพเดท `last_login` timestamp เมื่อ login สำเร็จ
    - Return JWT token หรือ error
    - _Requirements: 5.1–5.4, 5.7_

  - [ ]* 9.4 Write property test for invalid credentials rejection (Property 7)
    - **Property 7: Invalid Credentials Always Rejected**
    - **Validates: Requirements 5.3**

  - [ ]* 9.5 Write property test for last login timestamp update (Property 9)
    - **Property 9: Login Updates Last Login Timestamp**
    - **Validates: Requirements 5.7**

  - [x] 9.6 สร้าง JWT middleware/auth guard สำหรับ protected routes
    - ตรวจสอบ Authorization header
    - Return 401 เมื่อ token ไม่ valid หรือ expired
    - Redirect ไป login page เมื่อ JWT หมดอายุ (client-side)
    - _Requirements: 5.5, 5.6_

  - [ ]* 9.7 Write property test for protected routes (Property 8)
    - **Property 8: Protected Routes Require Valid JWT**
    - **Validates: Requirements 5.5**

  - [x] 9.8 สร้าง Admin login page (`apps/admin/app/login/page.tsx`)
    - Login form พร้อม username/password fields
    - Error message เมื่อ credentials ผิด
    - Responsive บน mobile (<768px)
    - _Requirements: 5.1, 5.3, 5.8_

- [x] 10. สร้าง Admin Dashboard — Layout และ Navigation
  - [x] 10.1 สร้าง Admin root layout พร้อม auth check
    - ตรวจสอบ JWT ใน middleware
    - Redirect ไป `/login` เมื่อไม่มี valid token
    - _Requirements: 5.5, 5.6_

  - [x] 10.2 สร้าง Dashboard layout พร้อม sidebar navigation
    - Desktop (≥1024px): fixed sidebar
    - Mobile (<1024px): collapsible drawer
    - Touch targets ≥44×44px
    - _Requirements: 12.4–12.6_

- [x] 11. สร้าง Admin Dashboard — Account Management
  - [x] 11.1 สร้าง `GET /api/admin/accounts` route (JWT protected)
    - ดึง accounts ทั้งหมดพร้อม games
    - _Requirements: 6.1_

  - [x] 11.2 สร้าง `POST /api/admin/accounts` route (JWT protected)
    - Validate ด้วย `accountFormSchema`
    - ตรวจสอบ `account_number` uniqueness
    - Insert ลง accounts table
    - Return field-specific errors เมื่อ validation ล้มเหลว
    - _Requirements: 6.2–6.4, 15.3_

  - [ ]* 11.3 Write property test for account number uniqueness (Property 10)
    - **Property 10: Account Number Uniqueness Enforcement**
    - **Validates: Requirements 6.3**

  - [ ]* 11.4 Write property test for account creation persistence (Property 11)
    - **Property 11: Account Creation Persistence**
    - **Validates: Requirements 6.4**

  - [x] 11.5 สร้าง `PUT /api/admin/accounts/:id` route (JWT protected)
    - Validate และ update record
    - _Requirements: 6.5–6.6_

  - [x] 11.6 สร้าง `DELETE /api/admin/accounts/:id` route (JWT protected)
    - ลบ account — MySQL ON DELETE CASCADE จัดการ account_games อัตโนมัติ
    - _Requirements: 6.7–6.8, 14.2_

  - [x] 11.7 สร้าง `PUT /api/admin/accounts/:id/status` route (JWT protected)
    - Validate: rented ต้องมี future date, available ต้อง clear rented_until
    - _Requirements: 7.1–7.7_

  - [ ]* 11.8 Write property test for available status clears date (Property 15)
    - **Property 15: Available Status Clears Rental Date**
    - **Validates: Requirements 7.3**

  - [x] 11.9 สร้าง Admin Accounts page (`apps/admin/app/dashboard/accounts/page.tsx`)
    - ตาราง accounts พร้อม horizontal scroll บน mobile
    - ปุ่ม Add, Edit, Delete พร้อม confirmation dialog
    - Form สำหรับ create/edit account
    - Status update UI
    - _Requirements: 6.1–6.9, 7.1–7.7, 12.9_

- [x] 12. สร้าง Admin Dashboard — Game Management
  - [x] 12.1 สร้าง `GET /api/admin/games` route (JWT protected)
    - ดึง games ทั้งหมด
    - _Requirements: 8.1_

  - [x] 12.2 สร้าง `POST /api/admin/games/scrape` route (JWT protected)
    - รับ search query
    - Scrape ข้อมูลจาก PlayStation Store (title, image_url, playstation_url)
    - Handle network errors พร้อม error message
    - _Requirements: 8.1–8.4, 8.8–8.9_

  - [x] 12.3 สร้าง `POST /api/admin/games` route (JWT protected)
    - ตรวจสอบ duplicate ก่อน insert
    - Insert game data ลง games table
    - _Requirements: 8.5–8.7_

  - [x] 12.4 สร้าง `DELETE /api/admin/games/:id` route (JWT protected)
    - ลบ game — MySQL ON DELETE CASCADE จัดการ account_games อัตโนมัติ
    - _Requirements: 14.3_

  - [x] 12.5 สร้าง `POST /api/admin/accounts/:id/games` route (JWT protected)
    - เพิ่ม game ให้ account (insert account_games)
    - ป้องกัน duplicate ด้วย unique constraint
    - Support bulk addition
    - _Requirements: 9.2–9.4, 9.7_

  - [ ]* 12.6 Write property test for duplicate game prevention (Property 16)
    - **Property 16: Duplicate Game Prevention**
    - **Validates: Requirements 9.4**

  - [x] 12.7 สร้าง `DELETE /api/admin/accounts/:id/games/:gameId` route (JWT protected)
    - ลบ record จาก account_games
    - _Requirements: 9.5_

  - [x] 12.8 สร้าง Admin Games page (`apps/admin/app/dashboard/games/page.tsx`)
    - Search interface สำหรับ PS Store scraper
    - แสดง search results พร้อม preview
    - Manual entry form (fallback)
    - Game list พร้อม associate/remove จาก accounts
    - _Requirements: 8.1–8.9, 9.1–9.7_

- [x] 13. สร้าง Admin Dashboard — Prices และ Settings
  - [x] 13.1 สร้าง `GET /api/admin/prices` และ `PUT /api/admin/prices/:id` routes (JWT protected)
    - Validate price เป็น positive decimal
    - Update price, description, duration_days, is_active
    - _Requirements: 10.1–10.6_

  - [x] 13.2 สร้าง `GET /api/admin/settings` และ `PUT /api/admin/settings/:key` routes (JWT protected)
    - Validate LINE URL และ Facebook URL format
    - Support data types: string, number, boolean, json
    - _Requirements: 11.1–11.7_

  - [x] 13.3 สร้าง Admin Prices page (`apps/admin/app/dashboard/prices/page.tsx`)
    - แสดง 3 rental types พร้อม current prices
    - Form สำหรับ update price, description, duration_days, is_active toggle
    - _Requirements: 10.1–10.6_

  - [x] 13.4 สร้าง Admin Settings page (`apps/admin/app/dashboard/settings/page.tsx`)
    - Key-value settings display
    - Form สำหรับ update settings
    - URL validation feedback
    - _Requirements: 11.1–11.7_

- [x] 14. Checkpoint — ตรวจสอบ Admin Dashboard
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. สร้าง Error Handling และ Custom Pages
  - [x] 15.1 สร้าง custom `not-found.tsx` (404) สำหรับ Customer Website
    - แสดง friendly message พร้อม link กลับหน้าหลัก
    - _Requirements: 15.5_

  - [x] 15.2 สร้าง custom `error.tsx` (500) สำหรับ Customer Website
    - แสดง error page พร้อม log error details
    - _Requirements: 15.6_

  - [x] 15.3 สร้าง error logging utility ใน `packages/shared/src/utils/logger.ts`
    - Structured JSON logging สำหรับ production
    - Console logging สำหรับ development
    - Log levels: error, warn, info, debug
    - _Requirements: 15.7_

- [x] 16. Integration Wiring และ Final Polish
  - [x] 16.1 ตรวจสอบ ISR caching บน Customer Website
    - ตั้งค่า `revalidate = 60` บน API routes และ page
    - ตรวจสอบ cache headers สำหรับ static assets
    - _Requirements: 13.1, 13.5_

  - [x] 16.2 ตั้งค่า Next.js Image Optimization
    - ใช้ `next/image` พร้อม lazy loading ทุก game image
    - ตั้งค่า WebP format
    - ตั้งค่า CDN domain ใน `next.config.js`
    - _Requirements: 2.4–2.5, 13.3–13.4_

  - [x] 16.3 ตั้งค่า code splitting และ performance
    - ตรวจสอบ dynamic imports สำหรับ non-critical components
    - ตั้งค่า minification ใน production build
    - _Requirements: 13.2, 13.6–13.7_

  - [x] 16.4 Wire ทุก component เข้าด้วยกันและทดสอบ end-to-end flow
    - Customer: home page → account cards → contact button
    - Admin: login → dashboard → CRUD accounts/games/prices/settings
    - _Requirements: ทุก requirement_

- [x] 17. Final Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks ที่มี `*` เป็น optional สามารถข้ามได้สำหรับ MVP ที่เร็วขึ้น
- ทุก task อ้างอิง requirements เพื่อ traceability
- Property tests ใช้ fast-check กับ `numRuns: 100` ทุก property
- Unit tests ใช้ Vitest + React Testing Library
- Checkpoints ช่วย validate ความถูกต้องแบบ incremental
- Property tests ครอบคลุมทั้ง 20 properties จาก design document
- Database ใช้ `mysql2` โดยตรง ไม่มี ORM — schema อยู่ที่ `packages/shared/src/db/schema.sql`
- รัน `npm run dev` เพื่อ start ทั้ง customer (port 7000) และ admin (port 7001) พร้อมกัน
