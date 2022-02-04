import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEventWithAutorizer,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import httpErrorHandler from "@middy/http-error-handler";
import { AxiosResponse } from "axios";
import { table, UserMovie } from "src/models/tableSchema";
import { tmdbClient } from "src/services/apiClient/tmdb";
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

const addToCollection: ValidatedEventAPIGatewayProxyEventWithAutorizer<
  typeof schema
> = async (event) => {
  const { data } = await tmdbClient.get<any, AxiosResponse<Movie>>(
    `/movie/${event.body.id}`
  );

  const dynamoDBResponse = await table.getModel<UserMovie>("UserMovie").create({
    ...data,
    genreIds: data.genre_ids,
    voteAverage: data.vote_average,
    voteCount: data.vote_count,
    posterPath: data.poster_path,
    releaseDate: data.release_date,
    username: event.requestContext.authorizer.claims.email,
  });

  return formatJSONResponse(dynamoDBResponse);
};

export const main = middyfy(addToCollection).use(httpErrorHandler());
