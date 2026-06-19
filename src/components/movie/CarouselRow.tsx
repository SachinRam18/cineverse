"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { cn } from "@/lib/utils";

interface CarouselRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  cardSize?: "sm" | "md" | "lg";
  className?: string;
}

export function CarouselRow({ title, movies, isLoading, cardSize = "lg", className }: CarouselRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className={cn("pt-0 pb-5 group/row", className)}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 px-6 md:px-10 mb-3">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white tracking-tight line-clamp-1 flex-1"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {title}
        </motion.h2>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* "See all" link — always visible, not inline with title */}
          <span className="text-[var(--accent-red)] text-xs font-semibold uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer select-none">
            See all <ArrowRight className="w-3 h-3" />
          </span>

          {/* Nav arrows */}
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
        className="flex gap-3 overflow-x-auto carousel-scroll px-6 md:px-10"
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} size={cardSize} />
            ))}
      </div>
    </section>
  );
}
