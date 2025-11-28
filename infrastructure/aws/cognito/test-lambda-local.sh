#!/bin/bash
# Test Lambda function locally with real database
# Usage: ./test-lambda-local.sh

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== Testing Lambda Post-Confirmation Function Locally ==="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}Error: DATABASE_URL environment variable is not set${NC}"
  echo "Please set it in your .env file or export it:"
  echo "  export DATABASE_URL='postgresql://user:password@localhost:5432/dbname'"
  exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js is not installed${NC}"
  exit 1
fi

# Navigate to Lambda directory
cd "$(dirname "$0")"

# Create test event
TEST_EVENT='{
  "version": "1",
  "region": "us-east-1",
  "userPoolId": "test-pool-id",
  "userName": "testuser-'$(date +%s)'",
  "triggerSource": "PostConfirmation_ConfirmSignUp",
  "request": {
    "userAttributes": {
      "sub": "test-cognito-id-'$(date +%s)'",
      "email": "test-'$(date +%s)'@example.com",
      "email_verified": "true",
      "name": "Test User"
    }
  },
  "response": {}
}'

echo -e "${YELLOW}Test Event:${NC}"
echo "$TEST_EVENT" | jq .
echo ""

# Export DATABASE_URL for Lambda
export DATABASE_URL
export NODE_ENV=test

# Run Lambda handler using Node.js
echo -e "${YELLOW}Invoking Lambda handler...${NC}"
RESULT=$(echo "$TEST_EVENT" | node -e "
const { handler } = require('./lambda_build/index.js');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let input = '';
rl.on('line', line => input += line);
rl.on('close', async () => {
  try {
    const event = JSON.parse(input);
    const result = await handler(event);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
});
")

echo -e "${YELLOW}Lambda Response:${NC}"
echo "$RESULT" | jq .

# Extract cognitoUserId from event to verify user was created
COGNITO_USER_ID=$(echo "$TEST_EVENT" | jq -r '.request.userAttributes.sub')
EMAIL=$(echo "$TEST_EVENT" | jq -r '.request.userAttributes.email')

echo ""
echo -e "${YELLOW}Verifying user was created in database...${NC}"

# Check if user exists (using psql if available, or provide instructions)
if command -v psql &> /dev/null; then
  DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
  DB_PASS=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
  DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
  DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
  DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
  
  USER_CHECK=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM \"User\" WHERE \"cognitoUserId\" = '$COGNITO_USER_ID';" 2>/dev/null || echo "0")
  
  if [ "$USER_CHECK" -gt 0 ]; then
    echo -e "${GREEN}✅ User found in database!${NC}"
    echo ""
    echo "User details:"
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT id, \"cognitoUserId\", email, name, \"emailVerified\" FROM \"User\" WHERE \"cognitoUserId\" = '$COGNITO_USER_ID';" 2>/dev/null || true
  else
    echo -e "${RED}❌ User not found in database${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}psql not found. To verify manually, run:${NC}"
  echo "  SELECT * FROM \"User\" WHERE \"cognitoUserId\" = '$COGNITO_USER_ID';"
fi

echo ""
echo -e "${GREEN}✅ Lambda test completed successfully!${NC}"



