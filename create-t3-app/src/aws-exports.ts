// Copy values from `terraform output` here after applying your infrastructure.
// For example, run `terraform output -json` for easy copy/paste as JS values.
//
const awsExports = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_Srdpj1MYh",
      userPoolClientId: "8qi9rskr891mgett2kkalv088",
      loginWith: {
        oauth: {
          domain: "my-tutoring-center-demo.auth.us-east-1.amazoncognito.com",
          scopes: ["email", "openid", "profile"],
          redirectSignIn: ["http://localhost:3000/"],
          redirectSignOut: ["http://localhost:3000/"],
          responseType: "code" as const,
        },
        username: "true",
        email: "true",
      },
    },
  },
};

export default awsExports;
