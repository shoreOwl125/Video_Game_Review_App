#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR=$(dirname "$0")

# Load environment variables from the .env file
if [ -f "$SCRIPT_DIR/.env" ]; then
    export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
fi

# MySQL connection details for production
DB_HOST="${HOST:-127.0.0.1}"
DB_USER="${USER_STRING:-root}"
DB_PASSWORD="${PASSWORD:-}"
DB_NAME="${DATABASE:-ratingsdb}"

# SQL file paths, ensuring they are relative to the script's directory
USER_DB_SQL="$SCRIPT_DIR/userDevDBSetup.sql"
GAMES_DB_SQL="$SCRIPT_DIR/gamesDevDBsetup.sql"

# Check MySQL connection for production
echo "Checking MySQL connection to the production database..."
mysqladmin -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" ping > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Successfully connected to MySQL production server."
else
    echo "Unable to connect to MySQL production server. Please check your credentials."
    exit 1
fi

# Run userDevDBSetup.sql in the production environment
echo "Running $USER_DB_SQL in production..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" < "$USER_DB_SQL"
if [ $? -eq 0 ]; then
    echo "User database setup completed successfully in production."
else
    echo "Error setting up user database in production."
    exit 1
fi

# Run gamesDevDBsetup.sql in the production environment
echo "Running $GAMES_DB_SQL in production..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$GAMES_DB_SQL"
if [ $? -eq 0 ]; then
    echo "Games database setup completed successfully in production."
else
    echo "Error setting up games database in production."
    exit 1
fi

# Show all items in the users table in production
echo "Showing all items in the users table in production..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "SELECT * FROM users;"
if [ $? -eq 0 ]; then
    echo "Successfully retrieved items from users table in production."
else
    echo "Failed to retrieve items from users table in production."
    exit 1
fi

# Show all items in the games table in production
echo "Showing all items in the games table in production..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "SELECT * FROM games;"
if [ $? -eq 0 ]; then
    echo "Successfully retrieved items from games table in production."
else
    echo "Failed to retrieve items from games table in production."
    exit 1
fi

echo "Production database setup process completed."
