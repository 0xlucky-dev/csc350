/**
 * FILE: packages/shared/src/db/seed.ts
 * PURPOSE: Seed initial data for Ninja Shop database (idempotent)
 *
 * SEEDS:
 *   - rental_prices: ps5_own (฿150), ps5_shop (฿100), ps4 (฿80) — 30 days each
 *   - admin_users: username='admin', password='admin1234' (bcrypt, cost 10), role='super_admin'
 *   - settings: line_url (null), facebook_url (null)
 *
 * DEPENDENCIES:
 *   - bcryptjs: Password hashing
 *   - packages/shared/src/db/client.ts: MySQL connection pool
 *
 * RELATED FILES:
 *   - packages/shared/src/db/schema.sql: Must be applied before seeding
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 5.4, 10.1, 11.1
 */

import bcrypt from 'bcryptjs'
import pool from './client'

async function seed(): Promise<void> {
  const conn = await pool.getConnection()

  try {
    // Seed rental_prices
    await conn.query(`
      INSERT INTO rental_prices (rental_type, price, duration_days, description)
      VALUES
        ('ps5_own',  150.00, 30, 'PS5 (เครื่องตัวเอง)'),
        ('ps5_shop', 100.00, 30, 'PS5 (เครื่องร้าน)'),
        ('ps4',       80.00, 30, 'PS4')
      ON DUPLICATE KEY UPDATE
        price         = VALUES(price),
        duration_days = VALUES(duration_days),
        description   = VALUES(description)
    `)
    console.log('✅ Seeded rental_prices')

    // Seed admin_users
    const passwordHash = await bcrypt.hash('admin1234', 10)
    await conn.query(`
      INSERT INTO admin_users (username, password_hash, role)
      VALUES ('admin', ?, 'super_admin')
      ON DUPLICATE KEY UPDATE
        password_hash = VALUES(password_hash),
        role          = VALUES(role)
    `, [passwordHash])
    console.log('✅ Seeded admin_users')

    // Seed settings
    await conn.query(`
      INSERT INTO settings (setting_key, setting_value, description, data_type)
      VALUES
        ('contact_url', 'https://line.me/R/ti/p/@700pgxfz', 'Contact URL (LINE/Facebook/etc)', 'string'),
        ('line_url',     NULL, 'LINE contact URL (deprecated)',     'string'),
        ('facebook_url', NULL, 'Facebook contact URL (deprecated)', 'string')
      ON DUPLICATE KEY UPDATE
        description = VALUES(description),
        data_type   = VALUES(data_type)
    `)
    console.log('✅ Seeded settings')

    console.log('🎉 Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    conn.release()
  }
}

seed()
