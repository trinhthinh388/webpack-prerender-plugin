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

STABLE_VERSION=$(jq -r ".version" ./packages/renderer/package.json)

echo -e "${BLUE}Release with $SEMANTIC_VERSION version${NC}"

echo -e "${BLUE}Building static assets...${NC}"
yarn g:build

yarn npm whoami

echo -e "${BLUE}Bumping packges version...${NC}"
yarn workspaces foreach -ptv --no-private run p:version $SEMANTIC_VERSION

echo -e "${BLUE}Publishing packges...${NC}"
yarn workspaces foreach -ptv --no-private run p:publish --access public

echo -e "${BLUE}Cleaning repo before push...${NC}"
# Remove `stableVersion` before relreasing, as it's buggy.
# https://github.com/yarnpkg/berry/issues/3868
yarn workspaces foreach -ptv --no-private run echo "$(jq 'del(.stableVersion)' ./package.json)" > ./package.json

echo -e "${BLUE}Pushing updates to git...${NC}"
git add packages/* \
  && git commit -m "Release @webpack-prerender/renderer to $RELEASE_VERSION [skip ci]" \
  && git push -u origin HEAD