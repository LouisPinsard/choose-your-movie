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

const unfollow: ValidatedEventAPIGatewayProxyEventWithAutorizer<
  typeof schema
> = async (event) => {
  const transaction = {};
  await table.getModel<Follower>("Follower").remove(
    {
      username: event.body.userId,
      followerUsername: event.requestContext.authorizer.claims.email,
    },
    { transaction }
  );

  await table.getModel<Subscriber>("Subscriber").remove(
    {
      username: event.requestContext.authorizer.claims.email,
      subscriberUsername: event.body.userId,
    },
    {
      transaction,
    }
  );

  await table.transact("write", transaction);

  return { statusCode: 204, body: "" };
};

export const main = middyfy(unfollow).use(httpErrorHandler());
