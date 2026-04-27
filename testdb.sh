#!/bin/bash

###############################################################################
# FILE: testdb.sh
# PURPOSE: Create mock data for Ninja Shop (20 accounts with games)
#          - 20 accounts with 3-15 games each
#          - Mixed rental status (PS5 Own, PS5 Shop, PS4)
#          - Realistic prices and rental periods (15-30 days)
#
# USAGE: chmod +x testdb.sh && ./testdb.sh
#
# SPEC: .kiro/specs/ninja-shop/design.md
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Load .env
if [ ! -f .env ]; then
    print_error ".env file not found"
    exit 1
fi

DB_HOST=$(grep DB_HOST .env | cut -d '=' -f2 | tr -d ' "' || echo "localhost")
DB_PORT=$(grep DB_PORT .env | cut -d '=' -f2 | tr -d ' "' || echo "3306")
DB_USER=$(grep DB_USER .env | cut -d '=' -f2 | tr -d ' "' || echo "root")
DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2 | tr -d ' "' || echo "")
DB_NAME=$(grep DB_NAME .env | cut -d '=' -f2 | tr -d ' "' || echo "ninja_shop")

print_header "Creating Mock Data for Ninja Shop"

print_info "Database: $DB_NAME"
print_info "User: $DB_USER"
print_info "Host: $DB_HOST:$DB_PORT"

# Function to execute SQL
execute_sql() {
    if [ -z "$DB_PASSWORD" ]; then
        sudo mysql -u root "$DB_NAME" -e "$1" 2>/dev/null || mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" -e "$1"
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "$1"
    fi
}

# Clear existing data
print_info "Clearing existing accounts..."
execute_sql "DELETE FROM account_games;"
execute_sql "DELETE FROM accounts;"
print_success "Cleared existing accounts"

# Insert games first (if not exists)
print_info "Ensuring games exist..."

execute_sql "INSERT IGNORE INTO games (title, title_en, genre, image_url) VALUES
('Romeo is a Dead Man', 'Romeo is a Dead Man', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example1.png'),
('Dispatch', 'Dispatch', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example2.png'),
('Sword of the Sea', 'Sword of the Sea', 'Adventure', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example3.png'),
('Tony Hawk''s Pro Skater 3 + 4', 'Tony Hawk''s Pro Skater 3 + 4', 'Sports', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example4.png'),
('Ghost of Yōtei', 'Ghost of Yōtei', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example5.png'),
('Clair Obscur: Expedition 33', 'Clair Obscur: Expedition 33', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example6.png'),
('Assassin''s Creed Shadows', 'Assassin''s Creed Shadows', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example7.png'),
('Monster Hunter Wilds', 'Monster Hunter Wilds', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example8.png'),
('Arc Raiders', 'Arc Raiders', 'Shooter', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example9.png'),
('Kingdom Come: Deliverance 2', 'Kingdom Come: Deliverance 2', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example10.png'),
('Metaphor: ReFantazio', 'Metaphor: ReFantazio', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example11.png'),
('Dragon Age: The Veilguard', 'Dragon Age: The Veilguard', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example12.png'),
('The Elder Scrolls 4: Oblivion Remastered', 'The Elder Scrolls 4: Oblivion Remastered', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example13.png'),
('Resident Evil 4', 'Resident Evil 4', 'Horror', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example14.png'),
('Baldur''s Gate 3', 'Baldur''s Gate 3', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example15.png'),
('Pragmata', 'Pragmata', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example16.png'),
('Hollow Knight Silksong', 'Hollow Knight Silksong', 'Adventure', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example17.png'),
('Demon''s Souls', 'Demon''s Souls', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example18.png'),
('Monster Hunter Stories 3: Twisted Reflection', 'Monster Hunter Stories 3: Twisted Reflection', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example19.png'),
('Gran Turismo 7', 'Gran Turismo 7', 'Racing', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example20.png'),
('Helldivers 2', 'Helldivers 2', 'Shooter', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example21.png'),
('Resident Evil Requiem', 'Resident Evil Requiem', 'Horror', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example22.png'),
('Final Fantasy 7 Rebirth', 'Final Fantasy 7 Rebirth', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example23.png'),
('Returnal', 'Returnal', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example24.png'),
('Horizon Forbidden West', 'Horizon Forbidden West', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example25.png'),
('Death Stranding 2: On the Beach', 'Death Stranding 2: On the Beach', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example26.png'),
('Marvel''s Spider-Man 2', 'Marvel''s Spider-Man 2', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example27.png'),
('Astro Bot', 'Astro Bot', 'Platform', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example28.png'),
('Elden Ring', 'Elden Ring', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example29.png'),
('God of War Ragnarök', 'God of War Ragnarök', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example30.png'),
('Grand Theft Auto V', 'Grand Theft Auto V', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example31.png'),
('Marvel''s Spider-Man: Miles Morales', 'Marvel''s Spider-Man: Miles Morales', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example32.png');"

print_success "Games ensured"

# Create 20 accounts with random games and rental status
print_info "Creating 20 accounts with mock data..."

# Account 1: 5 games, PS5 Own rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, notes) VALUES 
('1', 450.00, 300.00, 250.00, 'rented', 'available', 'available', DATE_ADD(NOW(), INTERVAL 25 DAY), 'ไอดีเกมดัง');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 1, id FROM games WHERE title IN ('Elden Ring', 'God of War Ragnarök', 'Marvel''s Spider-Man 2', 'Baldur''s Gate 3', 'Final Fantasy 7 Rebirth');"

# Account 2: 8 games, PS5 Shop rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_shop, notes) VALUES 
('2', 500.00, 350.00, 280.00, 'available', 'rented', 'available', DATE_ADD(NOW(), INTERVAL 18 DAY), 'เกมใหม่ล่าสุด');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 2, id FROM games WHERE title IN ('Ghost of Yōtei', 'Assassin''s Creed Shadows', 'Monster Hunter Wilds', 'Death Stranding 2: On the Beach', 'Clair Obscur: Expedition 33', 'Metaphor: ReFantazio', 'Dragon Age: The Veilguard', 'Kingdom Come: Deliverance 2');"

# Account 3: 12 games, All available
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, notes) VALUES 
('3', 550.00, 380.00, 300.00, 'available', 'available', 'available', 'เกมเยอะสุด');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 3, id FROM games WHERE title IN ('Resident Evil 4', 'Resident Evil Requiem', 'Demon''s Souls', 'Returnal', 'Helldivers 2', 'Gran Turismo 7', 'Horizon Forbidden West', 'Astro Bot', 'Marvel''s Spider-Man: Miles Morales', 'Grand Theft Auto V', 'Tony Hawk''s Pro Skater 3 + 4', 'Arc Raiders');"

# Account 4: 6 games, PS4 rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps4, notes) VALUES 
('4', 420.00, 280.00, 220.00, 'available', 'available', 'rented', DATE_ADD(NOW(), INTERVAL 22 DAY), 'เกม RPG');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 4, id FROM games WHERE title IN ('The Elder Scrolls 4: Oblivion Remastered', 'Baldur''s Gate 3', 'Metaphor: ReFantazio', 'Dragon Age: The Veilguard', 'Monster Hunter Stories 3: Twisted Reflection', 'Final Fantasy 7 Rebirth');"

# Account 5: 10 games, PS5 Own + PS5 Shop rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, rented_until_ps5_shop, notes) VALUES 
('5', 520.00, 360.00, 290.00, 'rented', 'rented', 'available', DATE_ADD(NOW(), INTERVAL 15 DAY), DATE_ADD(NOW(), INTERVAL 20 DAY), 'เกมหลากหลาย');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 5, id FROM games WHERE title IN ('Elden Ring', 'God of War Ragnarök', 'Marvel''s Spider-Man 2', 'Ghost of Yōtei', 'Assassin''s Creed Shadows', 'Monster Hunter Wilds', 'Resident Evil 4', 'Demon''s Souls', 'Returnal', 'Helldivers 2');"

# Account 6: 4 games, All rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, rented_until_ps5_shop, rented_until_ps4, notes) VALUES 
('6', 400.00, 270.00, 210.00, 'rented', 'rented', 'rented', DATE_ADD(NOW(), INTERVAL 28 DAY), DATE_ADD(NOW(), INTERVAL 25 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), 'เกมสยองขวัญ');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 6, id FROM games WHERE title IN ('Resident Evil 4', 'Resident Evil Requiem', 'Demon''s Souls', 'Returnal');"

# Account 7: 7 games, Available
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, notes) VALUES 
('7', 480.00, 320.00, 260.00, 'available', 'available', 'available', 'เกมแอคชั่น');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 7, id FROM games WHERE title IN ('Ghost of Yōtei', 'Assassin''s Creed Shadows', 'Monster Hunter Wilds', 'Death Stranding 2: On the Beach', 'Marvel''s Spider-Man 2', 'God of War Ragnarök', 'Elden Ring');"

# Account 8: 15 games, PS5 Own rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, notes) VALUES 
('8', 600.00, 420.00, 340.00, 'rented', 'available', 'available', DATE_ADD(NOW(), INTERVAL 17 DAY), 'คอลเลคชั่นใหญ่');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 8, id FROM games WHERE title IN ('Elden Ring', 'God of War Ragnarök', 'Marvel''s Spider-Man 2', 'Baldur''s Gate 3', 'Final Fantasy 7 Rebirth', 'Ghost of Yōtei', 'Assassin''s Creed Shadows', 'Monster Hunter Wilds', 'Death Stranding 2: On the Beach', 'Clair Obscur: Expedition 33', 'Metaphor: ReFantazio', 'Dragon Age: The Veilguard', 'Kingdom Come: Deliverance 2', 'Resident Evil 4', 'Demon''s Souls');"

# Account 9: 3 games, PS4 rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps4, notes) VALUES 
('9', 380.00, 250.00, 190.00, 'available', 'available', 'rented', DATE_ADD(NOW(), INTERVAL 24 DAY), 'เกมน้อยแต่ดี');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 9, id FROM games WHERE title IN ('Grand Theft Auto V', 'Marvel''s Spider-Man: Miles Morales', 'Astro Bot');"

# Account 10: 9 games, PS5 Shop rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_shop, notes) VALUES 
('10', 510.00, 340.00, 270.00, 'available', 'rented', 'available', DATE_ADD(NOW(), INTERVAL 19 DAY), 'เกมแนว RPG + Action');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 10, id FROM games WHERE title IN ('The Elder Scrolls 4: Oblivion Remastered', 'Baldur''s Gate 3', 'Metaphor: ReFantazio', 'Dragon Age: The Veilguard', 'Elden Ring', 'God of War Ragnarök', 'Marvel''s Spider-Man 2', 'Ghost of Yōtei', 'Assassin''s Creed Shadows');"

# Account 11: 11 games, Available
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, notes) VALUES 
('11', 540.00, 370.00, 295.00, 'available', 'available', 'available', 'เกมหลากหลายแนว');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 11, id FROM games WHERE title IN ('Gran Turismo 7', 'Helldivers 2', 'Returnal', 'Horizon Forbidden West', 'Death Stranding 2: On the Beach', 'Marvel''s Spider-Man 2', 'Astro Bot', 'Tony Hawk''s Pro Skater 3 + 4', 'Arc Raiders', 'Pragmata', 'Hollow Knight Silksong');"

# Account 12: 5 games, PS5 Own + PS4 rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, rented_until_ps4, notes) VALUES 
('12', 430.00, 290.00, 230.00, 'rented', 'available', 'rented', DATE_ADD(NOW(), INTERVAL 21 DAY), DATE_ADD(NOW(), INTERVAL 26 DAY), 'เกมใหม่');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 12, id FROM games WHERE title IN ('Romeo is a Dead Man', 'Dispatch', 'Sword of the Sea', 'Ghost of Yōtei', 'Clair Obscur: Expedition 33');"

# Account 13: 8 games, PS5 Shop rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_shop, notes) VALUES 
('13', 490.00, 330.00, 265.00, 'available', 'rented', 'available', DATE_ADD(NOW(), INTERVAL 16 DAY), 'เกมแนว Shooter + Action');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 13, id FROM games WHERE title IN ('Helldivers 2', 'Arc Raiders', 'Monster Hunter Wilds', 'Assassin''s Creed Shadows', 'Ghost of Yōtei', 'Marvel''s Spider-Man 2', 'God of War Ragnarök', 'Elden Ring');"

# Account 14: 6 games, All available
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, notes) VALUES 
('14', 460.00, 310.00, 245.00, 'available', 'available', 'available', 'เกมแนว Adventure');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 14, id FROM games WHERE title IN ('Sword of the Sea', 'Hollow Knight Silksong', 'Horizon Forbidden West', 'Death Stranding 2: On the Beach', 'Astro Bot', 'Pragmata');"

# Account 15: 13 games, PS5 Own rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, notes) VALUES 
('15', 570.00, 400.00, 320.00, 'rented', 'available', 'available', DATE_ADD(NOW(), INTERVAL 23 DAY), 'คอลเลคชั่นครบ');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 15, id FROM games WHERE title IN ('Elden Ring', 'God of War Ragnarök', 'Marvel''s Spider-Man 2', 'Baldur''s Gate 3', 'Final Fantasy 7 Rebirth', 'The Elder Scrolls 4: Oblivion Remastered', 'Metaphor: ReFantazio', 'Dragon Age: The Veilguard', 'Kingdom Come: Deliverance 2', 'Resident Evil 4', 'Demon''s Souls', 'Returnal', 'Helldivers 2');"

# Account 16: 4 games, PS4 rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps4, notes) VALUES 
('16', 390.00, 260.00, 200.00, 'available', 'available', 'rented', DATE_ADD(NOW(), INTERVAL 27 DAY), 'เกมแนว Racing + Sports');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 16, id FROM games WHERE title IN ('Gran Turismo 7', 'Tony Hawk''s Pro Skater 3 + 4', 'Astro Bot', 'Marvel''s Spider-Man: Miles Morales');"

# Account 17: 10 games, All rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, rented_until_ps5_shop, rented_until_ps4, notes) VALUES 
('17', 530.00, 350.00, 280.00, 'rented', 'rented', 'rented', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY), 'ใกล้หมดอายุ');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 17, id FROM games WHERE title IN ('Ghost of Yōtei', 'Assassin''s Creed Shadows', 'Monster Hunter Wilds', 'Death Stranding 2: On the Beach', 'Clair Obscur: Expedition 33', 'Marvel''s Spider-Man 2', 'God of War Ragnarök', 'Elden Ring', 'Baldur''s Gate 3', 'Final Fantasy 7 Rebirth');"

# Account 18: 7 games, PS5 Shop rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_shop, notes) VALUES 
('18', 470.00, 315.00, 250.00, 'available', 'rented', 'available', DATE_ADD(NOW(), INTERVAL 20 DAY), 'เกมแนว Horror + Action');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 18, id FROM games WHERE title IN ('Resident Evil 4', 'Resident Evil Requiem', 'Demon''s Souls', 'Returnal', 'Elden Ring', 'God of War Ragnarök', 'Marvel''s Spider-Man 2');"

# Account 19: 14 games, Available
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, notes) VALUES 
('19', 580.00, 410.00, 330.00, 'available', 'available', 'available', 'เกมครบทุกแนว');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 19, id FROM games WHERE title IN ('Elden Ring', 'God of War Ragnarök', 'Marvel''s Spider-Man 2', 'Baldur''s Gate 3', 'Final Fantasy 7 Rebirth', 'Ghost of Yōtei', 'Assassin''s Creed Shadows', 'Monster Hunter Wilds', 'Gran Turismo 7', 'Helldivers 2', 'Horizon Forbidden West', 'Death Stranding 2: On the Beach', 'Astro Bot', 'Grand Theft Auto V');"

# Account 20: 9 games, PS5 Own + PS5 Shop rented
execute_sql "INSERT INTO accounts (account_number, price_ps5_own, price_ps5_shop, price_ps4, status_ps5_own, status_ps5_shop, status_ps4, rented_until_ps5_own, rented_until_ps5_shop, notes) VALUES 
('20', 520.00, 360.00, 290.00, 'rented', 'rented', 'available', DATE_ADD(NOW(), INTERVAL 29 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), 'เกมใหม่ล่าสุด 2026');"
execute_sql "INSERT INTO account_games (account_id, game_id) SELECT 20, id FROM games WHERE title IN ('Romeo is a Dead Man', 'Dispatch', 'Sword of the Sea', 'Ghost of Yōtei', 'Clair Obscur: Expedition 33', 'Assassin''s Creed Shadows', 'Monster Hunter Wilds', 'Death Stranding 2: On the Beach', 'Kingdom Come: Deliverance 2');"

print_success "Created 20 accounts with mock data"

# Summary
print_header "Summary"

TOTAL_ACCOUNTS=$(execute_sql "SELECT COUNT(*) FROM accounts;" | tail -1)
RENTED_ACCOUNTS=$(execute_sql "SELECT COUNT(DISTINCT id) FROM accounts WHERE status_ps5_own='rented' OR status_ps5_shop='rented' OR status_ps4='rented';" | tail -1)
AVAILABLE_ACCOUNTS=$((TOTAL_ACCOUNTS - RENTED_ACCOUNTS))

echo -e "${GREEN}📊 Statistics:${NC}"
echo -e "  Total Accounts: ${BLUE}$TOTAL_ACCOUNTS${NC}"
echo -e "  Rented: ${RED}$RENTED_ACCOUNTS${NC}"
echo -e "  Available: ${GREEN}$AVAILABLE_ACCOUNTS${NC}"

print_success "Mock data created successfully!"

echo -e "\n${BLUE}Next steps:${NC}"
echo -e "  1. Start dev servers: ${YELLOW}npm run dev${NC}"
echo -e "  2. Open customer site: ${YELLOW}http://localhost:7000${NC}"
echo -e "  3. Open admin site: ${YELLOW}http://localhost:7001${NC}"
echo -e "  4. Admin login: ${YELLOW}admin / admin123${NC}"

echo -e "\n${GREEN}Happy testing! 🎮${NC}\n"
