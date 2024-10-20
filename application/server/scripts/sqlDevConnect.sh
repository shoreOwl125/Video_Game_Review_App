#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR=$(dirname "$0")

# Load environment variables from the .env file
if [ -f "$SCRIPT_DIR/.env" ]; then
    export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
fi

# MySQL connection details
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-ratings_dev_db}"

# SQL file paths, ensuring they are relative to the script's directory
USER_DB_SQL="$SCRIPT_DIR/userDevDBSetup.sql"
GAMES_DB_SQL="$SCRIPT_DIR/gamesDevDBsetup.sql"

# Check if MySQL service is running (macOS/Homebrew)
echo "Checking if MySQL service is running..."
if pgrep mysqld > /dev/null 2>&1; then
    echo "MySQL is already running."
else
    echo "MySQL is not running. Starting MySQL service..."

    # Start MySQL using Homebrew (macOS)
    if command -v brew >/dev/null 2>&1; then
        brew services start mysql
    else
        echo "Brew not found. Please install brew or start MySQL manually."
        exit 1
    fi

    # Check if MySQL started successfully
    if pgrep mysqld > /dev/null 2>&1; then
        echo "MySQL started successfully."
    else
        echo "Failed to start MySQL. Exiting."
        exit 1
    fi
fi

# Check MySQL connection
echo "Checking MySQL connection..."
mysqladmin -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" ping > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Successfully connected to MySQL server."
else
    echo "Unable to connect to MySQL server. Please check your credentials."
    exit 1
fi

# Run userDevDBSetup.sql
echo "Running $USER_DB_SQL..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" < "$USER_DB_SQL"
if [ $? -eq 0 ]; then
    echo "User database setup completed successfully."
else
    echo "Error setting up user database."
    exit 1
fi

# Run gamesDevDBsetup.sql
echo "Running $GAMES_DB_SQL..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$GAMES_DB_SQL"
if [ $? -eq 0 ]; then
    echo "Games database setup completed successfully."
else
    echo "Error setting up games database."
    exit 1
fi

# Show all items in the users table
echo "Showing all items in the users table..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "SELECT * FROM users;"
if [ $? -eq 0 ]; then
    echo "Successfully retrieved items from users table."
else
    echo "Failed to retrieve items from users table."
    exit 1
fi

# Show all items in the games table
echo "Showing all items in the games table..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "SELECT * FROM games;"
if [ $? -eq 0 ]; then
    echo "Successfully retrieved items from games table."
else
    echo "Failed to retrieve items from games table."
    exit 1
fi

echo "Database setup process completed."
