#!/bin/bash
set -e

echo "Running documentation validation tests..."

# 1. Lint Markdown files
node tests/lint-markdown.js

# 2. Check for broken links
node tests/check-links.js

# 3. Check for missing image references
node tests/check-images.js

echo "All documentation validation tests passed!"

