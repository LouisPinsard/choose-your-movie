import React from "react";
import styles from "styles/components/movie-card.css";
import { Movie } from "../routes/index";
import { Add } from "./icons/Add";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const MovieCard: React.FunctionComponent<{
  movie: Movie;
  onClick: React.MouseEventHandler;
}> = ({ movie, onClick }) => {
  return (
    <div className="movie-card">
      <h2 className="movie-card__title">{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
        loading="lazy"
        width={200}
        height={300}
      />
      <Add onClick={onClick} width={30} className="movie-card__add" />
    </div>
  );
};
