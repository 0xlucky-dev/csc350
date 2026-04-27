/**
 * FILE: packages/shared/src/db/client.ts
 * PURPOSE: mysql2 connection pool for Ninja Shop database
 *
 * DEPENDENCIES:
 *   - mysql2/promise: MySQL client with promise support
 *   - env vars: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 *
 * RELATED FILES:
 *   - packages/shared/src/db/schema.sql: Database schema
 *   - packages/shared/src/db/seed.ts: Seed script
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 14.1
 */

import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     Number(process.env.DB_PORT ?? 3306),
  user:     process.env.DB_USER     ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME     ?? 'ninja_shop',
  waitForConnections: true,
  connectionLimit: 10,
})

export default pool
