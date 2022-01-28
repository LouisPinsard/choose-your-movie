import { App, Stack } from "@aws-cdk/core";
import { createCognitoResources } from "./cognito";

export const createStack = () => {
  const app = new App();
  const stack = new Stack(app);

  const cognitoResources = createCognitoResources(stack);

  return { stack, app, resources: { ...cognitoResources } };
};
