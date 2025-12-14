#!/bin/bash
# Wrapper script to run Expo CLI when bin-links aren't available
cd "$(dirname "$0")"
node node_modules/@expo/cli/build/bin/cli "$@"