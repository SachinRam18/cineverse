import { NextResponse } from "next/server";
import { searchMovies, searchTv } from "@/lib/mock-data";
import type { Movie, MovieResponse } from "@/types/movie";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

function normalizeSearchItem(item: Movie): Movie {
  const media_type = item.media_type === "tv"
    ? "tv"
    : item.media_type === "movie"
    ? "movie"
    : item.name && !item.title
    ? "tv"
    : "movie";

  return {
    ...item,
    media_type,
    title: item.title || item.name || "",
    original_title: item.original_title || item.original_name || "",
    release_date: item.release_date || item.first_air_date || "",
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ results: [], page: 1, total_pages: 0, total_results: 0 } as MovieResponse, { status: 200 });
  }

  if (!API_KEY) {
    const movieResults = searchMovies(query).map((movie) => ({
      ...movie,
      media_type: "movie" as const,
    }));
    const tvResults = searchTv(query).map((show) => ({
      ...show,
      media_type: "tv" as const,
    }));
    const results = [...movieResults, ...tvResults].map((item) => ({
      ...item,
      title: item.title || item.name || "",
      original_title: item.original_title || item.original_name || "",
      release_date: item.release_date || item.first_air_date || "",
    }));

    return NextResponse.json({ results, page: 1, total_pages: 1, total_results: results.length } as MovieResponse, { status: 200 });
  }

  const response = await fetch(
    `${TMDB_BASE}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
  );

  if (!response.ok) {
    const results = searchMovies(query).map((movie) => ({
      ...movie,
      media_type: movie.media_type ?? "movie",
      title: movie.title || movie.name || "",
      original_title: movie.original_title || movie.original_name || "",
      release_date: movie.release_date || movie.first_air_date || "",
    }));

    return NextResponse.json({ results, page: 1, total_pages: 1, total_results: results.length } as MovieResponse, { status: 200 });
  }

  const data = await response.json();
  const normalizedResults = (data.results ?? [])
    .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
    .map((item: Movie) => normalizeSearchItem(item));

  return NextResponse.json({
    ...data,
    results: normalizedResults,
  });
}
