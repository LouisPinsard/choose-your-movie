import { ValidatedEventAPIGatewayProxyEventWithAutorizer } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import httpErrorHandler from "@middy/http-error-handler";
import { Follower, Subscriber, table } from "src/models/tableSchema";
import schema from "./schema";

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const follow: ValidatedEventAPIGatewayProxyEventWithAutorizer<
  typeof schema
> = async (event) => {
  const transaction = {};
  await table.getModel<Follower>("Follower").create(
    {
      username: event.body.userId,
      followerUsername: event.requestContext.authorizer.claims.email,
    },
    { transaction }
  );

  await table.getModel<Subscriber>("Subscriber").create(
    {
      username: event.requestContext.authorizer.claims.email,
      subscriberUsername: event.body.userId,
    },
    {
      transaction,
    }
  );

  await table.transact("write", transaction);

  return { statusCode: 201, body: "" };
};

export const main = middyfy(follow).use(httpErrorHandler());
