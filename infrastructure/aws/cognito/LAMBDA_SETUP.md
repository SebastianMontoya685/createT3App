# Cognito Post-Confirmation Lambda Setup Guide

This guide explains how to set up the Lambda function that automatically syncs Cognito signups to your backend database. **This is the PRIMARY and MOST SCALABLE method** for handling 100k+ signups.

## Why Lambda Trigger?

- ✅ **Serverless & Auto-Scaling**: Handles 100k+ concurrent requests automatically
- ✅ **No Client Dependency**: Works even if user closes browser
- ✅ **Automatic Retries**: AWS handles retries on failure
- ✅ **Idempotent**: Safe to retry multiple times
- ✅ **Zero Infrastructure**: No servers to manage

## Setup Steps

### 1. Create Lambda Function

1. Go to AWS Lambda Console
2. Click "Create function"
3. Choose "Author from scratch"
4. Name: `cognito-post-confirmation-sync`
5. Runtime: `Node.js 20.x` (or latest LTS)
6. Architecture: `x86_64`
7. Click "Create function"

### 2. Deploy Lambda Code

**Option A: Using AWS Console**
1. Copy the code from `lambda-post-confirmation.ts`
2. Convert to JavaScript or use TypeScript with esbuild
3. Paste into Lambda function code editor
4. Set handler to: `index.handler`

**Option B: Using Terraform (Recommended)**
Add to your Terraform configuration:

```hcl
resource "aws_lambda_function" "cognito_post_confirmation" {
  filename         = "lambda-post-confirmation.zip"
  function_name    = "cognito-post-confirmation-sync"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs20.x"
  source_code_hash = filebase64sha256("lambda-post-confirmation.zip")

  environment {
    variables = {
      DATABASE_URL = var.database_url
      NODE_ENV     = "production"
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "cognito-post-confirmation-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Grant Cognito permission to invoke Lambda
resource "aws_lambda_permission" "cognito_trigger" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_confirmation.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}
```

### 3. Configure Environment Variables

In Lambda function configuration, add:
- `DATABASE_URL`: Your PostgreSQL connection string (use AWS Secrets Manager for production!)
- `NODE_ENV`: `production`

**⚠️ SECURITY**: For production, use AWS Secrets Manager instead of environment variables:
```typescript
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secretsClient = new SecretsManagerClient({});
const secret = await secretsClient.send(
  new GetSecretValueCommand({ SecretId: "your-database-secret" })
);
const { DATABASE_URL } = JSON.parse(secret.SecretString || "{}");
```

### 4. Attach Lambda to Cognito User Pool

**Using AWS Console:**
1. Go to Cognito User Pool
2. Navigate to "User pool properties" > "Lambda triggers"
3. Find "Post confirmation" trigger
4. Select your Lambda function
5. Save changes

**Using Terraform:**
Add to your `main.tf`:

```hcl
resource "aws_cognito_user_pool" "main" {
  # ... existing configuration ...

  lambda_config {
    post_confirmation = aws_lambda_function.cognito_post_confirmation.arn
  }
}
```

### 5. Set Lambda Timeout & Memory

- **Timeout**: 30 seconds (should be enough for DB operation)
- **Memory**: 256 MB (minimum, increase if needed)
- **Reserved Concurrency**: Leave unlimited for auto-scaling

### 6. Test the Lambda

1. Create a test user in Cognito
2. Confirm their email
3. Check Lambda logs in CloudWatch
4. Verify user appears in your database

## Monitoring & Debugging

### CloudWatch Logs
- Lambda automatically logs to CloudWatch
- Check logs for errors or debugging info
- Set up CloudWatch alarms for Lambda errors

### Database Monitoring
- Monitor database connection pool
- Watch for connection limits under high load
- Consider RDS Proxy for connection pooling

## Performance Optimization

### For 100k+ Signups:

1. **Database Connection Pooling**
   - Use RDS Proxy or PgBouncer
   - Configure Prisma connection pool size

2. **Lambda Configuration**
   - Increase memory if needed (more memory = more CPU)
   - Enable provisioned concurrency for zero cold starts (optional, costs more)

3. **Database Indexes**
   - Ensure `cognitoUserId` and `email` are indexed (already in schema)

4. **Idempotency**
   - Lambda function is idempotent (safe to retry)
   - Database constraints prevent duplicates

## Fallback Strategy

The client-side callback in `SignUpPage.tsx` serves as a backup:
- If Lambda fails, client will try to sync
- Provides immediate feedback to user
- Not required for functionality (Lambda is primary)

## Cost Estimation

For 100k signups:
- Lambda invocations: ~$0.20 (first 1M requests free tier)
- Lambda duration: ~$0.50 (assuming 500ms avg, 256MB)
- **Total: ~$0.70 for 100k signups** (extremely cost-effective!)

## Troubleshooting

**Lambda not being invoked:**
- Check Lambda permissions (Cognito must be allowed to invoke)
- Verify Lambda is attached to User Pool trigger
- Check CloudWatch logs for errors

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check database security groups allow Lambda VPC access
- Consider using RDS Proxy for connection pooling

**User not appearing in database:**
- Check Lambda logs in CloudWatch
- Verify Prisma schema matches database
- Check database constraints/unique indexes

