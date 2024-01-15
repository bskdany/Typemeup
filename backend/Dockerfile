FROM node:18-alpine

ENV NODE_ENV production

WORKDIR /app

COPY package.json .
RUN npm i

USER node

COPY . .

EXPOSE 3000

CMD npm start