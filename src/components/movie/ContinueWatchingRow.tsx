"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { MOCK_MOVIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ContinueWatchingRowProps {
  title: string;
  cardSize?: "sm" | "md" | "lg";
  className?: string;
}

interface ContinueWatchingMovieItem {
  movie: Movie;
  progress: number;
}

export function ContinueWatchingRow({ title, cardSize = "lg", className }: ContinueWatchingRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<ContinueWatchingMovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("cineverse_continue_watching");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const loaded = parsed
            .map((item: any) => {
              const movie = MOCK_MOVIES.find((m) => m.id === item.movieId);
              if (!movie) return null;
              return {
                movie,
                progress: Math.round(item.progress),
              };
            })
            .filter((item): item is ContinueWatchingMovieItem => item !== null);
          setItems(loaded);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Default fallback mock continue watching items if user has never watched anything
    const defaultItems = MOCK_MOVIES.slice(4, 8).map((m, i) => ({
      movie: m,
      progress: [65, 30, 85, 12][i] || 45,
    }));
    setItems(defaultItems);
    setIsLoading(false);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  if (items.length === 0 && !isLoading) return null;

  return (
    <section className={cn("py-5 group/row", className)}>
      {/* Header row */}
      <div className="flex items-center justify-between px-6 md:px-12 mb-4 gap-4">
        <motion.h2
          className="text-base md:text-lg font-bold text-white tracking-tight line-clamp-1 flex-1"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {title}
        </motion.h2>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[var(--accent-red)] text-xs font-semibold uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer select-none">
            See all <ArrowRight className="w-3 h-3" />
          </span>

          <div className="flex gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
            <button
              onClick={() => scroll("left")}
              className="w-7 h-7 rounded-full glass glass-hover flex items-center justify-center text-white/80 hover:text-white transition-all border border-white/10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-7 h-7 rounded-full glass glass-hover flex items-center justify-center text-white/80 hover:text-white transition-all border border-white/10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 px-6 md:px-12 overflow-x-auto carousel-scroll pb-3"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map(({ movie, progress }, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} size={cardSize} progress={progress} />
            ))}
      </div>
    </section>
  );
}
