#!/bin/bash

cd ~

git clone https://github.com/bskdany/typemeup

cd typemeup

docker compose down
docker compose up --build