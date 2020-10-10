FROM node:12-stretch

RUN apt update

# git for pretty-quick. sudo for chown inside docker
RUN apt install -y git sudo

RUN echo "node:node" | chpasswd && adduser node sudo

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install
# RUN npm install -g nodemon # not working with yarn

# RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo

# USER docker

COPY . /app

CMD ["yarn", "dev"]
