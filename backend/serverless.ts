import type { AWS } from "@serverless/typescript";
import { createStack } from "cdk/stack";
import * as functions from "@functions/index";

const { stack, app, resources } = createStack();

const serverlessConfiguration: AWS = {
  service: "backend",
  useDotenv: true,
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-lift"],
  provider: {
    name: "aws",
    region: "eu-west-1",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  functions: { ...functions },
  package: { individually: true },
  custom: {
    cognitoAppClientId: stack.resolve(
      resources.userPoolAppClient.userPoolClientId
    ),
    userPoolArn: stack.resolve(resources.userPool.userPoolArn),
    providerArn: stack.resolve(resources.userPoolIdentityProvider.ref),
    cognitoAppClientSecret: "${env:COGNITO_APP_CLIENT_SECRET}",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructs: {
    chooseYourMovieTable: {
      type: "database/dynamodb-single-table",
      gsiCount: 0,
      localSecondaryIndexes: true,
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  resources: app.synth().getStackByName(stack.stackName).template,
};

module.exports = serverlessConfiguration;
