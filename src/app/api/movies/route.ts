import { NextResponse } from "next/server";
import type { Movie, MovieResponse } from "@/types/movie";
import {
  getByGenre,
  getTrending,
  getPopularTv,
  searchMovies,
  searchTv,
} from "@/lib/mock-data";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

type MediaType = "movie" | "tv";

function sortByValue(sort: string | null, media: MediaType) {
  switch (sort) {
    case "popularity":
      return "popularity.desc";
    case "vote_average":
      return "vote_average.desc";
    case "release_date":
      return media === "tv" ? "first_air_date.desc" : "primary_release_date.desc";
    case "title":
      return media === "tv" ? "name.asc" : "original_title.asc";
    default:
      return "popularity.desc";
  }
}

function applyClientFilters(movies: Movie[], genre: number | null, minRating: number, sort: string) {
  let filtered = [...movies];

  if (genre !== null) {
    filtered = filtered.filter((movie) => movie.genre_ids.includes(genre));
  }

  if (minRating > 0) {
    filtered = filtered.filter((movie) => movie.vote_average >= minRating);
  }

  if (sort === "title") {
    filtered.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
  } else if (sort === "vote_average") {
    filtered.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sort === "release_date") {
    filtered.sort(
      (a, b) => new Date(b.release_date || b.first_air_date || "").getTime() - new Date(a.release_date || a.first_air_date || "").getTime()
    );
  } else {
    filtered.sort((a, b) => b.popularity - a.popularity);
  }

  return filtered;
}

async function fetchTmdb<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const genre = url.searchParams.get("genre");
  const mediaParam = url.searchParams.get("media");
  const sort = url.searchParams.get("sort") ?? "popularity";
  const minRating = Number(url.searchParams.get("minRating") ?? "0");
  const media = search
    ? mediaParam === "tv"
      ? "tv"
      : mediaParam === "movie"
      ? "movie"
      : "all"
    : mediaParam === "tv"
    ? "tv"
    : "movie";

  const genreId = genre ? Number(genre) : null;
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));

  if (!API_KEY) {
    const fallbackResults =
      media === "tv"
        ? search
          ? searchTv(search)
          : getPopularTv()
        : media === "all" && search
          ? [...searchMovies(search), ...searchTv(search)]
          : search
            ? searchMovies(search)
            : genreId !== null
              ? getByGenre(genreId)
              : getTrending();

    return NextResponse.json({
      results: applyClientFilters(fallbackResults, genreId, minRating, sort),
      page: 1,
      total_pages: 1,
      total_results: fallbackResults.length,
    } as MovieResponse);
  }

  const baseUrl = search
    ? `${TMDB_BASE}/${media === "tv" ? "search/tv" : media === "movie" ? "search/movie" : "search/multi"}`
    : `${TMDB_BASE}/discover/${media === "tv" ? "tv" : "movie"}`;
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    page: String(page),
    include_adult: "false",
  });

  if (search) {
    params.set("query", search);
  } else {
    params.set("sort_by", sortByValue(sort, media === "tv" ? "tv" : "movie"));
    if (minRating > 0) params.set("vote_average.gte", String(minRating));
    if (genreId !== null) params.set("with_genres", String(genreId));
  }

  const tmdbUrl = `${baseUrl}?${params.toString()}`;
  const data = await fetchTmdb<MovieResponse>(tmdbUrl);
  const results = (data?.results ?? []).map((movie) => ({
    ...movie,
    media_type: (media === "tv" || movie.media_type === "tv" ? "tv" : "movie") as MediaType,
    title: movie.title || movie.name || "",
    release_date: movie.release_date || movie.first_air_date || "",
    original_title: movie.original_title || movie.original_name || "",
  })) as Movie[];

  return NextResponse.json({
    results,
    page: data?.page ?? page,
    total_pages: Math.min(data?.total_pages ?? 1, 500),
    total_results: data?.total_results ?? results.length,
  });
}
