FROM node:10.22.1-alpine3.10

WORKDIR /app
ADD . .

RUN npm install yarn

RUN yarn install

CMD yarn start:dev