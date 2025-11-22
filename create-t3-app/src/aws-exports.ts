// Copy values from `terraform output` here after applying your infrastructure.
// For example, run `terraform output -json` for easy copy/paste as JS values.
//
const awsExports = {
  Auth: {
    region: "us-east-1", // placeholder for dev; update using terraform outputs
    userPoolId: "us-east-1_dummyid", // placeholder
    userPoolWebClientId: "dummyclientid", // placeholder
    oauth: {
      domain: "dummy-domain.auth.us-east-1.amazoncognito.com",
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: "http://localhost:3000/",
      redirectSignOut: "http://localhost:3000/",
      responseType: 'code',
    },
  },
};

export default awsExports;
