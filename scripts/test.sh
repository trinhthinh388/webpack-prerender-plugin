#!/usr/bin/env bash

echo "Chromium version:"
echo $(chromium-browser --version)

echo "Starting Test Environent"

yarn example serve & ./scripts/wait-for-it.sh localhost:3000 -- yarn renderer test