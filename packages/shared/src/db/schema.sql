-- FILE: packages/shared/src/db/schema.sql
-- PURPOSE: MySQL database schema for Ninja Shop
-- SPEC: .kiro/specs/ninja-shop/design.md
-- Requirements: 14.1–14.9

CREATE TABLE IF NOT EXISTS accounts (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  account_number  VARCHAR(50) NOT NULL UNIQUE,
  account_name    VARCHAR(100),
  email           VARCHAR(255),
  password        VARCHAR(255),
  status          ENUM('available', 'rented') NOT NULL DEFAULT 'available',
  rented_until    DATE,
  renter_contact  VARCHAR(255),
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  title_en         VARCHAR(255),
  image_url        TEXT,
  thumbnail_url    TEXT,
  playstation_url  TEXT,
  genre            VARCHAR(100),
  release_date     DATE,
  description      TEXT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS account_games (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  account_id  INT NOT NULL,
  game_id     INT NOT NULL,
  added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_account_game (account_id, game_id),
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id)    REFERENCES games(id)    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rental_prices (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  rental_type   ENUM('ps5_own', 'ps5_shop', 'ps4') NOT NULL UNIQUE,
  price         DECIMAL(10, 2) NOT NULL,
  duration_days INT NOT NULL DEFAULT 30,
  description   TEXT,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email         VARCHAR(255),
  full_name     VARCHAR(100),
  role          ENUM('admin', 'super_admin') NOT NULL DEFAULT 'admin',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  last_login    TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  setting_key   VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  description   TEXT,
  data_type     ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
