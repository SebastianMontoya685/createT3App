# Testing Lambda Function

You have several ways to test your Lambda function:

## 1. Unit Tests (Mocked Prisma)

Run the existing Jest unit tests:

```bash
cd infrastructure/aws/cognito
npm test
```

These tests mock Prisma and verify the Lambda logic without a real database.

## 2. Local Integration Test (Real Database)

Test the Lambda function locally with your actual database:

### Option A: TypeScript Script (Recommended)

```bash
cd infrastructure/aws/cognito
DATABASE_URL="postgresql://user:password@localhost:5432/dbname" npx tsx test-lambda-local.ts
```

Or if you have ts-node:
```bash
DATABASE_URL="postgresql://..." npx ts-node test-lambda-local.ts
```

### Option B: Shell Script

```bash
cd infrastructure/aws/cognito
export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
./test-lambda-local.sh
```

**What it tests:**
- ✅ Lambda handler creates user in database
- ✅ Idempotency (calling twice doesn't create duplicates)
- ✅ Verifies user exists in database after creation
- ✅ Cleans up test data

## 3. Test in AWS Lambda Console

1. Go to AWS Lambda Console
2. Find your `cognito-post-confirmation-sync` function
3. Click "Test" tab
4. Create a new test event with this JSON:

```json
{
  "version": "1",
  "region": "us-east-1",
  "userPoolId": "your-pool-id",
  "userName": "testuser",
  "triggerSource": "PostConfirmation_ConfirmSignUp",
  "request": {
    "userAttributes": {
      "sub": "test-cognito-id-123",
      "email": "test@example.com",
      "email_verified": "true",
      "name": "Test User"
    }
  },
  "response": {}
}
```

5. Click "Test" and check CloudWatch logs for results

## 4. End-to-End Test (Real Cognito Signup)

1. Sign up a new user through your app's signup flow
2. Confirm their email in Cognito
3. Check CloudWatch logs for Lambda execution
4. Verify user appears in your database:

```sql
SELECT * FROM "User" WHERE "cognitoUserId" = 'cognito-user-id-here';
```

## Troubleshooting

**Lambda not being invoked:**
- Check Lambda is attached to Cognito User Pool trigger
- Verify Lambda permissions allow Cognito to invoke
- Check CloudWatch logs for errors

**Database connection errors:**
- Verify DATABASE_URL is correct in Lambda environment variables
- Check database security groups allow Lambda VPC access
- Consider using RDS Proxy for connection pooling

**User not created:**
- Check CloudWatch logs for Lambda errors
- Verify Prisma schema matches database
- Check database constraints/unique indexes



