"use client";/**
 * EpisodesCarousel Component
 * 
 * Displays TV show episodes in a horizontal scrollable carousel format.
 * Similar to CarouselRow but optimized for episode selection.
 * 
 * Features:
 * - Left/right scroll navigation
 * - Episode selection highlight
 * - Episode metadata (title, description, air date)
 * - Loading skeleton state
 * 
 * Used in: WatchPlayer component
 */import { useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar, Play } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getEpisodeStillUrl } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EpisodeItem {
  id: number;
  name: string;
  episode_number: number;
  overview: string;
  air_date: string;
  still_path: string | null;
  runtime?: number;
  watch_progress?: number; // 0–100
}

interface EpisodesCarouselProps {
  title: string;
  episodes: EpisodeItem[];
  isLoading?: boolean;
  selectedEpisode?: number;
  onSelectEpisode?: (episodeNumber: number) => void;
  className?: string;
}

export function EpisodesCarousel({
  title,
  episodes,
  isLoading,
  selectedEpisode,
  onSelectEpisode,
  className,
}: EpisodesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: dir === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("py-6", className)}>
      {/* Header */}
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-1">
            {title}
          </p>
          <motion.h2
            className="text-lg font-bold text-white tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Episodes
          </motion.h2>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="text-xs text-white/40">
            {isLoading ? "Loading…" : `${episodes.length} episodes`}
          </span>
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Track */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-none pb-5 pr-4 sm:pr-8 md:pr-12"
        style={{ scrollbarWidth: "none" }}
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 rounded-[10px] bg-white/5 border border-white/10 animate-pulse"
              style={{ aspectRatio: "4/3" }}
            />
          ))
        ) : episodes.length > 0 ? (
          episodes.map((episode) => {
            const isSelected = selectedEpisode === episode.episode_number;
            const year = episode.air_date
              ? new Date(episode.air_date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "TBA";

            return (
              <motion.button
                key={episode.id}
                onClick={() => onSelectEpisode?.(episode.episode_number)}
                className={cn(
                  "flex-shrink-0 w-80 flex flex-col rounded-[10px] border text-left overflow-hidden group/ep transition-colors duration-200",
                  isSelected
                    ? "border-[var(--accent-red)]/50 shadow-[0_0_0_1px_rgba(229,9,20,0.2)]"
                    : "border-white/10 hover:border-white/22"
                )}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.18 }}
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-black/30">
                  <Image
                    src={getEpisodeStillUrl(episode.still_path, "w500")}
                    alt={`${episode.name} still`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/ep:scale-[1.04]"
                    sizes="320px"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

                  {/* EP badge */}
                  <span
                    className={cn(
                      "absolute top-2.5 left-2.5 rounded text-[10px] font-bold uppercase tracking-[0.12em] border backdrop-blur-sm transition-colors",
                      isSelected
                        ? "bg-[var(--accent-red)]/70 border-[var(--accent-red)]/40 text-white"
                        : "bg-black/50 border-white/15 text-white/70"
                    )}
                    style={{ padding: "0.5rem 0.75rem" }}
                  >
                    EP {episode.episode_number}
                  </span>

                  {/* Play overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                      isSelected
                        ? "opacity-100"
                        : "opacity-0 group-hover/ep:opacity-100"
                    )}
                  >
                    <div className="w-11 h-11 rounded-full bg-[var(--accent-red)]/85 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div
                  className={cn(
                    "flex flex-col flex-1 transition-colors",
                    isSelected ? "bg-[rgba(229,9,20,0.06)]" : "bg-white/[0.025]"
                  )}
                  style={{ padding: "1.5rem" }}
                >
                  <h3 className="text-[13px] font-bold text-white truncate mb-1.5">
                    {episode.name}
                  </h3>
                  <p className="text-[11.5px] leading-[1.6] text-white/50 line-clamp-2 flex-1 min-h-[36px]">
                    {episode.overview || "No description available."}
                  </p>

                  {/* Meta */}
                  <div className="mt-3 flex items-center gap-2.5 text-[11px] text-white/35">
                    {episode.runtime && (
                      <>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 opacity-60" />
                          {episode.runtime} min
                        </span>
                        <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 opacity-60" />
                      {year}
                    </span>
                  </div>

                  {/* Progress bar (selected only) */}
                  {isSelected && episode.watch_progress !== undefined && (
                    <div className="mt-3 h-[2px] rounded-full bg-white/8 overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent-red)] rounded-full"
                        style={{ width: `${episode.watch_progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })
        ) : (
          <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/50 w-full">
            No episode data available for this season.
          </div>
        )}
      </div>
    </section>
  );
}