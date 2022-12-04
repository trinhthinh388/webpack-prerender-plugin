#!/bin/bash

set -euo pipefail

echo $SEMANTIC_VERSION

echo "Packaging deploy files..."

yarn renderer build

yarn npm whoami