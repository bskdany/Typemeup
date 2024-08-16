#!/bin/bash

# Change to home directory
cd ~

# Check if the repository already exists
if [ ! -d "typemeup" ]; then
  echo "Repository not found. Cloning for the first time..."
  git clone https://github.com/bskdany/typemeup
  cd typemeup

  # creating a default sqlite instance
  mkdir db
  cd db
  touch typemeup_prod.sqlite
  cd ..

  # copying the env file
  mv .env.example.prod .env

  docker compose up --build
else
  cd typemeup
  git fetch origin main
  LOCAL_COMMIT=$(git rev-parse HEAD)
  REMOTE_COMMIT=$(git rev-parse origin/main)
  if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
      echo "New commits found. Pulling and rebuilding..."
      git pull origin main

      docker compose down
      docker compose up --build
  else
      echo "Repository is up to date."
  fi
fi
