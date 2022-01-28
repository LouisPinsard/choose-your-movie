import { handlerPath } from "@libs/handler-resolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    // we should maybe use SSM to store those variables ?
    COGNITO_APP_CLIENT_ID: "${self:custom.cognitoAppClientId}",
    COGNITO_APP_CLIENT_SECRET: "${self:custom.cognitoAppClientSecret}",
  },
  events: [
    {
      http: {
        method: "post",
        path: "login",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
