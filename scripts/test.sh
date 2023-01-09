#!/bin/sh

echo "Chromium version: $(chromium-browser --version)"
echo "Excutable path: $PUPPETEER_EXECUTABLE_PATH"
echo "Starting Test Enviroment"

yarn renderer test --verbose --forceExit --runInBand