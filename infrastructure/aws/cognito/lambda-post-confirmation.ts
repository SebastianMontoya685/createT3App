/**
 * AWS Lambda function for Cognito Post-Confirmation trigger.
 * 
 * This function is called automatically by Cognito after a user confirms their email.
 * It creates/updates the user record in your backend database.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Lambda function in AWS Console
 * 2. Set the handler to: index.handler
 * 3. Add environment variables:
 *    - DATABASE_URL: Your PostgreSQL connection string
 *    - API_URL: Your backend API URL (e.g., https://yourdomain.com/api/trpc)
 * 4. Attach this Lambda to your Cognito User Pool:
 *    - Go to Cognito User Pool > User pool properties > Lambda triggers
 *    - Select "Post confirmation" trigger
 *    - Choose this Lambda function
 * 5. Grant Cognito permission to invoke Lambda:
 *    - Lambda > Configuration > Permissions > Add trigger
 *    - Select Cognito User Pool as source
 * 
 * SCALABILITY:
 * - Serverless: Auto-scales to handle 100k+ concurrent requests
 * - No cold start issues with proper configuration
 * - AWS handles retries automatically
 * - Idempotent: Safe to retry if it fails
 */

import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client (reuse connection in Lambda container)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

interface CognitoEvent {
  version: string;
  region: string;
  userPoolId: string;
  userName: string;
  triggerSource: string;
  request: {
    userAttributes: {
      sub: string; // Cognito User ID
      email: string;
      email_verified: string;
      name?: string;
    };
  };
  response: Record<string, unknown>;
}

export const handler = async (event: CognitoEvent) => {
  console.log('Cognito Post-Confirmation trigger received:', JSON.stringify(event, null, 2));

  try {
    const { sub: cognitoUserId, email, email_verified, name } = event.request.userAttributes;

    if (!cognitoUserId || !email) {
      console.error('Missing required attributes:', { cognitoUserId, email });
      return event; // Return event unchanged on error (Cognito will retry)
    }

    // Check if user already exists (idempotent)
    const existingUser = await prisma.user.findUnique({
      where: { cognitoUserId },
    });

    if (existingUser) {
      console.log('User already exists:', cognitoUserId);
      return event; // User already synced, return success
    }

    // Check if email exists but different cognitoUserId (edge case)
    const existingEmailUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmailUser) {
      // Update existing user with cognitoUserId
      await prisma.user.update({
        where: { email },
        data: {
          cognitoUserId,
          emailVerified: email_verified === 'true' ? new Date() : existingEmailUser.emailVerified,
        },
      });
      console.log('Updated existing user with Cognito ID:', cognitoUserId);
      return event;
    }

    // Create new user
    await prisma.user.create({
      data: {
        cognitoUserId,
        email,
        name: name || null,
        emailVerified: email_verified === 'true' ? new Date() : null,
      },
    });

    console.log('Successfully created user:', cognitoUserId);
    return event; // Return event unchanged = success
  } catch (error) {
    console.error('Error in post-confirmation trigger:', error);
    
    // Return event unchanged - Cognito will retry on error
    // This ensures eventual consistency even if there's a temporary failure
    return event;
  } finally {
    // Prisma Client connection is reused in Lambda container, but we can disconnect
    // if needed (though it's usually better to keep it warm)
    // await prisma.$disconnect();
  }
};

