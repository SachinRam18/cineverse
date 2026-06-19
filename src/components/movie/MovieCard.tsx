"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Plus, Check, Star, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { getPosterUrl } from "@/lib/mock-data";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  size?: "sm" | "md" | "lg";
  progress?: number;
  className?: string;
}

export function MovieCard({ movie, index = 0, size = "md", progress, className }: MovieCardProps) {
  const router = useRouter();
  const { toggle, isInWatchlist } = useWatchlistStore();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const inWatchlist = isMounted ? isInWatchlist(movie.id) : false;

  const sizeClasses = {
    sm: "w-40 md:w-48",
    md: "w-48 md:w-56 lg:w-64",
    lg: "w-64 md:w-72 lg:w-80",
  };

  return (
    <>
      <style>{`
        .mc-root {
          flex-shrink: 0;
          position: relative;
          cursor: pointer;
        }

        /* ── Poster wrapper ── */
        .mc-poster {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          aspect-ratio: 2 / 3;
          background: #1a1a24;
          /* Subtle lift shadow, deepens on hover */
          box-shadow: 0 2px 8px rgba(0,0,0,0.45);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
        }
        .mc-root:hover .mc-poster {
          box-shadow: 0 12px 40px rgba(0,0,0,0.75);
        }

        /* Poster image zoom */
        .mc-img {
          object-fit: cover;
          transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }
        .mc-root:hover .mc-img {
          transform: scale(1.07) !important;
        }

        .mc-center-play {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 2;
          width: 72px;
          height: 72px;
          margin: auto;
          border-radius: 9999px;
          background: linear-gradient(135deg, #f97316, #ef4444);
          box-shadow: 0 18px 36px rgba(249, 115, 22, 0.28);
          opacity: 0;
          transform: scale(0.82);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .mc-center-icon {
          width: 28px;
          height: 28px;
          color: #ffffff;
          fill: currentColor;
          transition: transform 0.3s ease;
        }
        .mc-root:hover .mc-center-play {
          opacity: 1;
          transform: scale(1);
        }
        .mc-root:hover .mc-center-icon {
          transform: scale(1.16);
        }

        /* ── Gradient overlay — only on hover ── */
        .mc-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.92) 0%,
            rgba(0,0,0,0.45) 40%,
            rgba(0,0,0,0.05) 75%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        .mc-root:hover .mc-gradient {
          opacity: 1;
        }

        /* ── Rating pill — always visible, top-left ── */
        .mc-rating {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 4px 8px 4px 6px;
          z-index: 4;
          /* Fades to more opaque on hover */
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .mc-root:hover .mc-rating {
          background: rgba(0,0,0,0.75);
          border-color: rgba(255,255,255,0.18);
        }
        .mc-rating-star {
          color: #f5c518;
          width: 15px;
          height: 15px;
          fill: #f5c518;
          flex-shrink: 0;
        }
        .mc-rating-val {
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
          line-height: 1;
        }

        /* ── Progress bar ── */
        .mc-progress-track {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.15);
          z-index: 5;
        }
        .mc-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #e50914, #ff5030);
          border-radius: 0 2px 2px 0;
          transition: width 0.3s ease;
        }

        /* ── Hover bottom panel ── */
        .mc-hover-panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 14px 14px 16px;
          z-index: 3;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.28s ease, transform 0.28s ease;
        }
        .mc-root:hover .mc-hover-panel {
          opacity: 1;
          transform: translateY(0);
        }

        /* Title + year inside panel */
        .mc-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 4px;
  letter-spacing: 0.01em;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
        .mc-year {
          font-size: 0.72rem;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          margin-bottom: 10px;
          letter-spacing: 0.02em;
        }

        /* Action row */
        .mc-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Play — solid white pill */
        .mc-btn-play {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 22px;
          background: #22c55e;
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.15s ease;
          flex-shrink: 0;
          line-height: 1;
          box-shadow: 0 10px 25px rgba(34,197,94,0.2);
        }
        .mc-btn-play:hover {
          background: #16a34a;
          transform: scale(1.05);
        }
        .mc-btn-play svg {
          width: 12px;
          height: 12px;
          fill: #f97316;
          flex-shrink: 0;
        }

        /* Icon buttons — ghost circle */
        .mc-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.28);
          background: rgba(15,23,42,0.8);
          color: #fff;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease;
          flex-shrink: 0;
        }
        .mc-btn-icon:hover {
          border-color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.14);
          transform: scale(1.08);
        }
        .mc-btn-icon svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        .mc-btn-icon.added {
          border-color: rgba(52,211,153,0.7);
          background: rgba(52,211,153,0.18);
        }
        .mc-btn-icon.added svg {
          color: #86efac;
        }

        /* Info button pushed to the right */
        .mc-btn-info {
          margin-left: 0;
        }

        /* ── Below-poster meta (always visible, subtle) ── */
        .mc-meta {
          margin-top: 9px;
          padding: 0 2px;
        }
        .mc-meta-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          line-height: 1.35;
          letter-spacing: 0.005em;
          transition: color 0.2s ease;
        }
        .mc-root:hover .mc-meta-title {
          color: #fff;
        }
        .mc-meta-year {
          font-size: 0.67rem;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
          margin-top: 2px;
          letter-spacing: 0.03em;
        }
      `}</style>

      <motion.div
        className={cn("mc-root", sizeClasses[size], className)}        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        onClick={() => {
          const mediaType = movie.media_type === "tv" ? "tv" : "movie";
          console.log("Navigating:", { id: movie.id, mediaType, actual_media_type: movie.media_type });
          router.push(`/${mediaType}/${movie.id}`);
        }}
      >
        {/* ── Poster ── */}
        <div className="mc-poster">
          <Image
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 160px, 210px"
            className="mc-img"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
          />

          {/* Gradient */}
          <div className="mc-gradient" />

          {/* Center play icon */}
          <div className="mc-center-play">
            <Play className="mc-center-icon" />
          </div>

          {/* Rating pill */}
          <div className="mc-rating">
            <Star className="mc-rating-star" />
            <span className="mc-rating-val">{movie.vote_average.toFixed(1)}</span>
          </div>

          {/* Progress bar */}
          {progress !== undefined && (
            <div className="mc-progress-track">
              <div className="mc-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

          {/* Hover panel */}
          <div className="mc-hover-panel">
            <p className="mc-title">{movie.title || movie.name || "Untitled"}</p>
            <p className="mc-year">{(() => {
              const dateStr = movie.release_date || movie.first_air_date || "";
              if (!dateStr) return "";
              const year = new Date(dateStr).getFullYear();
              return isNaN(year) ? "" : year;
            })()}</p>
            <div className="mc-actions">
             

              {/* Watchlist */}
              <button
                className={cn("mc-btn-icon", inWatchlist && "added")}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggle(movie); }}
                aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                {inWatchlist ? <Check /> : <Plus />}
              </button>

              {/* Info */}
              <Link
                href={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`}
                className="mc-btn-icon mc-btn-info"
                onClick={(e) => e.stopPropagation()}
                aria-label="More info"
              >
                <Info />
              </Link>
            </div>
          </div>
        </div>

      </motion.div>
    </>
  );
}