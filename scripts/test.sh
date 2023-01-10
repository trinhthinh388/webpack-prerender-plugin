#!/bin/sh

# Black        0;30     Dark Gray     1;30
# Red          0;31     Light Red     1;31
# Green        0;32     Light Green   1;32
# Brown/Orange 0;33     Yellow        1;33
# Blue         0;34     Light Blue    1;34
# Purple       0;35     Light Purple  1;35
# Cyan         0;36     Light Cyan    1;36
# Light Gray   0;37     White         1;37

set -euo pipefail

BLUE='\033[0;34m'
GREEN='\032[0;34m'
NC='\033[0m' # No Color

echo "Chromium version: $(chromium-browser --version)"
echo "Excutable path: $PUPPETEER_EXECUTABLE_PATH"
echo "Starting Test Enviroment"

echo -e "${BLUE}-- Workspaces --${NC}"
yarn workspaces list

echo -e "${BLUE}-- Build --${NC}"
yarn g:build

echo -e "${BLUE}-- Test --${NC}"
yarn g:test