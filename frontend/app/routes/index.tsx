import { AxiosResponse } from "axios";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData, useOutletContext } from "remix";
import styles from "styles/index.css";
import { Carousel, links as carouselLinks } from "~/components/Carousel";
import { MovieCard, links as movieCardLinks } from "~/components/MovieCard";
import { OutletContextType } from "~/root";
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
  movies: Movie[];
};

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

export const loader: LoaderFunction = async (): Promise<loaderData> => {
  return {
    authUrl: process.env.APP_AUTH_URL,
    movies: await getPopularMovies(),
  };
};

export default function Index() {
  const { isAuthenticated, email } = useOutletContext<OutletContextType>();
  const { authUrl, movies } = useLoaderData<loaderData>();
  const [displayAuthenticationError, setDisplayAuthenticationError] =
    useState(false);

  const onClick = (movie: Movie) => () => {
    if (!isAuthenticated) {
      setDisplayAuthenticationError(true);
    }
  };

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
            <MovieCard movie={movie} onClick={onClick(movie)} />
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
