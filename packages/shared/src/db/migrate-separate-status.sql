-- FILE: packages/shared/src/db/migrate-separate-status.sql
-- PURPOSE: Add separate rental status for each rental type
-- DATE: 2026-04-27

-- Add new columns (run manually if error "Duplicate column name")
ALTER TABLE accounts 
ADD COLUMN status_ps5_own ENUM('available', 'rented') NOT NULL DEFAULT 'available',
ADD COLUMN status_ps5_shop ENUM('available', 'rented') NOT NULL DEFAULT 'available',
ADD COLUMN status_ps4 ENUM('available', 'rented') NOT NULL DEFAULT 'available',
ADD COLUMN rented_until_ps5_own DATETIME NULL,
ADD COLUMN rented_until_ps5_shop DATETIME NULL,
ADD COLUMN rented_until_ps4 DATETIME NULL;
