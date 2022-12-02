FROM alpine:3.17 as base

RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates \
    yarn \
    bash \
    xvfb

ENV DISPLAY :99
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

WORKDIR /home/chrome/plugin

COPY package.json yarn.lock .yarnrc.yml /home/chrome/plugin/

COPY .yarn /home/chrome/plugin/.yarn

COPY . /home/chrome/plugin/

RUN chmod +x ./scripts/docker-entrypoint.sh

ENTRYPOINT ["./scripts/entrypoint.sh"]

RUN yarn install