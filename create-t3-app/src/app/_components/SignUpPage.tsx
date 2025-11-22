'use client';
import React from "react";
import { Amplify, ResourcesConfig } from 'aws-amplify';
import awsExports from "../../aws-exports";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const typedAwsExports: ResourcesConfig = awsExports;
Amplify.configure(typedAwsExports);

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white pt-8">
      <div className="flex-1 w-full flex flex-col justify-center items-center mt-10">
        <h1 className="mb-8 text-2xl md:text-3xl font-medium text-gray-900 text-center">Get started</h1>
        <div className="w-full max-w-md">
          <Authenticator
            signUpAttributes={['email']}
            components={{
              SignUp: {
                FormFields: (props: any) => {
                  const fields = props?.fields || props?.defaultFields;
                  return (
                    <>
                      {fields?.email}
                      {fields?.password}
                    </>
                  );
                },
              },
            }}
          >
            {({ signOut, user }) => (
              <main>
                <h2>Welcome, {user?.username || user?.signInDetails?.loginId || "user"}!</h2>
                <button onClick={signOut}>Sign out</button>
              </main>
            )}
          </Authenticator>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
