"use client";
/**
 * HERO BANNER COMPONENT
 * 
 * Large hero/splash image showing featured movies with:
 * - Auto-rotating carousel (8 second interval)
 * - Movie details (title, rating, genres, description)
 * - Call-to-action buttons (Watch Now, More Info, Add to Watchlist)
 * - Navigation controls (previous, next, mute, slide dots)
 * 
 * Layout:
 * - Full viewport height (90vh)
 * - Content positioned at bottom with large bottom padding (pb-56 md:pb-72 lg:pb-80)
 * - Gradient overlays for text readability
 * 
 * Used on: Home page (/app/page.tsx)
 */
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Check, Info, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types/movie";
import { getBackdropUrl, getGenreNames } from "@/lib/mock-data";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { GenreBadge } from "@/components/common/GenreBadge";
import { RatingBadge } from "@/components/common/RatingBadge";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  movies: Movie[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const { toggle, isInWatchlist } = useWatchlistStore();

  const movie = movies[current];
  const inWatchlist = movie ? isInWatchlist(movie.id) : false;
  const genres = movie ? getGenreNames(movie.genre_ids).slice(0, 3) : [];

  const total = Math.min(movies.length, 5);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(next, 8000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies.length]);

  if (!movie) return null;

  return (
    <div className="relative w-full h-[90vh] min-h-[580px] max-h-[860px] overflow-hidden"
      style={{ marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", width: "100vw" }}
    >
      {/* Background backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Image
            src={getBackdropUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays — left-to-right hero fade + bottom fade */}
      <div className="absolute inset-0 hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/40 via-[40%] to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Content — capped at max-w-2xl so it never bleeds into the right edge */}
      <div className="absolute inset-0 flex flex-col justify-end pb-2 md:pb-3 px-6 md:px-16 lg:px-24 z-10">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-2">
                {genres.map((g) => (
                  <GenreBadge key={g} name={g} size="md" />
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl" style={{ marginBottom: "0.75rem" }}>
                {movie.title}
              </h1>

              {/* Meta row */}
              <div className="flex items-center gap-4 mb-2">
                <RatingBadge rating={movie.vote_average} size="md" />
                <span className="text-[var(--text-secondary)] text-sm">
                  {new Date(movie.release_date).getFullYear()}
                </span>
                {movie.runtime && (
                  <span className="text-[var(--text-secondary)] text-sm">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                )}
              </div>

              {/* Overview */}
              <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed line-clamp-3 mb-4">
                {movie.overview}
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <Link
                  href={`/watch/${movie.id}?media=${movie.media_type === "tv" ? "tv" : "movie"}`}
                  className="pill-sm flex items-center gap-2 font-bold rounded-full transition-all duration-200 hover:scale-105 shadow-lg text-white"
                  style={{ background: "linear-gradient(135deg, #e50914 0%, #ff4d00 100%)", boxShadow: "0 4px 20px rgba(229,9,20,0.4)" }}
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  Watch Now
                </Link>
                <Link
                  href={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`}
                  className="pill-sm flex items-center gap-2 glass glass-hover text-white font-semibold rounded-full transition-all duration-200 hover:scale-105 border border-white/20"
                >
                  <Info className="w-4 h-4" />
                  More Info
                </Link>
                <button
                  onClick={() => toggle(movie)}
                  className="flex items-center justify-center w-11 h-11 rounded-full glass glass-hover border border-white/20 text-white transition-all hover:scale-105"
                  aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                  {inWatchlist ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>

              {/* Slide controls — dots left, arrows+mute absolutely pinned to bottom-right */}
              <div className="flex items-center gap-2 mb-1">
                {movies.slice(0, 5).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === current ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/60"
                    )}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows + mute — absolutely pinned to bottom-right edge */}
      <div className="absolute bottom-3 right-6 md:right-16 lg:right-24 flex items-center gap-2 z-20">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-white/15 mx-1" />
        <button
          onClick={() => setMuted(!muted)}
          className="w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
