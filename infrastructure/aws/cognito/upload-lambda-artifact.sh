#!/bin/bash
set -euo pipefail

# CONFIGURE THESE
LAMBDA_BUILD_DIR="lambda_build"
LAMBDA_SRC="$LAMBDA_BUILD_DIR/index.js"
LAMBDA_ZIP="lambda-post-confirmation.zip"
LAMBDA_S3_BUCKET="${LAMBDA_S3_BUCKET:-lambda-artifacts-$(whoami)-$(date +%s)}" # Auto-generate if not set
LAMBDA_S3_PREFIX="lambda-artifacts"

# Generate unique key for each upload (timestamped)
TS=$(date +%Y%m%d%H%M%S)
LAMBDA_S3_KEY="$LAMBDA_S3_PREFIX/index-$TS.zip"

cd "$(dirname "$0")"

# Ensure handler file exists
if [[ ! -f "$LAMBDA_SRC" ]]; then
  echo "❌ Handler file $LAMBDA_SRC not found!"
  echo "Please build your Lambda first (compile TypeScript to JS in $LAMBDA_BUILD_DIR/)"
  exit 2
fi

# Create S3 bucket if it doesn't exist (idempotent)
if ! aws s3 ls "s3://$LAMBDA_S3_BUCKET" 2>/dev/null; then
  echo "📦 Creating S3 bucket: $LAMBDA_S3_BUCKET"
  aws s3 mb "s3://$LAMBDA_S3_BUCKET" || {
    echo "⚠️  Bucket might already exist or you need different permissions. Continuing..."
  }
fi

# Zip the handler file as index.js (Lambda expects index.handler)
rm -f "$LAMBDA_ZIP"
cd "$LAMBDA_BUILD_DIR"
zip -q "../$LAMBDA_ZIP" index.js
cd ..

echo "📤 Uploading Lambda artifact to S3..."
aws s3 cp "$LAMBDA_ZIP" "s3://$LAMBDA_S3_BUCKET/$LAMBDA_S3_KEY"

S3URI="s3://$LAMBDA_S3_BUCKET/$LAMBDA_S3_KEY"
echo ""
echo "✅ Lambda artifact uploaded: $S3URI"
echo ""
echo "📝 Add these to your terraform.tfvars or pass via CLI:"
echo "   lambda_artifact_s3_bucket = \"$LAMBDA_S3_BUCKET\""
echo "   lambda_artifact_s3_key    = \"$LAMBDA_S3_KEY\""
echo ""
echo "💡 Or export and run terraform apply:"
echo "   export TF_VAR_lambda_artifact_s3_bucket=\"$LAMBDA_S3_BUCKET\""
echo "   export TF_VAR_lambda_artifact_s3_key=\"$LAMBDA_S3_KEY\""
echo "   terraform apply"
