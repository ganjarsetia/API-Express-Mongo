FROM node:12.14.0-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn && npm install -g nodemon

COPY . /app

CMD ["yarn", "start"]
