#!/bin/bash

# Black        0;30     Dark Gray     1;30
# Red          0;31     Light Red     1;31
# Green        0;32     Light Green   1;32
# Brown/Orange 0;33     Yellow        1;33
# Blue         0;34     Light Blue    1;34
# Purple       0;35     Light Purple  1;35
# Cyan         0;36     Light Cyan    1;36
# Light Gray   0;37     White         1;37

set -euo pipefail

SEMANTIC_VERSION=$1

BLUE='\033[0;34m'
GREEN='\032[0;34m'
NC='\033[0m' # No Color

git config --global user.email "thinh.trinh.portfolio@gmai.com" \
 && git config --global user.name "Buildkite CI" \
 && git remote set-url origin https://trinhthinh388:${GITHUB_ACCESS_TOKEN}@github.com/trinhthinh388/webpack-prerender-plugin.git \
 && git reset --hard \
 && git checkout $BUILDKITE_BRANCH \
 && git pull

echo -e "${BLUE}Release with $SEMANTIC_VERSION version${NC}"

echo -e "${BLUE}Packaging build files...${NC}"

yarn renderer build

yarn npm whoami

yarn renderer version $SEMANTIC_VERSION

# yarn renderer npm publish --access public

RELEASE_VERSION=$(jq "version" ./packages/renderer/package.json)

echo -e "${GREEN}Successfully publish @webpack-prerender/renderer to version $RELEASE_VERSION✅${NC}"

echo -e "${BLUE}Pushing updates to git...${NC}"


git add packages/*

echo $RELEASE_VERSION


# git add . && \
# git commit -m "Release @webpack-prerender/renderer with $SEMANTIC_VERSION" && \
# git push -u origin HEAD