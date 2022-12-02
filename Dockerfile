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

RUN addgroup -S plugin && adduser -S plugin -G plugin

USER plugin

WORKDIR /home/chrome/plugin

COPY --chown=plugin package.json yarn.lock .yarnrc.yml /home/chrome/plugin/

COPY --chown=plugin .yarn /home/chrome/plugin/.yarn

COPY --chown=plugin . /home/chrome/plugin/

RUN yarn install

ENTRYPOINT ["/home/chrome/plugin/scripts/entrypoint.sh"]