-- FILE: packages/shared/src/db/migrate-separate-status.sql
-- PURPOSE: Add separate rental status for each rental type
-- DATE: 2026-04-27

-- Add new columns for separate rental status
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS status_ps5_own ENUM('available', 'rented') NOT NULL DEFAULT 'available',
ADD COLUMN IF NOT EXISTS status_ps5_shop ENUM('available', 'rented') NOT NULL DEFAULT 'available',
ADD COLUMN IF NOT EXISTS status_ps4 ENUM('available', 'rented') NOT NULL DEFAULT 'available',
ADD COLUMN IF NOT EXISTS rented_until_ps5_own DATETIME NULL,
ADD COLUMN IF NOT EXISTS rented_until_ps5_shop DATETIME NULL,
ADD COLUMN IF NOT EXISTS rented_until_ps4 DATETIME NULL;

-- Keep old columns for backward compatibility (will be removed later)
-- status and rented_until columns remain
