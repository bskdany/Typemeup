#!/bin/bash

cd ~/typemeup

echo "Backing up the SQLite database..."
BACKUP_DIR=~/typemeup/db/backups
DB_FILE=~/typemeup/db/typemeup_prod.sqlite

# Create a backup with a custom date format: day-month-year_hour.minute.second
TIMESTAMP=$(date +"%d.%m.%Y_%H_%M._%S")
BACKUP_FILE="$BACKUP_DIR/typemeup_prod_$TIMESTAMP.sqlite"

cp $DB_FILE $BACKUP_FILE

echo "Backup completed: $BACKUP_FILE"
