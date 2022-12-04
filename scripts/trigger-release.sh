#!/bin/bash

set -euo pipefail

export SEMANTIC_VERSION="$(buildkite-agent meta-data get "semantic-version")"

# Create a pipeline with provided semantic version
PIPELINE="steps:
  - command: make release
    depends_on: prepare-puppeteer-release
    plugins:
      - ecr#v2.7.0:
          login: true
          account_ids: '014222686667'
          region: 'ap-southeast-1'
      - docker-compose#v3.9.0:
          run: plugin
          cache-from: plugin:014222686667.dkr.ecr.ap-southeast-1.amazonaws.com/opensource:latest
          image-repository: 014222686667.dkr.ecr.ap-southeast-1.amazonaws.com/opensource
"

# Upload the new pipeline and add it to the current build
echo "$PIPELINE" | buildkite-agent pipeline upload