-- Migration: Add price fields and datetime to accounts table
-- Also clean up duplicate games

-- 1. Add price fields to accounts table (only if not exists)
SET @exist_ps5_own = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'ninja_shop' 
    AND TABLE_NAME = 'accounts' 
    AND COLUMN_NAME = 'price_ps5_own'
);

SET @exist_ps5_shop = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'ninja_shop' 
    AND TABLE_NAME = 'accounts' 
    AND COLUMN_NAME = 'price_ps5_shop'
);

SET @exist_ps4 = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'ninja_shop' 
    AND TABLE_NAME = 'accounts' 
    AND COLUMN_NAME = 'price_ps4'
);

SET @sql1 = IF(@exist_ps5_own = 0, 
  'ALTER TABLE accounts ADD COLUMN price_ps5_own DECIMAL(10, 2) DEFAULT NULL COMMENT "ราคา PS5 ไอดีตัวเอง 30 วัน"',
  'SELECT "price_ps5_own already exists" AS message'
);

SET @sql2 = IF(@exist_ps5_shop = 0, 
  'ALTER TABLE accounts ADD COLUMN price_ps5_shop DECIMAL(10, 2) DEFAULT NULL COMMENT "ราคา PS5 ไอดีร้าน 30 วัน"',
  'SELECT "price_ps5_shop already exists" AS message'
);

SET @sql3 = IF(@exist_ps4 = 0, 
  'ALTER TABLE accounts ADD COLUMN price_ps4 DECIMAL(10, 2) DEFAULT NULL COMMENT "ราคา PS4 30 วัน"',
  'SELECT "price_ps4 already exists" AS message'
);

PREPARE stmt1 FROM @sql1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

PREPARE stmt3 FROM @sql3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- 2. Change rented_until from DATE to DATETIME (if needed)
SET @col_type = (
  SELECT DATA_TYPE 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'ninja_shop' 
    AND TABLE_NAME = 'accounts' 
    AND COLUMN_NAME = 'rented_until'
);

SET @sql4 = IF(@col_type = 'date', 
  'ALTER TABLE accounts MODIFY COLUMN rented_until DATETIME DEFAULT NULL COMMENT "วันและเวลาหมดอายุ"',
  'SELECT "rented_until is already DATETIME" AS message'
);

PREPARE stmt4 FROM @sql4;
EXECUTE stmt4;
DEALLOCATE PREPARE stmt4;

-- 3. Clean up duplicate games
-- Delete games with "Digital" suffix if non-Digital version exists
DELETE g1 FROM games g1
INNER JOIN games g2 ON REPLACE(g1.title, ' Digital', '') = g2.title
WHERE g1.title LIKE '% Digital' AND g1.id > g2.id;

-- Delete duplicate "Marvel's Spider-Man: Miles Morales" (keep only one)
DELETE FROM games 
WHERE title = "Marvel's Spider-Man: Miles Morales" 
AND id NOT IN (
  SELECT * FROM (
    SELECT MIN(id) FROM games WHERE title = "Marvel's Spider-Man: Miles Morales"
  ) AS temp
);

-- 4. Add index for better search performance (if not exists)
SET @exist_idx = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = 'ninja_shop' 
    AND TABLE_NAME = 'games' 
    AND INDEX_NAME = 'idx_title'
);

SET @sql5 = IF(@exist_idx = 0, 
  'CREATE INDEX idx_title ON games(title)',
  'SELECT "idx_title already exists" AS message'
);

PREPARE stmt5 FROM @sql5;
EXECUTE stmt5;
DEALLOCATE PREPARE stmt5;
