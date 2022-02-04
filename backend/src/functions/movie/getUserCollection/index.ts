import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    TABLE_NAME: "${construct:chooseYourMovieTable.tableName}",
    TMDB_API_KEY: "${env:TMDB_API_KEY}",
  },
  events: [
    {
      http: {
        method: "get",
        path: "movie/user/{userId}",
        request: {
          parameters: {
            paths: {
              userId: true,
            },
          },
        },
      },
    },
  ],
};
