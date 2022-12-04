#!/bin/bash

set -euo pipefail

SEMANTIC_VERSION=$1

echo "Release with $SEMANTIC_VERSION version"

echo "Packaging build files..."

yarn renderer build

yarn renderer version