import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { AxiosResponse } from "axios";
import httpErrorHandler from "@middy/http-error-handler";
import { tmdbClient } from "src/services/apiClient/tmdb";

type TmdbApiResponse = {
  results: {
    title: string;
    vote_average: string;
    id: string;
    poster_path?: string;
  }[];
};

const popularMovie: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  const result = await tmdbClient.get<any, AxiosResponse<TmdbApiResponse>>(
    "/movie/popular?language=en-US&page=1"
  );

  return formatJSONResponse(result.data);
};

export const main = middyfy(popularMovie).use(httpErrorHandler());
