FROM alpine:3.17

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium@edge \
      nss@edge \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      bash \
      yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /home/chrome/plugin

COPY package.json yarn.lock .yarnrc.yml /home/chrome/plugin/

COPY .yarn /home/chrome/plugin/.yarn

COPY . /home/chrome/plugin/

RUN yarn install