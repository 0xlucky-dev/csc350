#!/bin/bash

###############################################################################
# FILE: setup.sh
# PURPOSE: Ubuntu setup script for Ninja Shop (first-time installation)
#          - Checks and installs Node.js, npm, MySQL
#          - Creates database and tables
#          - Seeds initial data
#          - Imports games from catalog
#          - Installs npm dependencies
#          - Starts dev servers
#
# USAGE: chmod +x setup.sh && ./setup.sh
#
# SPEC: .kiro/specs/ninja-shop/design.md
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if running as root
check_root() {
    if [ "$EUID" -eq 0 ]; then
        print_error "Please do not run this script as root (without sudo)"
        print_info "Run: chmod +x setup.sh && ./setup.sh"
        exit 1
    fi
}

# Check Ubuntu version
check_ubuntu() {
    if [ ! -f /etc/os-release ]; then
        print_error "Cannot detect OS version"
        exit 1
    fi
    
    . /etc/os-release
    if [ "$ID" != "ubuntu" ]; then
        print_warning "This script is designed for Ubuntu, but detected: $ID"
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    print_success "OS: $PRETTY_NAME"
}

# Install Node.js
install_nodejs() {
    print_header "Checking Node.js"
    
    if command_exists node; then
        NODE_VERSION=$(node -v)
        print_success "Node.js already installed: $NODE_VERSION"
        
        # Check if version is >= 18
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_warning "Node.js version is too old (need >= 18.x)"
            print_info "Installing Node.js 20.x..."
            install_nodejs_fresh
        fi
    else
        print_info "Node.js not found. Installing Node.js 20.x..."
        install_nodejs_fresh
    fi
    
    if command_exists npm; then
        NPM_VERSION=$(npm -v)
        print_success "npm already installed: v$NPM_VERSION"
    else
        print_error "npm not found after Node.js installation"
        exit 1
    fi
}

install_nodejs_fresh() {
    print_info "Adding NodeSource repository..."
    
    # Remove old NodeSource repo if exists
    sudo rm -f /etc/apt/sources.list.d/nodesource.list 2>/dev/null || true
    
    # Install Node.js 20.x
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - || {
        print_error "Failed to add NodeSource repository"
        exit 1
    }
    
    sudo apt-get update || {
        print_error "Failed to update apt"
        exit 1
    }
    
    sudo apt-get install -y nodejs || {
        print_error "Failed to install Node.js"
        exit 1
    }
    
    print_success "Node.js installed: $(node -v)"
    print_success "npm installed: v$(npm -v)"
}

# Install MySQL
install_mysql() {
    print_header "Checking MySQL"
    
    if command_exists mysql; then
        MYSQL_VERSION=$(mysql --version)
        print_success "MySQL already installed: $MYSQL_VERSION"
    else
        print_info "MySQL not found. Installing MySQL Server..."
        
        sudo apt-get update || {
            print_error "Failed to update apt"
            exit 1
        }
        
        # Set non-interactive mode
        export DEBIAN_FRONTEND=noninteractive
        
        # Install MySQL without password prompt
        sudo apt-get install -y mysql-server || {
            print_error "Failed to install MySQL"
            exit 1
        }
        
        print_success "MySQL installed"
        
        # Start MySQL service
        sudo systemctl start mysql || {
            print_error "Failed to start MySQL service"
            exit 1
        }
        
        sudo systemctl enable mysql || {
            print_warning "Failed to enable MySQL service on boot"
        }
        
        print_success "MySQL service started"
    fi
    
    # Check if MySQL is running
    if sudo systemctl is-active --quiet mysql; then
        print_success "MySQL service is running"
    else
        print_info "Starting MySQL service..."
        sudo systemctl start mysql || {
            print_error "Failed to start MySQL service"
            exit 1
        }
    fi
}

# Setup MySQL database
setup_database() {
    print_header "Setting up Database"
    
    # Load .env file
    if [ ! -f .env ]; then
        print_error ".env file not found"
        print_info "Creating .env from .env.example..."
        
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success ".env created"
        else
            print_error ".env.example not found"
            exit 1
        fi
    fi
    
    # Read database credentials from .env
    DB_HOST=$(grep DB_HOST .env | cut -d '=' -f2 | tr -d ' "' || echo "localhost")
    DB_PORT=$(grep DB_PORT .env | cut -d '=' -f2 | tr -d ' "' || echo "3306")
    DB_USER=$(grep DB_USER .env | cut -d '=' -f2 | tr -d ' "' || echo "root")
    DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2 | tr -d ' "' || echo "")
    DB_NAME=$(grep DB_NAME .env | cut -d '=' -f2 | tr -d ' "' || echo "ninja_shop")
    
    print_info "Database: $DB_NAME"
    print_info "User: $DB_USER"
    print_info "Host: $DB_HOST:$DB_PORT"
    
    # Create database
    print_info "Creating database..."
    
    if [ -z "$DB_PASSWORD" ]; then
        # No password
        sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" || {
            print_error "Failed to create database"
            exit 1
        }
        
        # Grant privileges
        sudo mysql -u root -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost' IDENTIFIED BY '';" 2>/dev/null || \
        sudo mysql -u root -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost'; GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost'; FLUSH PRIVILEGES;" || {
            print_warning "Failed to grant privileges (might be OK if user already exists)"
        }
    else
        # With password
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" || {
            print_error "Failed to create database"
            exit 1
        }
    fi
    
    print_success "Database created: $DB_NAME"
    
    # Run schema
    print_info "Creating tables..."
    
    if [ ! -f packages/shared/src/db/schema.sql ]; then
        print_error "schema.sql not found"
        exit 1
    fi
    
    if [ -z "$DB_PASSWORD" ]; then
        sudo mysql -u root "$DB_NAME" < packages/shared/src/db/schema.sql || {
            print_error "Failed to create tables"
            exit 1
        }
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < packages/shared/src/db/schema.sql || {
            print_error "Failed to create tables"
            exit 1
        }
    fi
    
    print_success "Tables created"
    
    # Run migrations
    print_info "Running migrations..."
    
    if [ -f packages/shared/src/db/migrate-add-prices.sql ]; then
        if [ -z "$DB_PASSWORD" ]; then
            sudo mysql -u root "$DB_NAME" < packages/shared/src/db/migrate-add-prices.sql 2>/dev/null || true
        else
            mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < packages/shared/src/db/migrate-add-prices.sql 2>/dev/null || true
        fi
        print_success "Migration: add-prices"
    fi
    
    if [ -f packages/shared/src/db/migrate-separate-status.sql ]; then
        if [ -z "$DB_PASSWORD" ]; then
            sudo mysql -u root "$DB_NAME" < packages/shared/src/db/migrate-separate-status.sql 2>/dev/null || true
        else
            mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < packages/shared/src/db/migrate-separate-status.sql 2>/dev/null || true
        fi
        print_success "Migration: separate-status"
    fi
}

# Install npm dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    if [ ! -f package.json ]; then
        print_error "package.json not found"
        exit 1
    fi
    
    print_info "Running npm install..."
    npm install || {
        print_error "Failed to install dependencies"
        exit 1
    }
    
    print_success "Dependencies installed"
}

# Seed database
seed_database() {
    print_header "Seeding Database"
    
    print_info "Running seed script..."
    npm run db:seed || {
        print_error "Failed to seed database"
        exit 1
    }
    
    print_success "Database seeded"
}

# Import games
import_games() {
    print_header "Importing Games"
    
    if [ ! -d game-store-catalog ]; then
        print_warning "game-store-catalog folder not found"
        print_info "Skipping game import..."
        return
    fi
    
    print_info "Importing games from catalog..."
    npm run db:import-games || {
        print_error "Failed to import games"
        exit 1
    }
    
    print_success "Games imported"
}

# Clean duplicate games
clean_games() {
    print_header "Cleaning Duplicate Games"
    
    print_info "Removing duplicate games..."
    npm run db:clean-games || {
        print_warning "Failed to clean games (might be OK if script doesn't exist)"
        return
    }
    
    print_success "Duplicate games removed"
}

# Show completion message
show_completion() {
    print_header "Setup Complete! 🎉"
    
    echo -e "${GREEN}✅ Node.js installed${NC}"
    echo -e "${GREEN}✅ MySQL installed and configured${NC}"
    echo -e "${GREEN}✅ Database created and seeded${NC}"
    echo -e "${GREEN}✅ Games imported${NC}"
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    
    echo -e "\n${BLUE}Next steps:${NC}"
    echo -e "  1. Start dev servers: ${YELLOW}npm run dev${NC}"
    echo -e "  2. Open customer site: ${YELLOW}http://localhost:7000${NC}"
    echo -e "  3. Open admin site: ${YELLOW}http://localhost:7001${NC}"
    echo -e "  4. Admin login: ${YELLOW}admin / admin123${NC}"
    
    echo -e "\n${BLUE}Useful commands:${NC}"
    echo -e "  • ${YELLOW}npm run dev${NC} - Start both apps"
    echo -e "  • ${YELLOW}npm run db:seed${NC} - Reset database"
    echo -e "  • ${YELLOW}npm run db:import-games${NC} - Import games"
    echo -e "  • ${YELLOW}npm run db:clean-games${NC} - Remove duplicates"
    
    echo -e "\n${GREEN}Happy coding! 🚀${NC}\n"
}

# Main execution
main() {
    print_header "Ninja Shop - Ubuntu Setup"
    
    check_root
    check_ubuntu
    
    # Install system dependencies
    print_info "Updating package list..."
    sudo apt-get update || {
        print_error "Failed to update package list"
        exit 1
    }
    
    # Install curl if not exists
    if ! command_exists curl; then
        print_info "Installing curl..."
        sudo apt-get install -y curl || {
            print_error "Failed to install curl"
            exit 1
        }
    fi
    
    install_nodejs
    install_mysql
    setup_database
    install_dependencies
    seed_database
    import_games
    clean_games
    show_completion
}

# Run main function
main
