from ./backend
docker build . -t typemeup-backend
docker save typemeup-backend | ssh -C mustafar docker load

from ./frontend
docker build . -t typemeup-frontend
docker save typemeup-frontend | ssh -C mustafar docker load

Deploy using docker compose