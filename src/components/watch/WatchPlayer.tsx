"use client";
/**
 * WatchPlayer Component
 * 
 * Main component for the watch/video page. Handles:
 * - VideoPlayer for streaming/preview modes
 * - Season selection for TV shows
 * - EpisodesCarousel for browsing episodes
 * 
 * Used on: /watch/[id] route
 */
import { useEffect, useState } from "react";
import { Movie, TvEpisode } from "@/types/movie";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { EpisodesCarousel } from "@/components/watch/EpisodesCarousel";
import { ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import { getPosterUrl, getEpisodeStillUrl } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EpisodeItem {
  id: number;
  name: string;
  episode_number: number;
  overview: string;
  air_date: string;
  still_path: string | null;
}

interface WatchPlayerProps {
  movie: Movie;
}

export function WatchPlayer({ movie }: WatchPlayerProps) {
  const isTv = movie.media_type === "tv";
  const seasons = movie.seasons ?? [];
  const initialSeason = seasons[0]?.season_number ?? 1;

  const [selectedSeason, setSelectedSeason] = useState<number>(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isTv) return;
    const controller = new AbortController();
    const fetchSeason = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tv/${movie.id}/season/${selectedSeason}`, { signal: controller.signal });
        const data = await res.json();
        const items: TvEpisode[] = Array.isArray(data.episodes) ? data.episodes : [];
        setEpisodes(items);
        if (items.length > 0) {
          setSelectedEpisode((prev) => {
            const found = items.find((ep: TvEpisode) => ep.episode_number === prev);
            return found ? prev : items[0].episode_number;
          });
        }
      } catch {
        if (!controller.signal.aborted) setEpisodes([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchSeason();
    return () => controller.abort();
  }, [isTv, movie.id, selectedSeason]);
  return (
    <div>
      <VideoPlayer movie={movie} season={selectedSeason} episode={selectedEpisode} />

      {isTv && (
        <div className="mt-8 px-6 md:px-10 lg:px-12">
          <div className="flex flex-col gap-5">
            {/* Seasons */}
            {/*
              Seasons row fix:
              - Use `items-center` and `inline-flex` on buttons so pills size to their content.
              - Avoid block-level widening by making buttons `inline-flex` and removing forced height-> allow consistent sizing.
            */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Seasons
              </span>

              <div className="flex flex-wrap gap-2 items-center">
                {seasons.map((season) => (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.season_number)}
                    className={cn(
                      "inline-flex items-center rounded-full border text-sm font-medium transition-all duration-200",
                      selectedSeason === season.season_number
                        ? "h-10 border-[var(--accent-red)] bg-[var(--accent-red)] text-white shadow-[0_0_25px_rgba(229,9,20,0.25)]"
                        : "h-9 border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:border-white/20"
                    )}
                    style={{ padding: "0.5rem 1rem" }}
                  >
                    {season.name || `Season ${season.season_number}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Episodes Container */}
            <EpisodesCarousel
              title={`Season ${selectedSeason}`}
              episodes={episodes}
              isLoading={loading}
              selectedEpisode={selectedEpisode}
              onSelectEpisode={setSelectedEpisode}
            />
          </div>
        </div>
      )}
    </div>
  );
}
