import axios, { AxiosResponse } from "axios";
import jwtDecode from "jwt-decode";
import { createCookie, LoaderFunction, useLoaderData } from "remix";
import styles from "styles/index.css";
import { tokenHasExpired } from "~/auth/auth";
import { Carousel, links as carouselLinks } from "~/components/Carousel";
import { MovieCard, links as movieCardLinks } from "~/components/MovieCard";
import { apiClient } from "~/service/network";
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

type loaderData = {
  authUrl: string | undefined;
  isAuthenticated: boolean;
  email?: string;
  movies: Movie[];
};

type IdToken = {
  sub: string;
  aud: string;
  email_verified: boolean;
  token_use: string;
  auth_time: number;
  iss: string;
  "cognito:username": string;
  exp: number;
  given_name: string;
  iat: number;
  email: string;
  jti: string;
  origin_jti: string;
};

export const links = () => [
  ...movieCardLinks(),
  ...carouselLinks(),
  { rel: "stylesheet", href: styles },
];

const getAuthData = async (request: Request) => {
  const idTokenCookie = createCookie("idToken");
  let idTokenValue;
  try {
    idTokenValue = (await idTokenCookie.parse(
      request.headers.get("Cookie")
    )) as string | undefined;
  } catch (error) {
    return {
      isAuthenticated: false,
    };
  }

  let decodedToken;
  if (idTokenValue !== undefined) {
    try {
      decodedToken = jwtDecode<IdToken>(idTokenValue);
    } catch (error) {
      return {
        isAuthenticated: false,
      };
    }
  }

  return {
    isAuthenticated: decodedToken ? !tokenHasExpired(decodedToken) : false,
    email: decodedToken?.email,
  };
};

const getPopularMovies = async () => {
  const result = await apiClient.get<
    any,
    AxiosResponse<{
      results: Movie[];
    }>
  >("movie/popular");

  return result.data.results;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<loaderData> => {
  return {
    authUrl: process.env.APP_AUTH_URL,
    ...(await getAuthData(request)),
    movies: await getPopularMovies(),
  };
};

export default function Index() {
  const { isAuthenticated, authUrl, email, movies } =
    useLoaderData<loaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {isAuthenticated && email !== undefined ? (
        `Connected as ${email}`
      ) : (
        <a href={authUrl}>Log in</a>
      )}
      <div>
        <Carousel>
          {movies.map((movie) => (
            <MovieCard movie={movie} />
          ))}
        </Carousel>
      </div>
    </div>
  );
}
