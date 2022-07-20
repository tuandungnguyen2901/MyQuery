FROM node:14-alpine

WORKDIR /app

COPY env.txt ./.env

COPY package.json ./

RUN npm install --production

COPY . .

EXPOSE 4000

CMD [ "npm", "start"]