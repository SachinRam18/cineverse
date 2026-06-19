export interface Genre {
  id: number;
  name: string;
}

export interface TvSeason {
  id: number;
  name: string;
  overview: string;
  air_date: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
}

export interface TvEpisode {
  id: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string | null;
  episode_number: number;
  runtime?: number;
}

export interface Movie {
  id: number;
  media_type?: "movie" | "tv";
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: Genre[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  original_name?: string;
  video: boolean;
  runtime?: number;
  episode_run_time?: number[];
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  trailer_key?: string;
  imdb_id?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: TvSeason[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieDetails extends Movie {
  credits?: MovieCredits;
  similar?: Movie[];
  videos?: MovieVideo[];
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface WatchlistItem {
  movie: Movie;
  addedAt: string;
}

export interface ContinueWatchingItem {
  movie: Movie;
  progress: number; // 0-100
  watchedAt: string;
}

export type SortOption = "popularity" | "vote_average" | "release_date" | "title";
export type FilterGenre = number | null;
