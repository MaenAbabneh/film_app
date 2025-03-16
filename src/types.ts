import { Key } from "react";

interface Movie {
  $id: Key | null | undefined;
  poster_url: string | undefined;
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  original_language: string;
  // Add any other properties of the movie as needed
}

export default Movie;

