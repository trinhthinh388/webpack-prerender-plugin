FROM node:lts-alpine

WORKDIR /plugin

COPY package.json yarn.lock .yarnrc.yml /plugin/

COPY .yarn /plugin/.yarn

RUN yarn install

COPY . /plugin

ENTRYPOINT [ "yarn" ]