#!/bin/sh

echo "Chromium version: $(chromium-browser --version)"
echo "Starting Test Enviroment"

yarn example serve & ./scripts/wait-for-it.sh localhost:3000 -- yarn renderer test --force-exit