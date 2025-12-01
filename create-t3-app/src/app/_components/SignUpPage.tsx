'use client';
import React, { useEffect } from "react";
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import awsExports from "../../aws-exports";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { api } from "~/trpc/react";

Amplify.configure(awsExports as ResourcesConfig);

const SignUpPage = () => {
  const createUserMutation = api.user.createFromCognito.useMutation();

  // Sync user to backend after successful signup/login
  const syncUserToBackend = async (user: any) => {
    if (!user) return;

    try {
      // Extract Cognito user details from Authenticator user object
      // The user object contains userId (Cognito sub) and attributes
      const cognitoUserId = user?.userId || user?.username;
      const email = user?.signInDetails?.loginId || user?.attributes?.email;
      const name = user?.attributes?.name;

      if (!cognitoUserId || !email) {
        console.warn('Missing required user data for backend sync');
        return;
      }

      // Call backend to create/update user (idempotent)
      await createUserMutation.mutateAsync({
        cognitoUserId,
        email,
        name: name || undefined,
        emailVerified: user?.attributes?.email_verified === 'true',
      });
    } catch (error) {
      // Log error but don't block user experience
      // Lambda trigger will handle this as primary method anyway
      console.error('Failed to sync user to backend:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white pt-8">
      <div className="flex-1 w-full flex flex-col justify-center items-center mt-10">
        <h1 className="mb-8 text-2xl md:text-3xl font-medium text-gray-900 text-center">Get started</h1>
        <div className="w-full max-w-md">
          <Authenticator 
            signUpAttributes={['email']}
            hideSignUp={false}
          >
            {({ signOut, user }) => {
              // Sync user to backend when authenticated
              useEffect(() => {
                if (user) {
                  syncUserToBackend(user);
                }
              }, [user]);

              return (
                <main>
                  <h2>Welcome, {user?.username || user?.signInDetails?.loginId || "user"}!</h2>
                  <button onClick={signOut}>Sign out</button>
                </main>
              );
            }}
          </Authenticator>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
