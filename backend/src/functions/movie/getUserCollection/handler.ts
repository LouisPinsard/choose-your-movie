import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import httpErrorHandler from "@middy/http-error-handler";
import { Paged } from "dynamodb-onetable";
import createHttpError from "http-errors";
import { table, UserMovie } from "src/models/tableSchema";

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

const getUserCollection: ValidatedEventAPIGatewayProxyEvent<undefined> = async (
  event
) => {
  if (event.pathParameters?.userId === undefined) {
    throw new createHttpError.BadRequest("Missing path parameters user id");
  }

  const dynamoDBResponse = (await table.queryItems(
    {
      PK: `user:${event.pathParameters.userId}`,
      SK: { begins: "movie:" },
    },
    { parse: true }
  )) as Paged<UserMovie>;

  return formatJSONResponse({ result: dynamoDBResponse });
};

export const main = middyfy(getUserCollection).use(httpErrorHandler());
