FROM alpine:3.17

RUN set -x \
    && apk update \
    && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium@edge \
      nss@edge \
      bash \
      yarn \
      udev \
      ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CHROME_BIN="/usr/bin/chromium-browser"

WORKDIR /home/chrome/plugin

COPY package.json yarn.lock .yarnrc.yml /home/chrome/plugin/

COPY .yarn /home/chrome/plugin/.yarn

COPY . /home/chrome/plugin/

RUN yarn install