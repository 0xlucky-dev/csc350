@echo off
REM ============================================================================
REM FILE: testdb.bat
REM PURPOSE: Create mock data for Ninja Shop (20 accounts with games) - Windows
REM          - 20 accounts with 3-15 games each
REM          - Mixed rental status (PS5 Own, PS5 Shop, PS4)
REM          - Realistic prices and rental periods (15-30 days)
REM
REM USAGE: testdb.bat
REM
REM SPEC: .kiro/specs/ninja-shop/design.md
REM ============================================================================

echo.
echo ========================================
echo Creating Mock Data for Ninja Shop
echo ========================================
echo.

REM Load environment variables
if not exist .env (
    echo Error: .env file not found
    exit /b 1
)

REM Parse .env file
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if "%%a"=="DB_NAME" set DB_NAME=%%b
)

echo Database: %DB_NAME%
echo.

echo Clearing existing accounts...
mysql -u root %DB_NAME% -e "DELETE FROM account_games;"
mysql -u root %DB_NAME% -e "DELETE FROM accounts;"
echo Done: Cleared existing accounts
echo.

echo Ensuring games exist...
mysql -u root %DB_NAME% -e "INSERT IGNORE INTO games (title, title_en, genre, image_url) VALUES ('Romeo is a Dead Man', 'Romeo is a Dead Man', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example1.png'), ('Dispatch', 'Dispatch', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example2.png'), ('Sword of the Sea', 'Sword of the Sea', 'Adventure', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example3.png'), ('Tony Hawk''s Pro Skater 3 + 4', 'Tony Hawk''s Pro Skater 3 + 4', 'Sports', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example4.png'), ('Ghost of Yōtei', 'Ghost of Yōtei', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example5.png'), ('Clair Obscur: Expedition 33', 'Clair Obscur: Expedition 33', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example6.png'), ('Assassin''s Creed Shadows', 'Assassin''s Creed Shadows', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example7.png'), ('Monster Hunter Wilds', 'Monster Hunter Wilds', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example8.png'), ('Arc Raiders', 'Arc Raiders', 'Shooter', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example9.png'), ('Kingdom Come: Deliverance 2', 'Kingdom Come: Deliverance 2', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example10.png'), ('Metaphor: ReFantazio', 'Metaphor: ReFantazio', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example11.png'), ('Dragon Age: The Veilguard', 'Dragon Age: The Veilguard', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example12.png'), ('The Elder Scrolls 4: Oblivion Remastered', 'The Elder Scrolls 4: Oblivion Remastered', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example13.png'), ('Resident Evil 4', 'Resident Evil 4', 'Horror', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example14.png'), ('Baldur''s Gate 3', 'Baldur''s Gate 3', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example15.png'), ('Pragmata', 'Pragmata', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example16.png'), ('Hollow Knight Silksong', 'Hollow Knight Silksong', 'Adventure', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example17.png'), ('Demon''s Souls', 'Demon''s Souls', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example18.png'), ('Monster Hunter Stories 3: Twisted Reflection', 'Monster Hunter Stories 3: Twisted Reflection', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example19.png'), ('Gran Turismo 7', 'Gran Turismo 7', 'Racing', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example20.png'), ('Helldivers 2', 'Helldivers 2', 'Shooter', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example21.png'), ('Resident Evil Requiem', 'Resident Evil Requiem', 'Horror', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example22.png'), ('Final Fantasy 7 Rebirth', 'Final Fantasy 7 Rebirth', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example23.png'), ('Returnal', 'Returnal', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example24.png'), ('Horizon Forbidden West', 'Horizon Forbidden West', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example25.png'), ('Death Stranding 2: On the Beach', 'Death Stranding 2: On the Beach', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example26.png'), ('Marvel''s Spider-Man 2', 'Marvel''s Spider-Man 2', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example27.png'), ('Astro Bot', 'Astro Bot', 'Platform', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example28.png'), ('Elden Ring', 'Elden Ring', 'RPG', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example29.png'), ('God of War Ragnarök', 'God of War Ragnarök', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example30.png'), ('Grand Theft Auto V', 'Grand Theft Auto V', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example31.png'), ('Marvel''s Spider-Man: Miles Morales', 'Marvel''s Spider-Man: Miles Morales', 'Action', 'https://image.api.playstation.com/vulcan/ap/rnd/202401/2923/example32.png');"
echo Done: Games ensured
echo.

echo Creating 20 accounts with mock data...
echo This may take a minute...
echo.

REM Create accounts (simplified for batch - full SQL in testdb.sh)
mysql -u root %DB_NAME% < testdb.sql

echo Done: Created 20 accounts
echo.

echo ========================================
echo Summary
echo ========================================
echo.
echo Mock data created successfully!
echo.
echo Next steps:
echo   1. Start dev servers: npm run dev
echo   2. Open customer site: http://localhost:7000
echo   3. Open admin site: http://localhost:7001
echo   4. Admin login: admin / admin123
echo.
echo Happy testing! 🎮
echo.

pause
