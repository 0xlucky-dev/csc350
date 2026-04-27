#!/bin/bash

###############################################################################
# FILE: testdb.sh
# PURPOSE: Create mock data for Ninja Shop (20 accounts with random games from DB)
#
# USAGE: chmod +x testdb.sh && ./testdb.sh
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() { echo -e "\n${BLUE}========================================${NC}\n${BLUE}$1${NC}\n${BLUE}========================================${NC}\n"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error()   { echo -e "${RED}❌ $1${NC}"; }
print_info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }

if [ ! -f .env ]; then print_error ".env not found"; exit 1; fi

DB_HOST=$(grep ^DB_HOST .env | cut -d= -f2 | tr -d ' "')
DB_PORT=$(grep ^DB_PORT .env | cut -d= -f2 | tr -d ' "')
DB_USER=$(grep ^DB_USER .env | cut -d= -f2 | tr -d ' "')
DB_PASSWORD=$(grep ^DB_PASSWORD .env | cut -d= -f2 | tr -d ' "')
DB_NAME=$(grep ^DB_NAME .env | cut -d= -f2 | tr -d ' "')

MYSQL="mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME"

print_header "Creating Mock Data for Ninja Shop"
print_info "Database: $DB_NAME | User: $DB_USER | Host: $DB_HOST:$DB_PORT"

# ตรวจสอบว่ามีเกมใน DB
GAME_COUNT=$($MYSQL -sN -e "SELECT COUNT(*) FROM games;" 2>/dev/null)
if [ "$GAME_COUNT" -lt 10 ]; then
    print_error "มีเกมใน database แค่ $GAME_COUNT รายการ กรุณา import games ก่อน:"
    echo "  npm run db:import-games --workspace=@ninja-shop/shared"
    exit 1
fi
print_info "พบเกมใน database: $GAME_COUNT รายการ"

# Clear existing accounts
print_info "Clearing existing accounts..."
$MYSQL -e "DELETE FROM account_games; DELETE FROM accounts;" 2>/dev/null
print_success "Cleared"

# สร้าง 20 accounts โดยดึง game_id จาก DB จริงๆ แบบ random
print_info "Creating 20 accounts with random games from database..."

$MYSQL 2>/dev/null << 'ENDSQL'
-- สร้าง stored procedure สำหรับ insert account + random games
DROP PROCEDURE IF EXISTS create_mock_account;

DELIMITER //
CREATE PROCEDURE create_mock_account(
  IN p_num INT,
  IN p_price_own DECIMAL(10,2),
  IN p_price_shop DECIMAL(10,2),
  IN p_price_ps4 DECIMAL(10,2),
  IN p_status_own VARCHAR(20),
  IN p_status_shop VARCHAR(20),
  IN p_status_ps4 VARCHAR(20),
  IN p_days_own INT,
  IN p_days_shop INT,
  IN p_days_ps4 INT,
  IN p_game_count INT
)
BEGIN
  DECLARE v_account_id INT;
  DECLARE v_until_own DATETIME DEFAULT NULL;
  DECLARE v_until_shop DATETIME DEFAULT NULL;
  DECLARE v_until_ps4 DATETIME DEFAULT NULL;

  IF p_status_own = 'rented' THEN SET v_until_own = DATE_ADD(NOW(), INTERVAL p_days_own DAY); END IF;
  IF p_status_shop = 'rented' THEN SET v_until_shop = DATE_ADD(NOW(), INTERVAL p_days_shop DAY); END IF;
  IF p_status_ps4 = 'rented' THEN SET v_until_ps4 = DATE_ADD(NOW(), INTERVAL p_days_ps4 DAY); END IF;

  INSERT INTO accounts (
    account_number, price_ps5_own, price_ps5_shop, price_ps4,
    status_ps5_own, status_ps5_shop, status_ps4,
    rented_until_ps5_own, rented_until_ps5_shop, rented_until_ps4
  ) VALUES (
    p_num, p_price_own, p_price_shop, p_price_ps4,
    p_status_own, p_status_shop, p_status_ps4,
    v_until_own, v_until_shop, v_until_ps4
  );

  SET v_account_id = LAST_INSERT_ID();

  -- เพิ่มเกม random จาก DB จริง
  INSERT IGNORE INTO account_games (account_id, game_id)
    SELECT v_account_id, id FROM games
    WHERE image_url IS NOT NULL AND image_url != ''
    ORDER BY RAND()
    LIMIT p_game_count;
END //
DELIMITER ;

-- สร้าง 20 accounts
CALL create_mock_account(1,  450, 300, 250, 'rented',    'available', 'available', 25, 0,  0,  5);
CALL create_mock_account(2,  500, 350, 280, 'available', 'rented',    'available', 0,  18, 0,  8);
CALL create_mock_account(3,  550, 380, 300, 'available', 'available', 'available', 0,  0,  0,  12);
CALL create_mock_account(4,  420, 280, 220, 'available', 'available', 'rented',    0,  0,  22, 6);
CALL create_mock_account(5,  520, 360, 290, 'rented',    'rented',    'available', 15, 20, 0,  10);
CALL create_mock_account(6,  400, 270, 210, 'rented',    'rented',    'rented',    28, 25, 30, 4);
CALL create_mock_account(7,  480, 320, 260, 'available', 'available', 'available', 0,  0,  0,  7);
CALL create_mock_account(8,  600, 420, 340, 'rented',    'available', 'available', 17, 0,  0,  15);
CALL create_mock_account(9,  380, 250, 190, 'available', 'available', 'rented',    0,  0,  24, 3);
CALL create_mock_account(10, 510, 340, 270, 'available', 'rented',    'available', 0,  19, 0,  9);
CALL create_mock_account(11, 540, 370, 295, 'available', 'available', 'available', 0,  0,  0,  11);
CALL create_mock_account(12, 430, 290, 230, 'rented',    'available', 'rented',    21, 0,  26, 5);
CALL create_mock_account(13, 490, 330, 265, 'available', 'rented',    'available', 0,  16, 0,  8);
CALL create_mock_account(14, 460, 310, 245, 'available', 'available', 'available', 0,  0,  0,  6);
CALL create_mock_account(15, 570, 400, 320, 'rented',    'available', 'available', 23, 0,  0,  13);
CALL create_mock_account(16, 390, 260, 200, 'available', 'available', 'rented',    0,  0,  27, 4);
CALL create_mock_account(17, 530, 350, 280, 'rented',    'rented',    'rented',    2,  3,  1,  10);
CALL create_mock_account(18, 470, 315, 250, 'available', 'rented',    'available', 0,  20, 0,  7);
CALL create_mock_account(19, 580, 410, 330, 'available', 'available', 'available', 0,  0,  0,  14);
CALL create_mock_account(20, 520, 360, 290, 'rented',    'rented',    'available', 29, 30, 0,  9);

DROP PROCEDURE IF EXISTS create_mock_account;
ENDSQL

print_success "Created 20 accounts with random games from database"

print_header "Summary"
TOTAL=$($MYSQL -sN -e "SELECT COUNT(*) FROM accounts;" 2>/dev/null)
RENTED=$($MYSQL -sN -e "SELECT COUNT(*) FROM accounts WHERE status_ps5_own='rented' OR status_ps5_shop='rented' OR status_ps4='rented';" 2>/dev/null)
echo -e "  Total Accounts : ${BLUE}$TOTAL${NC}"
echo -e "  Rented         : ${RED}$RENTED${NC}"
echo -e "  Available      : ${GREEN}$((TOTAL - RENTED))${NC}"
print_success "Done! 🎮"
