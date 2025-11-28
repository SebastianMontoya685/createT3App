#!/bin/bash
# Test the tRPC backend signup mutation (user.createFromCognito)
# Usage: ./scripts/test-user-signup.sh
#
# Note: This uses the tRPC HTTP format with superjson transformer.
# The input must be wrapped in {"json": {...}} format.

PAYLOAD='{
  "json": {
    "cognitoUserId": "local-cognito-id-001",
    "email": "testuser@example.com",
    "name": "Test User",
    "emailVerified": true
  }
}'

echo "=== Testing user.createFromCognito ==="
echo "Payload:"
echo "$PAYLOAD" | jq .
echo ""

RESPONSE=$(curl -s -X POST "http://localhost:3000/api/trpc/user.createFromCognito" \
  -H "Content-Type: application/json" \
  -H "trpc-accept: application/json" \
  -d "$PAYLOAD")

echo "Response:"
echo "$RESPONSE" | jq .

# Check if successful
if echo "$RESPONSE" | jq -e '.result.data.json.success' > /dev/null 2>&1; then
  echo ""
  echo "✅ Success! User created/updated."
  echo "$RESPONSE" | jq '.result.data.json.user'
else
  echo ""
  echo "❌ Error occurred"
  exit 1
fi