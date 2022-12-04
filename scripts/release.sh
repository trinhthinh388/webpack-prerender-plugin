#!/bin/bash

set -euo pipefail

echo $(buildkite-agent meta-data get "semantic-version")