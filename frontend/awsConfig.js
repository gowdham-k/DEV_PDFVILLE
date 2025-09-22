const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-2_LeVlFHGOf",
      userPoolClientId: "1u8apgpumk8dbnkeaomu9alv67",
      loginWith: {
        username: true,
        email: true,
      },
    },
    region: "ap-southeast-2", // Changed from ap-southeast-2
  },
};

export default awsConfig;