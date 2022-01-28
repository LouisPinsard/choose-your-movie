import {
  CfnUserPoolIdentityProvider,
  IUserPoolIdentityProvider,
  UserPool,
  UserPoolClientIdentityProvider,
} from "@aws-cdk/aws-cognito";
import { Stack } from "@aws-cdk/core";

export const createCognitoResources = (stack: Stack) => {
  const userPool = new UserPool(stack, "chooseYourMovieUserPool", {
    autoVerify: { email: true },
    standardAttributes: { email: {} },
  });

  userPool.addDomain("userPoolDomain", {
    cognitoDomain: {
      domainPrefix: "choose-your-movie",
    },
  });

  const userPoolIdentityProvider = new CfnUserPoolIdentityProvider(
    stack,
    "chooseYourMovieUserPoolIdentityProvider",
    {
      providerDetails: {
        client_id: process.env.GOOGLE_APP_CLIENT_ID,
        client_secret: process.env.GOOGLE_APP_CLIENT_SECRET,
        authorize_scopes: "phone email openid profile",
      },
      providerType: "Google",
      providerName: "Google",
      attributeMapping: {
        email: "email",
        name: "name",
      },
      userPoolId: userPool.userPoolId,
    }
  );

  userPool.registerIdentityProvider(
    userPoolIdentityProvider as unknown as IUserPoolIdentityProvider
  );

  const userPoolAppClient = userPool.addClient("appUserPoolClient", {
    supportedIdentityProviders: [UserPoolClientIdentityProvider.GOOGLE],
    oAuth: {
      callbackUrls: ["http://localhost:3000/callback"],
    },
    generateSecret: true,
  });

  return {
    userPool,
    userPoolAppClient,
  };
};
