"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
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
    try {
      const stored = localStorage.getItem("cineverse_continue_watching");
      if (!stored) { setIsLoading(false); return; }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) { setIsLoading(false); return; }

      const loaded: ContinueWatchingMovieItem[] = parsed
        .filter((item: any) => item.movieData)
        .map((item: any) => ({
          movie: item.movieData as Movie,
          progress: Math.round(item.progress ?? 0),
        }));

      setItems(loaded);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  if (!isLoading && items.length === 0) return null;

  return (
    <section className={cn("pt-0 pb-5 group/row", className)}>
      <div className="flex items-center justify-between px-6 md:px-10 mb-3 gap-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white tracking-tight line-clamp-1 flex-1"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {title}
        </motion.h2>
        <div className="flex gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button onClick={() => scroll("left")} className="w-7 h-7 rounded-full glass glass-hover flex items-center justify-center text-white/80 hover:text-white transition-all border border-white/10" aria-label="Scroll left">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => scroll("right")} className="w-7 h-7 rounded-full glass glass-hover flex items-center justify-center text-white/80 hover:text-white transition-all border border-white/10" aria-label="Scroll right">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 px-6 md:px-10 overflow-x-auto carousel-scroll pb-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48 md:w-56 lg:w-64 aspect-[2/3] rounded-[14px] skeleton" />
            ))
          : items.map(({ movie, progress }, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} size={cardSize} progress={progress} />
            ))}
      </div>
    </section>
  );
}
