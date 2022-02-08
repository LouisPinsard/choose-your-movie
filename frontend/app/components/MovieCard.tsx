import React, { useState } from "react";
import { Form } from "remix";
import styles from "styles/components/movie-card.css";
import { Movie } from "../routes/index";
import { Add } from "./icons/Add";
import { Added } from "./icons/Added";
import { Remove } from "./icons/Remove";
import { links as spinnerLinks } from "./Spinner";

export function links() {
  return [...spinnerLinks(), { rel: "stylesheet", href: styles }];
}

export const MovieCard: React.FunctionComponent<{
  movie: Movie;
}> = ({ movie }) => {
  const [displayAdded, setDisplayAdded] = useState(true);

  return (
    <div className="movie-card">
      <h2 className="movie-card__title">{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
        loading="lazy"
        width={200}
        height={300}
      />
      {movie.inCollection === true ? (
        <div
          onMouseEnter={() => setDisplayAdded((prevState) => !prevState)}
          onMouseLeave={() => setDisplayAdded((prevState) => !prevState)}
        >
          {displayAdded ? (
            <Added width={30} className="movie-card__added" />
          ) : (
            <Remove width={30} className="movie-card__removed" />
          )}
        </div>
      ) : (
        <Form
          style={{ display: "inline" }}
          method="post"
          action="/add-to-collection"
        >
          <input type="hidden" name="id" value={movie.id} />
          <button className="movie-card__button" type="submit">
            <Add width={30} className="movie-card__add" />
          </button>
        </Form>
      )}
    </div>
  );
};
