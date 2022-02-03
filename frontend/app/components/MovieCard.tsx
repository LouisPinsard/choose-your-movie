import styles from "styles/components/movie-card.css";
import { Movie } from "../routes/index";
import { Add } from "./icons/Add";

export function links() {
  return [
    {
      rel: "preload",
      href: "../../icons/add.svg",
      as: "image",
      type: "image/svg+xml",
    },
    { rel: "stylesheet", href: styles },
  ];
}

export const MovieCard: React.FunctionComponent<{ movie: Movie }> = ({
  movie,
}) => {
  return (
    <div className="movie-card">
      <h2 className="movie-card__title">{movie.title}</h2>
      <img src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} />
      <Add width={30} className="movie-card__add" />
    </div>
  );
};
