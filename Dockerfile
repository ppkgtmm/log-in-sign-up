FROM node:10.22.1-alpine3.10
WORKDIR /app
ADD package*.json ./
RUN npm install
ADD . .
ARG PORT
ARG ENV
CMD PORT=$PORT ENV=$ENV node index.js