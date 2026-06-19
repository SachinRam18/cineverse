"use client";
import { Plus, Check } from "lucide-react";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { Movie } from "@/types/movie";

export function MovieDetailClient({ movie }: { movie: Movie }) {
  const { toggle, isInWatchlist } = useWatchlistStore();
  const inWatchlist = isInWatchlist(movie.id);
  return (
    <button
      onClick={() => toggle(movie)}
      // Use the global pill glass style so this action matches other pills
      className="pill pill-glass flex-shrink-0"
    >
      {inWatchlist ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
      {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}
