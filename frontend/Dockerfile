FROM node:18-alpine

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

USER node:node

EXPOSE 3000

CMD ["node","build/index.js"]