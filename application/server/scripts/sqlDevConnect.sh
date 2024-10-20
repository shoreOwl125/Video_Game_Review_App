#!/bin/bash

# Load environment variables from the .env file
export $(grep -v '^#' .env | xargs)

# Connect to MySQL and open the ratings_dev_db database
mysql -h $DEV_HOST -u $DEV_USER_STRING -p$DEV_PASSWORD $DEV_DATABASE
