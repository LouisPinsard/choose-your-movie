import axios from "axios";
import createHttpError from "http-errors";

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

tmdbClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      throw new createHttpError[error.response.status](error.message);
    }

    return Promise.reject(error);
  }
);

export { tmdbClient };
