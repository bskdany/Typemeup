#!/bin/bash

cd ~

# Check if the repository already exists
if [ ! -d "typemeup" ]; then
  echo "Repository not found. Cloning for the first time..."
  git clone https://github.com/bskdany/typemeup
  cd typemeup

  mkdir db
  mkdir db/backups
  touch db/typemeup_prod.sqlite
  mkdir log
  echo "Created dir structure"

  # Copying the env file
  mv .env.example.prod .env
  echo "Initialized .env"

  # Setting up CI/CD cron job
  CICD_CRON_JOB="*/5 * * * * /bin/bash ~/typemeup/scripts/cicd.sh >> ~/typemeup/log/cicd.log 2>&1"
  DB_BACKUP_CRON_JOB="0 0 * * * /bin/bash ~/typemeup/scripts/db_backup.sh >> ~/typemeup/log/db_backup.log 2>&1"

  # Add the cron job if it doesn't exist
  (crontab -l 2>/dev/null; echo "$CICD_CRON_JOB") | crontab -
  echo "Added cicd cronjob"
  (crontab -l 2>/dev/null; echo "$DB_BACKUPCRON_JOB") | crontab -
  echo "Added db backup cronjob"

  # Build and run the Docker containers
  docker compose up --build -d
fi
