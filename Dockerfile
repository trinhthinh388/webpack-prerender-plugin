FROM alpine:3.17 as base

RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates \
    yarn \
    bash \
    xvfb \
    make

ENV DISPLAY :99
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

RUN addgroup -S chrome && adduser -S chrome -G chrome

USER chrome

WORKDIR /home/chrome

COPY --chown=chrome:chrome package.json yarn.lock .yarnrc.yml /home/chrome/

COPY --chown=chrome:chrome .yarn /home/chrome/.yarn

COPY --chown=chrome:chrome . /home/chrome/

RUN yarn install

ENTRYPOINT ["/home/chrome/scripts/entrypoint.sh"]