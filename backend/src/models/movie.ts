export const UserMovie = {
  PK: { type: String, value: "user:${username}" },
  SK: { type: String, value: "movie:${id}" },
  username: { type: String, required: true },
  genreIds: { type: Array },
  id: { type: Number, required: true },
  title: { type: String, required: true },
  overview: { type: String, required: true },
  posterPath: { type: String, required: true },
  popularity: { type: Number, required: true },
  voteAverage: { type: Number, required: true },
  voteCount: { type: Number, required: true },
  releaseDate: { type: String, required: true },
} as const;
