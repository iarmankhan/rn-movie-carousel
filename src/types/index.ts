export interface APIResponse {
  page: number;
  results: Result[];
}

export interface Result {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Movie {
  key: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  description: string;
  releaseDate: Date;
  genres: string[];
}
