import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import axios, { AxiosResponse } from "axios";
import createError from "http-errors";
import httpErrorHandler from "@middy/http-error-handler";

type TmdbApiResponse = {
  results: {
    title: string;
    vote_average: string;
    id: string;
    poster_path?: string;
  }[];
};

const popularMovie: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  try {
    const result = await axios.get<any, AxiosResponse<TmdbApiResponse>>(
      "https://api.themoviedb.org/3/movie/popular?api_key=1da6c757390b4663d8e454b29d7730b4&language=en-US&page=1"
    );

    return formatJSONResponse(result.data);
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        throw new createError[error.response.status]("Invalid api call");
      }
    }
    throw new createError.InternalServerError();
  }
};

export const main = middyfy(popularMovie).use(httpErrorHandler());
