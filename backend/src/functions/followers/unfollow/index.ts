import { handlerPath } from "@libs/handler-resolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    TABLE_NAME: "${construct:chooseYourMovieTable.tableName}",
    TMDB_API_KEY: "${env:TMDB_API_KEY}",
  },
  events: [
    {
      http: {
        method: "post",
        path: "followers/unfollow",
        authorizer: {
          name: "chooseYourMovieAuthorizer",
          arn: "${self:custom.userPoolArn}",
          type: "COGNITO_USER_POOLS",
          providerArns: ["${self:custom.providerArn}"],
        },
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
