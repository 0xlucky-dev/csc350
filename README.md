# Ninja Shop — เว็บไซต์ให้เช่าไอดี PlayStation

ระบบเว็บไซต์สำหรับให้เช่าไอดี PlayStation แบ่งเป็น 2 ส่วน:

- **Customer Website** — หน้าสาธารณะสำหรับลูกค้าดูรายการไอดีและเกม (ไม่ต้อง login)
- **Admin Dashboard** — จัดการข้อมูลไอดี เกม ราคา และการตั้งค่า (ต้อง login)

Tech stack: Next.js App Router, TypeScript, Tailwind CSS, MySQL 8, mysql2, Zod, Turborepo

---

## Prerequisites

- Node.js 18+
- MySQL 8

---

## Quick Start

### 🐧 Ubuntu (แนะนำ - ติดตั้งอัตโนมัติ)

```bash
# ติดตั้งครั้งเดียวเสร็จ (Node.js + MySQL + Database + Dependencies)
chmod +x setup.sh && ./setup.sh

# เริ่มใช้งาน
npm run dev
```

📖 **คู่มือเต็ม**: [SETUP_UBUNTU.md](./SETUP_UBUNTU.md)

---

### 🪟 Windows

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. ตั้งค่า environment variables
copy .env.example .env
# แก้ไขค่าใน .env ให้ตรงกับ environment ของคุณ

# 3. รัน setup script (สร้าง database + tables + seed data)
setup-db.bat

# 4. Import เกม (ถ้ามี game-store-catalog)
import-games.bat

# 5. Start development servers
npm run dev
```

---

### 🍎 macOS / Manual Setup

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. ตั้งค่า environment variables
cp .env.example .env
# แก้ไขค่าใน .env ให้ตรงกับ environment ของคุณ

# 3. สร้าง database
mysql -u root -p -e "CREATE DATABASE ninja_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. รัน schema
mysql -u root -p ninja_shop < packages/shared/src/db/schema.sql

# 5. รัน migrations
mysql -u root -p ninja_shop < packages/shared/src/db/migrate-add-prices.sql
mysql -u root -p ninja_shop < packages/shared/src/db/migrate-separate-status.sql

# 6. รัน seed data (admin user + settings)
npm run db:seed

# 7. Import เกม (ถ้ามี game-store-catalog)
npm run db:import-games

# 8. ลบเกมซ้ำ
npm run db:clean-games

# 9. Start development servers
npm run dev
```

---

## Available Scripts

### Development

```bash
# เริ่ม dev servers ทั้งหมด (customer + admin)
npm run dev

# เริ่มเฉพาะ customer
npm run dev --workspace=@ninja-shop/customer

# เริ่มเฉพาะ admin
npm run dev --workspace=@ninja-shop/admin
```

### Database

```bash
# Seed ข้อมูลใหม่ (ลบข้อมูลเก่าทั้งหมด)
npm run db:seed

# Import เกมจาก game-store-catalog
npm run db:import-games

# ลบเกมซ้ำ (Digital suffix + exact duplicates)
npm run db:clean-games

# สร้าง mock data สำหรับทดสอบ (20 ไอดี พร้อมเกมและสถานะการเช่า)
# Ubuntu/Linux:
chmod +x testdb.sh && ./testdb.sh

# Windows:
testdb.bat
```

### Build

```bash
# Build ทั้งหมด
npm run build

# Build เฉพาะ customer
npm run build --workspace=@ninja-shop/customer

# Build เฉพาะ admin
npm run build --workspace=@ninja-shop/admin
```

---

## URLs

| ส่วน | URL (Direct) | URL (ผ่าน nginx) |
|------|-------------|-----------------|
| Customer Website | http://localhost:7000 | http://app.localhost |
| Admin Dashboard | http://localhost:7001 | http://admin.localhost |

> **หมายเหตุ**: Server-side API calls ใช้ `INTERNAL_BASE_URL=http://localhost:7000` เสมอ (ไม่ผ่าน nginx)

📖 **คู่มือ Nginx**: [NGINX_SETUP.md](./NGINX_SETUP.md)

---

## Default Admin Account

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin1234` |

> เปลี่ยน password หลัง deploy production ทันที

---

## Project Structure

```
ninja-shop/
├── apps/
│   ├── customer/          # Customer Website (port 7000)
│   └── admin/             # Admin Dashboard (port 7001)
├── packages/
│   └── shared/            # Shared types, DB client, validators, theme
│       └── src/
│           ├── db/        # schema.sql, client.ts, seed.ts
│           ├── types/     # TypeScript interfaces
│           ├── validators/ # Zod schemas
│           └── theme/     # Colors, breakpoints
└── .env.example           # Environment variables template
```
