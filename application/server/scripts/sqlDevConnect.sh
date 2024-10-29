#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR=$(dirname "$0")

# MySQL connection details
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-ratings_dev_db}"
SQL_FILE="$SCRIPT_DIR/DB.sql"  # Ensure this matches the name of your SQL file

# Check if the SQL file exists
if [ ! -f "$SQL_FILE" ]; then
  echo "SQL file '$SQL_FILE' not found!"
  exit 1
fi

# Run the SQL file
echo "Running SQL file..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME" < "$SQL_FILE"

if [ $? -eq 0 ]; then
  echo "Database setup completed successfully."
else
  echo "Error occurred during database setup."
  exit 1
fi