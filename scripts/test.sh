#!/bin/sh

echo "Chromium version: $(chromium-browser --version)"
echo "Excutable path: $PUPPETEER_EXECUTABLE_PATH"
echo "Starting Test Enviroment"

yarn example serve & ./scripts/wait-for-it.sh localhost:3000 -- yarn renderer test --verbose --forceExit