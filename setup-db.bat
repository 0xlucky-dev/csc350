@echo off
echo ========================================
echo Ninja Shop - Database Setup
echo ========================================
echo.

REM Check if MySQL is running
echo [1/4] Checking MySQL connection...
mysql -u root -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Cannot connect to MySQL!
    echo Please start MySQL in XAMPP Control Panel first.
    echo.
    pause
    exit /b 1
)
echo [OK] MySQL is running!
echo.

REM Create database
echo [2/4] Creating database 'ninja_shop'...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ninja_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create database!
    pause
    exit /b 1
)
echo [OK] Database created!
echo.

REM Run schema
echo [3/4] Creating tables...
mysql -u root ninja_shop < packages\shared\src\db\schema.sql
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create tables!
    pause
    exit /b 1
)
echo [OK] Tables created!
echo.

REM Seed data
echo [4/4] Seeding initial data...
cd packages\shared
call npm run db:seed
if %errorlevel% neq 0 (
    echo [ERROR] Failed to seed data!
    cd ..\..
    pause
    exit /b 1
)
cd ..\..
echo [OK] Data seeded!
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo You can now run: npm run dev
echo.
pause
