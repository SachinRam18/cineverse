import { Movie, MovieDetails, MovieResponse, MovieVideo } from "@/types/movie";
import {
  MOCK_MOVIES,
  getTrending,
  getTopRated,
  getNewReleases,
  getByGenre,
  searchMovies,
  getMovieById,
  getTvById,
  getTrendingTv,
  getPopularTv,
  getTopRatedTv,
  searchTv,
} from "@/lib/mock-data";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

type MediaType = "movie" | "tv";

async function tmdbFetch<T>(endpoint: string): Promise<T | null> {
  if (!API_KEY) return null;

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE}${endpoint}${separator}api_key=${API_KEY}&language=en-US`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchTrending(): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>("/trending/movie/week");
  return (data?.results ?? getTrending()).map((m) => ({ ...m, media_type: "movie" as const }));
}

export async function fetchPopular(): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>("/movie/popular");
  return (data?.results ?? getTrending()).map((m) => ({ ...m, media_type: "movie" as const }));
}

export async function fetchTopRated(): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>("/movie/top_rated");
  return (data?.results ?? getTopRated()).map((m) => ({ ...m, media_type: "movie" as const }));
}

export async function fetchNewReleases(): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>("/movie/now_playing");
  return (data?.results ?? getNewReleases()).map((m) => ({ ...m, media_type: "movie" as const }));
}

export async function fetchByGenre(genreId: number): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>(`/discover/movie?with_genres=${genreId}`);
  return (data?.results ?? getByGenre(genreId)).map((m) => ({ ...m, media_type: "movie" as const }));
}

interface TmdbMovieDetailsResponse extends Omit<MovieDetails, 'similar' | 'videos'> {
  similar?: MovieResponse;
  videos?: { results: MovieVideo[] };
}

async function fetchMediaDetails(id: number, type: MediaType): Promise<MovieDetails | null> {
  const endpoint = `/${type}/${id}?append_to_response=credits,similar,videos`;
  const data = await tmdbFetch<TmdbMovieDetailsResponse>(endpoint);

  if (!data) return null;

  const trailer_key = data.videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer")?.key;

  return {
    ...data,
    media_type: type,
    title: data.title || data.name || "",
    release_date: data.release_date || data.first_air_date || "",
    original_title: data.original_title || data.original_name || "",
    similar: (data.similar?.results ?? []).map((s) => ({ ...s, media_type: type })),
    videos: data.videos?.results ?? [],
    trailer_key,
  };
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails | null> {
  return (await fetchMediaDetails(id, "movie")) ?? getMovieById(id) ?? null;
}

export async function fetchTvDetails(id: number): Promise<MovieDetails | null> {
  return (await fetchMediaDetails(id, "tv")) ?? getTvById(id) ?? null;
}

export async function fetchTrendingTv(): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>("/trending/tv/week");
  const results = data?.results ?? getTrendingTv();
  return results.map((m) => {
    const movie: Movie = {
      ...m,
      media_type: "tv" as const,
      title: m.title || m.name || "",
      release_date: m.release_date || m.first_air_date || "",
      original_title: m.original_title || m.original_name || "",
    };
    return movie;
  });
}

export async function fetchPopularTv(): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>("/tv/popular");
  const results = data?.results ?? getPopularTv();
  return results.map((m) => {
    const movie: Movie = {
      ...m,
      media_type: "tv" as const,
      title: m.title || m.name || "",
      release_date: m.release_date || m.first_air_date || "",
      original_title: m.original_title || m.original_name || "",
    };
    return movie;
  });
}

export async function fetchSearch(query: string): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>(`/search/multi?query=${encodeURIComponent(query)}`);
  if (data?.results) {
    return data.results
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((item) => ({
        ...item,
        media_type: item.media_type === "tv" ? "tv" : "movie",
        title: item.title || item.name || "",
        release_date: item.release_date || item.first_air_date || "",
        original_title: item.original_title || item.original_name || "",
      }));
  }
  // Fallback to mock data with both movies and TV shows
  const movieResults = searchMovies(query).map((m) => ({ ...m, media_type: "movie" as const }));
  const tvResults = searchTv(query).map((m) => ({ ...m, media_type: "tv" as const }));
  return [...movieResults, ...tvResults].map((item) => ({
    ...item,
    title: item.title || item.name || "",
    release_date: item.release_date || item.first_air_date || "",
    original_title: item.original_title || item.original_name || "",
  }));
}

export async function fetchHeroMovie(): Promise<Movie> {
  const trending = await fetchTrending();
  return trending[0] ?? { ...MOCK_MOVIES[0], media_type: "movie" as const };
}
