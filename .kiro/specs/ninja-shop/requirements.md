# Requirements Document

## Introduction

Ninja Shop is a PlayStation ID rental website that allows customers to browse available PlayStation accounts with game libraries and contact the shop to rent them. The system consists of a public-facing customer website and a separate admin dashboard for managing accounts, games, rental status, and pricing. The website features a dark/blue theme and does not require customer authentication.

## Glossary

- **Customer_Website**: The public-facing web interface where customers browse PlayStation IDs
- **Admin_Dashboard**: The authenticated web interface for shop administrators
- **PlayStation_ID**: A PlayStation Network account available for rental
- **Account_Card**: A visual component displaying a single PlayStation ID with its details
- **Game_Library**: The collection of games associated with a PlayStation ID
- **Rental_Status**: The current availability state of a PlayStation ID (available or rented)
- **Rental_Type**: The category of rental service (PS5 own account, PS5 shop account, or PS4)
- **Contact_Button**: An interactive element that redirects to LINE or Facebook
- **Game_Scraper**: A service that retrieves game information from PlayStation Store
- **Database**: The persistent storage system containing all application data
- **Admin_User**: An authenticated user with access to the Admin Dashboard

## Requirements

### Requirement 1: Display PlayStation ID Listings

**User Story:** As a customer, I want to view all available PlayStation IDs with their details, so that I can choose which account to rent.

#### Acceptance Criteria

1. THE Customer_Website SHALL display exactly 10 PlayStation IDs in a grid layout
2. WHEN the viewport width is 1024px or greater, THE Customer_Website SHALL display Account_Cards in a 3-column grid
3. WHEN the viewport width is between 768px and 1023px, THE Customer_Website SHALL display Account_Cards in a 2-column grid
4. WHEN the viewport width is less than 768px, THE Customer_Website SHALL display Account_Cards in a single column
5. THE Account_Card SHALL display the account number in the format "ID No.X" where X is a sequential number
6. THE Account_Card SHALL display the Rental_Status as either "Available" or "Rented until [date]"
7. WHEN a PlayStation_ID has Rental_Status of rented, THE Account_Card SHALL display the rental expiration date in YYYY-MM-DD format
8. THE Account_Card SHALL display all games in the Game_Library with their cover images
9. THE Account_Card SHALL display a pricing table showing all three Rental_Types with their respective prices
10. THE Account_Card SHALL display a Contact_Button for initiating rental inquiries

### Requirement 2: Manage Game Display

**User Story:** As a customer, I want to see game cover images clearly on all devices, so that I can identify games in each PlayStation ID.

#### Acceptance Criteria

1. WHEN the viewport width is 1024px or greater, THE Account_Card SHALL display game images in a 4-column grid
2. WHEN the viewport width is between 768px and 1023px, THE Account_Card SHALL display game images in a 3-column grid
3. WHEN the viewport width is less than 768px, THE Account_Card SHALL display game images in a 2-column grid
4. THE Customer_Website SHALL load game images using lazy loading technique
5. THE Customer_Website SHALL display game images in WebP format when supported by the browser
6. WHEN a game image fails to load, THE Customer_Website SHALL display a placeholder image
7. THE Account_Card SHALL display the game title when a user hovers over a game image on desktop devices
8. THE Account_Card SHALL display the game title when a user taps on a game image on touch devices

### Requirement 3: Handle Contact Requests

**User Story:** As a customer, I want to contact the shop about renting a PlayStation ID, so that I can complete the rental transaction.

#### Acceptance Criteria

1. WHEN a user clicks the Contact_Button, THE Customer_Website SHALL redirect to the configured LINE URL or Facebook URL
2. THE Contact_Button SHALL have a minimum touch target size of 44x44 pixels
3. THE Customer_Website SHALL retrieve contact URLs from the settings table in the Database
4. WHEN the LINE URL is configured, THE Contact_Button SHALL display a LINE icon and label
5. WHEN the Facebook URL is configured, THE Contact_Button SHALL display a Facebook icon and label
6. WHEN both LINE and Facebook URLs are configured, THE Contact_Button SHALL display both options
7. THE Customer_Website SHALL open contact links in a new browser tab

### Requirement 4: Apply Visual Theme

**User Story:** As a customer, I want to experience a consistent dark/blue theme, so that the website is visually appealing and comfortable to use.

#### Acceptance Criteria

1. THE Customer_Website SHALL use #0a0e27 as the primary background color
2. THE Customer_Website SHALL use #1a1f3a as the secondary background color
3. THE Customer_Website SHALL use #00d4ff as the primary accent color
4. THE Customer_Website SHALL use #0066ff as the secondary accent color
5. THE Customer_Website SHALL use #ffffff for primary text
6. THE Customer_Website SHALL use #a0aec0 for secondary text
7. THE Account_Card SHALL use #151a30 as the card background color
8. THE Customer_Website SHALL use #2d3748 for border colors

### Requirement 5: Authenticate Admin Users

**User Story:** As an admin, I want to log in securely to the Admin Dashboard, so that I can manage the shop's data.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a login form with username and password fields
2. WHEN an Admin_User submits valid credentials, THE Admin_Dashboard SHALL generate a JWT token with 24-hour expiration
3. WHEN an Admin_User submits invalid credentials, THE Admin_Dashboard SHALL display an error message and reject access
4. THE Admin_Dashboard SHALL store passwords using bcrypt hashing with a cost factor of 10
5. THE Admin_Dashboard SHALL validate JWT tokens on all protected routes
6. WHEN a JWT token expires, THE Admin_Dashboard SHALL redirect the Admin_User to the login page
7. THE Admin_Dashboard SHALL update the last_login timestamp in the admin_users table when authentication succeeds
8. THE login form SHALL be responsive and functional on mobile devices with viewport width less than 768px

### Requirement 6: Manage PlayStation IDs

**User Story:** As an admin, I want to create, update, and delete PlayStation IDs, so that I can maintain the shop's inventory.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a list of all PlayStation IDs from the accounts table
2. WHEN an Admin_User clicks "Add Account", THE Admin_Dashboard SHALL display a form to create a new PlayStation_ID
3. THE Admin_Dashboard SHALL validate that account_number is unique before creating a new PlayStation_ID
4. WHEN an Admin_User submits a valid account form, THE Admin_Dashboard SHALL insert a new record into the accounts table
5. WHEN an Admin_User clicks "Edit" on a PlayStation_ID, THE Admin_Dashboard SHALL display a form pre-filled with existing data
6. WHEN an Admin_User updates a PlayStation_ID, THE Admin_Dashboard SHALL update the corresponding record in the accounts table
7. WHEN an Admin_User clicks "Delete" on a PlayStation_ID, THE Admin_Dashboard SHALL display a confirmation dialog
8. WHEN an Admin_User confirms deletion, THE Admin_Dashboard SHALL remove the record from the accounts table and all related records from account_games table
9. THE Admin_Dashboard SHALL display account management tables with horizontal scroll on mobile devices

### Requirement 7: Manage Rental Status

**User Story:** As an admin, I want to update rental status and dates, so that customers see accurate availability information.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display current Rental_Status for each PlayStation_ID
2. WHEN an Admin_User sets Rental_Status to "rented", THE Admin_Dashboard SHALL require a rented_until date
3. WHEN an Admin_User sets Rental_Status to "available", THE Admin_Dashboard SHALL clear the rented_until date
4. THE Admin_Dashboard SHALL validate that rented_until date is in the future when setting status to "rented"
5. WHEN an Admin_User updates Rental_Status, THE Admin_Dashboard SHALL update the status and rented_until fields in the accounts table
6. THE Admin_Dashboard SHALL allow Admin_User to store optional renter_contact information
7. THE Admin_Dashboard SHALL allow Admin_User to add notes to a rental record

### Requirement 8: Scrape Game Data from PlayStation Store

**User Story:** As an admin, I want to search and import game data from PlayStation Store, so that I don't have to manually enter game information.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a search interface for querying PlayStation Store
2. WHEN an Admin_User enters a search query, THE Game_Scraper SHALL retrieve matching games from PlayStation Store
3. THE Game_Scraper SHALL extract game title, cover image URL, and PlayStation Store URL
4. THE Admin_Dashboard SHALL display search results with game previews
5. WHEN an Admin_User selects a game from search results, THE Admin_Dashboard SHALL insert the game data into the games table
6. THE Admin_Dashboard SHALL check if a game already exists in the games table before inserting
7. WHEN a game already exists, THE Admin_Dashboard SHALL display a message and prevent duplicate insertion
8. THE Game_Scraper SHALL handle network errors and display appropriate error messages
9. WHEN PlayStation Store is unavailable, THE Admin_Dashboard SHALL allow manual game entry as a fallback

### Requirement 9: Associate Games with PlayStation IDs

**User Story:** As an admin, I want to add and remove games from PlayStation IDs, so that customers see accurate game libraries.

#### Acceptance Criteria

1. WHEN an Admin_User views a PlayStation_ID, THE Admin_Dashboard SHALL display all associated games from the account_games table
2. THE Admin_Dashboard SHALL provide an interface to add games to a PlayStation_ID
3. WHEN an Admin_User adds a game to a PlayStation_ID, THE Admin_Dashboard SHALL insert a record into the account_games table
4. THE Admin_Dashboard SHALL prevent adding duplicate games to the same PlayStation_ID using the unique_account_game constraint
5. WHEN an Admin_User removes a game from a PlayStation_ID, THE Admin_Dashboard SHALL delete the corresponding record from the account_games table
6. THE Admin_Dashboard SHALL display available games that are not yet associated with the current PlayStation_ID
7. THE Admin_Dashboard SHALL support bulk addition of multiple games to a PlayStation_ID

### Requirement 10: Manage Rental Pricing

**User Story:** As an admin, I want to set and update rental prices for different rental types, so that customers see current pricing.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display all three Rental_Types with their current prices from the rental_prices table
2. WHEN an Admin_User updates a price, THE Admin_Dashboard SHALL validate that the price is a positive decimal number
3. WHEN an Admin_User submits a valid price, THE Admin_Dashboard SHALL update the price field in the rental_prices table
4. THE Admin_Dashboard SHALL allow Admin_User to update the description field for each Rental_Type
5. THE Admin_Dashboard SHALL allow Admin_User to set duration_days for each Rental_Type
6. THE Admin_Dashboard SHALL allow Admin_User to toggle is_active status for each Rental_Type
7. WHEN a Rental_Type has is_active set to false, THE Customer_Website SHALL not display that rental option

### Requirement 11: Configure System Settings

**User Story:** As an admin, I want to configure contact URLs and other settings, so that the customer website displays correct information.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display all settings from the settings table in a key-value format
2. WHEN an Admin_User updates a setting value, THE Admin_Dashboard SHALL update the corresponding record in the settings table
3. THE Admin_Dashboard SHALL validate LINE URL format as a valid URL starting with "https://line.me/"
4. THE Admin_Dashboard SHALL validate Facebook URL format as a valid URL starting with "https://facebook.com/" or "https://www.facebook.com/"
5. THE Admin_Dashboard SHALL allow Admin_User to add new settings without database migration
6. THE Customer_Website SHALL retrieve settings from the settings table on page load
7. THE Admin_Dashboard SHALL support setting data types: string, number, boolean, and json

### Requirement 12: Implement Responsive Navigation

**User Story:** As a user, I want to navigate the website easily on any device, so that I can access all features regardless of screen size.

#### Acceptance Criteria

1. WHEN the viewport width is 1024px or greater, THE Customer_Website SHALL display a horizontal navigation menu
2. WHEN the viewport width is less than 1024px, THE Customer_Website SHALL display a hamburger menu icon
3. WHEN a user clicks the hamburger menu icon, THE Customer_Website SHALL display a slide-in navigation drawer
4. WHEN the viewport width is 1024px or greater, THE Admin_Dashboard SHALL display a fixed sidebar navigation
5. WHEN the viewport width is less than 1024px, THE Admin_Dashboard SHALL display a collapsible drawer navigation
6. THE navigation elements SHALL have touch targets of at least 44x44 pixels on mobile devices
7. WHEN a user clicks outside the navigation drawer on mobile, THE Customer_Website SHALL close the drawer

### Requirement 13: Optimize Performance

**User Story:** As a customer, I want the website to load quickly, so that I can browse PlayStation IDs without delays.

#### Acceptance Criteria

1. THE Customer_Website SHALL achieve a First Contentful Paint time of less than 2 seconds on 3G networks
2. THE Customer_Website SHALL implement code splitting to load only necessary JavaScript for each page
3. THE Customer_Website SHALL serve images through a CDN when deployed to production
4. THE Customer_Website SHALL compress images to reduce file size by at least 50% compared to original uploads
5. THE Customer_Website SHALL implement browser caching with appropriate cache headers for static assets
6. THE Customer_Website SHALL minify CSS and JavaScript files in production builds
7. THE Customer_Website SHALL defer loading of non-critical JavaScript

### Requirement 14: Persist Data Reliably

**User Story:** As an admin, I want all data changes to be saved reliably, so that no information is lost.

#### Acceptance Criteria

1. THE Database SHALL use transactions for operations that modify multiple tables
2. WHEN an Admin_User deletes a PlayStation_ID, THE Database SHALL cascade delete all related records in account_games table
3. WHEN an Admin_User deletes a game, THE Database SHALL cascade delete all related records in account_games table
4. THE Database SHALL enforce foreign key constraints between accounts and account_games tables
5. THE Database SHALL enforce foreign key constraints between games and account_games tables
6. THE Database SHALL enforce unique constraint on account_number in accounts table
7. THE Database SHALL enforce unique constraint on rental_type in rental_prices table
8. THE Database SHALL enforce unique constraint on setting_key in settings table
9. THE Database SHALL automatically update the updated_at timestamp when records are modified

### Requirement 15: Handle Errors Gracefully

**User Story:** As a user, I want to see helpful error messages when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN a network request fails, THE Customer_Website SHALL display a user-friendly error message
2. WHEN the Database is unavailable, THE Admin_Dashboard SHALL display a message indicating the system is temporarily unavailable
3. WHEN an Admin_User submits invalid form data, THE Admin_Dashboard SHALL display field-specific validation errors
4. WHEN the Game_Scraper fails to retrieve data, THE Admin_Dashboard SHALL display an error message and suggest manual entry
5. WHEN a user encounters a 404 error, THE Customer_Website SHALL display a custom 404 page with navigation options
6. WHEN a user encounters a 500 error, THE Customer_Website SHALL display a custom error page and log the error details
7. THE Admin_Dashboard SHALL log all errors to a centralized logging system for debugging
