/**
 * Local integration test for Lambda Post-Confirmation function
 * Tests the Lambda with a real database connection
 * 
 * Usage:
 *   cd infrastructure/aws/cognito
 *   DATABASE_URL="postgresql://..." npx tsx test-lambda-local.ts
 * 
 * Or compile and run:
 *   npx tsc test-lambda-local.ts --esModuleInterop --module commonjs --target es2020
 *   DATABASE_URL="postgresql://..." node test-lambda-local.js
 */

import { handler } from './lambda-post-confirmation';

// Load DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set');
  console.error('Set it from your .env file or export it:');
  console.error('  export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"');
  process.exit(1);
}

// Set environment variable for Lambda handler
process.env.DATABASE_URL = DATABASE_URL;
process.env.NODE_ENV = 'test';

// Import PrismaClient for verification
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function testLambda() {
  console.log('=== Testing Lambda Post-Confirmation Function ===\n');

  // Generate unique test data
  const timestamp = Date.now();
  const cognitoUserId = `test-cognito-id-${timestamp}`;
  const email = `test-${timestamp}@example.com`;
  const name = 'Test User';

  const testEvent = {
    version: '1',
    region: 'us-east-1',
    userPoolId: 'test-pool-id',
    userName: `testuser-${timestamp}`,
    triggerSource: 'PostConfirmation_ConfirmSignUp',
    request: {
      userAttributes: {
        sub: cognitoUserId,
        email: email,
        email_verified: 'true',
        name: name,
      },
    },
    response: {},
  };

  console.log('Test Event:');
  console.log(JSON.stringify(testEvent, null, 2));
  console.log('');

  try {
    // Clean up any existing test user first
    try {
      await prisma.user.deleteMany({
        where: {
          cognitoUserId: cognitoUserId,
        },
      });
    } catch (e) {
      // Ignore if user doesn't exist
    }

    // Invoke Lambda handler
    console.log('Invoking Lambda handler...\n');
    const result = await handler(testEvent as any);

    console.log('Lambda Response:');
    console.log(JSON.stringify(result, null, 2));
    console.log('');

    // Verify user was created in database
    console.log('Verifying user was created in database...\n');
    const user = await prisma.user.findUnique({
      where: { cognitoUserId: cognitoUserId },
    });

    if (!user) {
      console.error('❌ Error: User was not created in database');
      process.exit(1);
    }

    console.log('✅ User found in database!');
    console.log('User details:');
    console.log(JSON.stringify(user, null, 2));
    console.log('');

    // Test idempotency - call again
    console.log('Testing idempotency (calling again)...\n');
    const result2 = await handler(testEvent as any);
    const user2 = await prisma.user.findUnique({
      where: { cognitoUserId: cognitoUserId },
    });

    if (!user2 || user2.id !== user.id) {
      console.error('❌ Error: Idempotency test failed');
      process.exit(1);
    }

    console.log('✅ Idempotency test passed (user not duplicated)');
    console.log('');

    // Clean up
    console.log('Cleaning up test user...');
    await prisma.user.delete({
      where: { cognitoUserId: cognitoUserId },
    });
    console.log('✅ Test user deleted');

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testLambda().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

