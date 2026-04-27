#!/bin/bash

###############################################################################
# FILE: testdb.sh
# PURPOSE: Create 20 mock accounts with games from real database
#          - ดึง game_id จาก DB ตามชื่อจริง
#          - แต่ละ account มีเกม 2-15 เกม ไม่ซ้ำกันในไอดีเดียวกัน
#          - มีทั้ง PS5 Own, PS5 Shop, PS4 rental
#
# USAGE: chmod +x testdb.sh && ./testdb.sh
###############################################################################

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; BLUE='\033[0;34m'; NC='\033[0m'
print_header() { echo -e "\n${BLUE}========================================\n$1\n========================================${NC}\n"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error()   { echo -e "${RED}❌ $1${NC}"; exit 1; }
print_info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }

[ ! -f .env ] && print_error ".env not found"

DB_HOST=$(grep ^DB_HOST .env | cut -d= -f2 | tr -d ' "')
DB_PORT=$(grep ^DB_PORT .env | cut -d= -f2 | tr -d ' "')
DB_USER=$(grep ^DB_USER .env | cut -d= -f2 | tr -d ' "')
DB_PASSWORD=$(grep ^DB_PASSWORD .env | cut -d= -f2 | tr -d ' "')
DB_NAME=$(grep ^DB_NAME .env | cut -d= -f2 | tr -d ' "')
M="mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME"

print_header "Creating Mock Data for Ninja Shop"
print_info "Database: $DB_NAME | User: $DB_USER"

# ตรวจสอบเกมใน DB
GAME_COUNT=$($M -sN -e "SELECT COUNT(*) FROM games;" 2>/dev/null || echo 0)
[ "$GAME_COUNT" -lt 5 ] && print_error "มีเกมใน DB แค่ $GAME_COUNT รายการ กรุณา import games ก่อน: npm run db:import-games --workspace=@ninja-shop/shared"
print_info "พบเกมใน database: $GAME_COUNT รายการ"

# Clear existing accounts
print_info "Clearing existing accounts..."
$M -e "DELETE FROM account_games; DELETE FROM accounts;" 2>/dev/null
print_success "Cleared"

print_info "Creating 20 accounts..."

# Helper: get game_id by title (returns 0 if not found)
get_id() {
  $M -sN -e "SELECT COALESCE(id,0) FROM games WHERE title='$1' LIMIT 1;" 2>/dev/null || echo 0
}

# Helper: insert account, returns inserted id
insert_account() {
  # $1=num $2=own $3=shop $4=ps4 $5=status_own $6=status_shop $7=status_ps4 $8=days_own $9=days_shop $10=days_ps4
  local NUM=$1 OWN=$2 SHOP=$3 PS4=$4 S_OWN=$5 S_SHOP=$6 S_PS4=$7 D_OWN=$8 D_SHOP=$9 D_PS4=${10}
  local U_OWN="NULL" U_SHOP="NULL" U_PS4="NULL"
  [ "$S_OWN"  = "rented" ] && U_OWN="DATE_ADD(NOW(), INTERVAL $D_OWN DAY)"
  [ "$S_SHOP" = "rented" ] && U_SHOP="DATE_ADD(NOW(), INTERVAL $D_SHOP DAY)"
  [ "$S_PS4"  = "rented" ] && U_PS4="DATE_ADD(NOW(), INTERVAL $D_PS4 DAY)"

  $M -sN -e "
    INSERT INTO accounts (account_number,price_ps5_own,price_ps5_shop,price_ps4,
      status_ps5_own,status_ps5_shop,status_ps4,
      rented_until_ps5_own,rented_until_ps5_shop,rented_until_ps4)
    VALUES ('$NUM',$OWN,$SHOP,$PS4,'$S_OWN','$S_SHOP','$S_PS4',$U_OWN,$U_SHOP,$U_PS4);
    SELECT LAST_INSERT_ID();
  " 2>/dev/null | tail -1
}

# Helper: link games to account (skip if game not found)
add_games() {
  local AID=$1; shift
  for TITLE in "$@"; do
    local GID=$(get_id "$TITLE")
    [ "$GID" != "0" ] && $M -e "INSERT IGNORE INTO account_games (account_id,game_id) VALUES ($AID,$GID);" 2>/dev/null
  done
}

# ── Account 1: PS5 Own rented 25 วัน ──────────────────────────────────────
AID=$(insert_account 1 450 300 250 rented available available 25 0 0)
add_games $AID "Elden Ring" "God of War Ragnarök" "Marvel's Spider-Man 2" "Baldur's Gate 3" "Final Fantasy 7 Rebirth"

# ── Account 2: PS5 Shop rented 18 วัน ─────────────────────────────────────
AID=$(insert_account 2 500 350 280 available rented available 0 18 0)
add_games $AID "Ghost of Yōtei" "Assassin's Creed Shadows" "Monster Hunter Wilds" "Death Stranding 2: On the Beach" "Clair Obscur: Expedition 33" "Metaphor: ReFantazio" "Dragon Age: The Veilguard" "Kingdom Come: Deliverance 2"

# ── Account 3: ว่างทุกประเภท ──────────────────────────────────────────────
AID=$(insert_account 3 550 380 300 available available available 0 0 0)
add_games $AID "Resident Evil 4" "Resident Evil Requiem" "Demon's Souls" "Returnal" "Helldivers 2" "Gran Turismo 7" "Horizon Forbidden West" "Astro Bot" "Marvel's Spider-Man: Miles Morales" "Grand Theft Auto V" "Tony Hawk's Pro Skater 3 + 4" "Arc Raiders"

# ── Account 4: PS4 rented 22 วัน ──────────────────────────────────────────
AID=$(insert_account 4 420 280 220 available available rented 0 0 22)
add_games $AID "The Elder Scrolls 4: Oblivion Remastered" "Baldur's Gate 3" "Metaphor: ReFantazio" "Dragon Age: The Veilguard" "Monster Hunter Stories 3: Twisted Reflection" "Final Fantasy 7 Rebirth"

# ── Account 5: PS5 Own + PS5 Shop rented ──────────────────────────────────
AID=$(insert_account 5 520 360 290 rented rented available 15 20 0)
add_games $AID "Elden Ring" "God of War Ragnarök" "Marvel's Spider-Man 2" "Ghost of Yōtei" "Assassin's Creed Shadows" "Monster Hunter Wilds" "Resident Evil 4" "Demon's Souls" "Returnal" "Helldivers 2"

# ── Account 6: ทุกประเภท rented ───────────────────────────────────────────
AID=$(insert_account 6 400 270 210 rented rented rented 28 25 30)
add_games $AID "Resident Evil 4" "Resident Evil Requiem" "Demon's Souls" "Returnal"

# ── Account 7: ว่างทุกประเภท ──────────────────────────────────────────────
AID=$(insert_account 7 480 320 260 available available available 0 0 0)
add_games $AID "Ghost of Yōtei" "Assassin's Creed Shadows" "Monster Hunter Wilds" "Death Stranding 2: On the Beach" "Marvel's Spider-Man 2" "God of War Ragnarök" "Elden Ring"

# ── Account 8: PS5 Own rented 17 วัน ──────────────────────────────────────
AID=$(insert_account 8 600 420 340 rented available available 17 0 0)
add_games $AID "Elden Ring" "God of War Ragnarök" "Marvel's Spider-Man 2" "Baldur's Gate 3" "Final Fantasy 7 Rebirth" "Ghost of Yōtei" "Assassin's Creed Shadows" "Monster Hunter Wilds" "Death Stranding 2: On the Beach" "Clair Obscur: Expedition 33" "Metaphor: ReFantazio" "Dragon Age: The Veilguard" "Kingdom Come: Deliverance 2" "Resident Evil 4" "Demon's Souls"

# ── Account 9: PS4 rented 24 วัน ──────────────────────────────────────────
AID=$(insert_account 9 380 250 190 available available rented 0 0 24)
add_games $AID "Grand Theft Auto V" "Marvel's Spider-Man: Miles Morales" "Astro Bot"

# ── Account 10: PS5 Shop rented 19 วัน ────────────────────────────────────
AID=$(insert_account 10 510 340 270 available rented available 0 19 0)
add_games $AID "The Elder Scrolls 4: Oblivion Remastered" "Baldur's Gate 3" "Metaphor: ReFantazio" "Dragon Age: The Veilguard" "Elden Ring" "God of War Ragnarök" "Marvel's Spider-Man 2" "Ghost of Yōtei" "Assassin's Creed Shadows"

# ── Account 11: ว่างทุกประเภท ─────────────────────────────────────────────
AID=$(insert_account 11 540 370 295 available available available 0 0 0)
add_games $AID "Gran Turismo 7" "Helldivers 2" "Returnal" "Horizon Forbidden West" "Death Stranding 2: On the Beach" "Marvel's Spider-Man 2" "Astro Bot" "Tony Hawk's Pro Skater 3 + 4" "Arc Raiders" "Pragmata" "Hollow Knight Silksong"

# ── Account 12: PS5 Own + PS4 rented ──────────────────────────────────────
AID=$(insert_account 12 430 290 230 rented available rented 21 0 26)
add_games $AID "Romeo is a Dead Man" "Dispatch" "Sword of the Sea" "Ghost of Yōtei" "Clair Obscur: Expedition 33"

# ── Account 13: PS5 Shop rented 16 วัน ────────────────────────────────────
AID=$(insert_account 13 490 330 265 available rented available 0 16 0)
add_games $AID "Helldivers 2" "Arc Raiders" "Monster Hunter Wilds" "Assassin's Creed Shadows" "Ghost of Yōtei" "Marvel's Spider-Man 2" "God of War Ragnarök" "Elden Ring"

# ── Account 14: ว่างทุกประเภท ─────────────────────────────────────────────
AID=$(insert_account 14 460 310 245 available available available 0 0 0)
add_games $AID "Sword of the Sea" "Hollow Knight Silksong" "Horizon Forbidden West" "Death Stranding 2: On the Beach" "Astro Bot" "Pragmata"

# ── Account 15: PS5 Own rented 23 วัน ─────────────────────────────────────
AID=$(insert_account 15 570 400 320 rented available available 23 0 0)
add_games $AID "Elden Ring" "God of War Ragnarök" "Marvel's Spider-Man 2" "Baldur's Gate 3" "Final Fantasy 7 Rebirth" "The Elder Scrolls 4: Oblivion Remastered" "Metaphor: ReFantazio" "Dragon Age: The Veilguard" "Kingdom Come: Deliverance 2" "Resident Evil 4" "Demon's Souls" "Returnal" "Helldivers 2"

# ── Account 16: PS4 rented 27 วัน ─────────────────────────────────────────
AID=$(insert_account 16 390 260 200 available available rented 0 0 27)
add_games $AID "Gran Turismo 7" "Tony Hawk's Pro Skater 3 + 4" "Astro Bot" "Marvel's Spider-Man: Miles Morales"

# ── Account 17: ทุกประเภท rented ใกล้หมด ─────────────────────────────────
AID=$(insert_account 17 530 350 280 rented rented rented 2 3 1)
add_games $AID "Ghost of Yōtei" "Assassin's Creed Shadows" "Monster Hunter Wilds" "Death Stranding 2: On the Beach" "Clair Obscur: Expedition 33" "Marvel's Spider-Man 2" "God of War Ragnarök" "Elden Ring" "Baldur's Gate 3" "Final Fantasy 7 Rebirth"

# ── Account 18: PS5 Shop rented 20 วัน ────────────────────────────────────
AID=$(insert_account 18 470 315 250 available rented available 0 20 0)
add_games $AID "Resident Evil 4" "Resident Evil Requiem" "Demon's Souls" "Returnal" "Elden Ring" "God of War Ragnarök" "Marvel's Spider-Man 2"

# ── Account 19: ว่างทุกประเภท ─────────────────────────────────────────────
AID=$(insert_account 19 580 410 330 available available available 0 0 0)
add_games $AID "Elden Ring" "God of War Ragnarök" "Marvel's Spider-Man 2" "Baldur's Gate 3" "Final Fantasy 7 Rebirth" "Ghost of Yōtei" "Assassin's Creed Shadows" "Monster Hunter Wilds" "Gran Turismo 7" "Helldivers 2" "Horizon Forbidden West" "Death Stranding 2: On the Beach" "Astro Bot" "Grand Theft Auto V"

# ── Account 20: PS5 Own + PS5 Shop rented 29/30 วัน ──────────────────────
AID=$(insert_account 20 520 360 290 rented rented available 29 30 0)
add_games $AID "Romeo is a Dead Man" "Dispatch" "Sword of the Sea" "Ghost of Yōtei" "Clair Obscur: Expedition 33" "Assassin's Creed Shadows" "Monster Hunter Wilds" "Death Stranding 2: On the Beach" "Kingdom Come: Deliverance 2"

print_success "Created 20 accounts"

print_header "Summary"
TOTAL=$($M -sN -e "SELECT COUNT(*) FROM accounts;" 2>/dev/null)
RENTED=$($M -sN -e "SELECT COUNT(*) FROM accounts WHERE status_ps5_own='rented' OR status_ps5_shop='rented' OR status_ps4='rented';" 2>/dev/null)
echo -e "  Total   : ${BLUE}$TOTAL${NC}"
echo -e "  Rented  : ${RED}$RENTED${NC}"
echo -e "  Available: ${GREEN}$((TOTAL-RENTED))${NC}"
print_success "Done! 🎮"
