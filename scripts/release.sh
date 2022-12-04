#!/bin/bash

set -euo pipefail

SEMANTIC_VERSION="$(buildkite-agent meta-data get "semantic-version")"

echo "Packaging deploy files..."

yarn renderer build

yarn npm whoami