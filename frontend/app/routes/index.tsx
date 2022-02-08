import { AxiosResponse } from "axios";
import classNames from "classnames";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData, useOutletContext } from "remix";
import styles from "styles/index.css";
import { v4 as uuid } from "uuid";
import { AccessToken, cookieHasExpired } from "~/auth/auth";
import { Carousel, links as carouselLinks } from "~/components/Carousel";
import { MovieCard, links as movieCardLinks } from "~/components/MovieCard";
import { OutletContextType } from "~/root";
import { idTokenCookie } from "~/service/cookies";
import { apiClient } from "~/service/network.server";

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
  inCollection?: boolean;
  vote_count: number;
}

type loaderData = {
  authUrl: string | undefined;
  movies: Movie[];
};

export interface ApiMovie {
  username: string;
  genreIds: Array<number>;
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  releaseDate: string;
}

export interface UserCollection {
  result: ApiMovie[];
}

export const links = () => [
  ...movieCardLinks(),
  ...carouselLinks(),
  { rel: "stylesheet", href: styles },
];

const getPopularMovies = async () => {
  const result = await apiClient.get<
    any,
    AxiosResponse<{
      results: Movie[];
    }>
  >("movie/popular");

  return result.data.results;
};

const getUserCollection = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await idTokenCookie.parse(cookieHeader)) as string | null;
  if (cookie === null) {
    console.log(cookie);

    return new Set();
  }
  const serializedCookie = jwtDecode<AccessToken>(cookie);

  const apiResult = await apiClient.get<any, AxiosResponse<UserCollection>>(
    `/movie/user/${serializedCookie.email}`,
    { withCredentials: true, headers: { Authorization: `Bearer ${cookie}` } }
  );

  return apiResult.data.result.reduce((previousValue, currentValue) => {
    previousValue.add(currentValue.id);

    return previousValue;
  }, new Set());
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<loaderData> => {
  const result = await getUserCollection(request);
  const moviesToDisplay = await getPopularMovies();
  const enrichedMovies = moviesToDisplay.map((movie) => {
    if (result.has(movie.id)) {
      movie.inCollection = true;
    }

    return movie;
  });

  return {
    authUrl: process.env.APP_AUTH_URL,
    movies: enrichedMovies,
  };
};

export default function Index() {
  const { isAuthenticated, email } = useOutletContext<OutletContextType>();
  const { authUrl, movies } = useLoaderData<loaderData>();
  const [displayAuthenticationError, setDisplayAuthenticationError] =
    useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (displayAuthenticationError) {
      timeout = setTimeout(() => {
        setDisplayAuthenticationError(false);
      }, 3500);
    }

    return () => {
      if (timeout !== undefined) {
        return clearTimeout(timeout);
      }

      return;
    };
  }, [displayAuthenticationError]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {isAuthenticated && email !== undefined ? (
        `Connected as ${email}`
      ) : (
        <a href={authUrl}>Log in</a>
      )}
      <div className="movies-container">
        <Carousel>
          {movies.map((movie) => (
            <MovieCard movie={movie} key={uuid()} />
          ))}
        </Carousel>
        {
          <div
            className={classNames("authentication-error", {
              "authentication-error--visible": displayAuthenticationError,
            })}
          >
            You must be logged in to add a movie to your collection
          </div>
        }
      </div>
    </div>
  );
}
