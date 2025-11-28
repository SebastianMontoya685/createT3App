#!/bin/bash
# Script to rebuild the Prisma Lambda layer
# This should be run whenever the Prisma schema changes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LAYER_DIR="$SCRIPT_DIR/prisma-layer/nodejs"

echo "🔨 Rebuilding Prisma Lambda layer..."

# Navigate to layer directory
cd "$LAYER_DIR"

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate --schema=prisma/schema.prisma

# Navigate back to cognito directory
cd "$SCRIPT_DIR"

# Remove old zip
rm -f prisma-layer.zip

# Create new zip (excluding macOS binary and cache)
echo "📦 Creating prisma-layer.zip..."
zip -r prisma-layer.zip nodejs/ \
  -x "*.git*" \
  -x "*.DS_Store" \
  -x "node_modules/.cache/*" \
  -x "node_modules/.prisma/client/libquery_engine-darwin-arm64.dylib.node" \
  > /dev/null

echo "✅ Prisma layer rebuilt successfully!"
echo "📤 Upload prisma-layer.zip to AWS Lambda layer or run 'terraform apply'"

