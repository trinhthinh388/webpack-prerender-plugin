FROM alpine:3.17 as base

RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

WORKDIR /home/chrome/plugin

COPY package.json yarn.lock .yarnrc.yml /home/chrome/plugin/

COPY .yarn /home/chrome/plugin/.yarn

COPY . /home/chrome/plugin/

RUN yarn install