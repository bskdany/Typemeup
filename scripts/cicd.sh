#!/bin/bash

cd ~/typemeup
git fetch origin main
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main)
if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
  echo "New commits found. Pulling and rebuilding..."
  git pull origin main

  docker compose down
  docker compose up --build -d
else
  echo "Repository is up to date."
fi
