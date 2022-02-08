import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "frontend",
  useDotenv: true,
  frameworkVersion: "3",
  plugins: ["serverless-lift", "serverless-esbuild"],
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
  functions: {
    backend: {
      handler: "server/index.handler",
      environment: {
        BASE_API_URL: "${env:BASE_API_URL}",
        APP_AUTH_URL: "${env:APP_AUTH_URL}",
      },
      events: [
        {
          httpApi: {
            method: "any",
            path: "/{proxy+}",
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
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
    website: {
      type: "server-side-website",
      assets: {
        "/build/*": "public/build/",
      },
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = serverlessConfiguration;
