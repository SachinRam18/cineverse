"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { Movie } from "@/types/movie";
import Image from "next/image";
import Link from "next/link";
import { getPosterUrl } from "@/lib/mock-data";
import { RatingBadge } from "@/components/common/RatingBadge";

const TRENDING_SEARCHES = ["Dune", "Interstellar", "Oppenheimer", "Inception", "Parasite", "Top Gun"];

export function SearchModal() {
  const { isOpen, query, recentSearches, setQuery, addRecent, removeRecent, clearRecent, closeModal } =
    useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<Movie[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setActiveIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useSearchStore.getState().toggleModal();
      }
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowDown") setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      if (e.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, -1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal, results.length]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const id = window.setTimeout(async () => {
      try {
        const res  = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results?.slice(0, 6) ?? []);
      } catch { setResults([]); }
    }, 150);
    return () => window.clearTimeout(id);
  }, [query]);

  const handleSelect = (movie: Movie) => { addRecent(movie.title || movie.name || ""); closeModal(); };

  return (
    <>
      <style>{`
        /* ── Backdrop ── */
        .sm-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* ── Panel ── */
        .sm-panel-wrap {
          position: fixed;
          inset: 0;
          z-index: 101;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .sm-panel {
          width: 100%;
          max-width: 720px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(13,13,20,0.97);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 32px 100px rgba(0,0,0,0.65),
            0 8px 32px rgba(0,0,0,0.4);
          overflow: hidden;
        }

        /* ── Input row ── */
        .sm-input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .sm-search-icon {
          color: rgba(255,255,255,0.35);
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          transition: color 0.2s ease;
        }
        .sm-input-row:focus-within .sm-search-icon {
          color: rgba(255,255,255,0.65);
        }

        .sm-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          caret-color: #e50914;
        }
        .sm-input::placeholder {
          color: rgba(255,255,255,0.22);
          font-weight: 400;
        }

        .sm-clear-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          border: none;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .sm-clear-btn:hover {
          background: rgba(255,255,255,0.14);
          color: #fff;
        }

        .sm-esc-kbd {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.62rem;
          color: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 2px 7px;
          letter-spacing: 0.04em;
          background: rgba(255,255,255,0.03);
          flex-shrink: 0;
        }

        /* ── Scrollable body ── */
        .sm-body {
          max-height: 66vh;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .sm-body::-webkit-scrollbar { display: none; }

        /* ── Section label ── */
        .sm-section-label {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 16px 18px 8px;
        }

        /* ── Result row ── */
        .sm-result {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 18px;
          text-decoration: none;
          transition: background 0.15s ease;
          position: relative;
          cursor: pointer;
        }
        .sm-result:hover,
        .sm-result.active {
          background: rgba(255,255,255,0.05);
        }
        /* left accent bar on active */
        .sm-result.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: #e50914;
        }

        .sm-result-poster {
          position: relative;
          width: 40px;
          height: 56px;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .sm-result-info {
          flex: 1;
          min-width: 0;
        }
        .sm-result-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.15s;
          letter-spacing: 0.005em;
        }
        .sm-result:hover .sm-result-title,
        .sm-result.active .sm-result-title {
          color: #fff;
        }
        .sm-result-year {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.28);
          margin-top: 3px;
          font-weight: 500;
        }

        .sm-result-arrow {
          color: rgba(255,255,255,0.15);
          width: 15px;
          height: 15px;
          transition: color 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .sm-result:hover .sm-result-arrow,
        .sm-result.active .sm-result-arrow {
          color: rgba(255,255,255,0.5);
          transform: translate(1px, -1px);
        }

        /* ── Divider between sections ── */
        .sm-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 4px 0;
        }

        /* ── Pills (recent / trending) ── */
        .sm-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding: 4px 18px 16px;
        }

        .sm-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.775rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.55);
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .sm-pill:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.9);
        }
        .sm-pill svg { width: 11px; height: 11px; flex-shrink: 0; }

        .sm-pill-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          color: rgba(255,255,255,0.25);
          transition: color 0.15s;
          cursor: pointer;
          background: transparent;
          border: none;
          padding: 0;
          margin-left: 2px;
        }
        .sm-pill-remove:hover { color: rgba(255,255,255,0.7); }
        .sm-pill-remove svg { width: 10px; height: 10px; }

        /* Recent header row */
        .sm-recent-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px 8px;
        }
        .sm-recent-label {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }
        .sm-clear-btn-text {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.25);
          cursor: pointer;
          background: none;
          border: none;
          transition: color 0.15s;
          padding: 0;
        }
        .sm-clear-btn-text:hover { color: rgba(255,255,255,0.6); }

        /* ── No results ── */
        .sm-empty {
          padding: 48px 24px;
          text-align: center;
        }
        .sm-empty-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          margin-bottom: 6px;
        }
        .sm-empty-sub {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.25);
          line-height: 1.6;
          max-width: 300px;
          margin: 0 auto;
        }
        .sm-empty-sub em {
          color: rgba(255,255,255,0.5);
          font-style: normal;
        }

        /* ── Bottom hint bar ── */
        .sm-hint-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
          padding: 10px 18px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .sm-hint {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.62rem;
          color: rgba(255,255,255,0.18);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .sm-hint kbd {
          font-family: 'SF Mono', monospace;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 0.58rem;
          background: rgba(255,255,255,0.04);
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="sm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closeModal}
            />

            {/* Panel */}
            <motion.div
              className="sm-panel-wrap"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="sm-panel">

                {/* ── Input ── */}
                <div className="sm-input-row">
                  <Search className="sm-search-icon" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies, genres, actors…"
                    className="sm-input"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="sm-clear-btn" aria-label="Clear">
                      <X size={12} />
                    </button>
                  )}
                  <span className="sm-esc-kbd hidden sm:block">ESC</span>
                </div>

                {/* ── Body ── */}
                <div className="sm-body">

                  {/* Results */}
                  {results.length > 0 && (
                    <>
                      <p className="sm-section-label">Results</p>
                      {results.map((movie, i) => (
                        <Link
                          key={movie.id}
                          href={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`}
                          onClick={() => handleSelect(movie)}
                          className={`sm-result ${activeIndex === i ? "active" : ""}`}
                        >
                          <div className="sm-result-poster">
                            <Image
                              src={getPosterUrl(movie.poster_path, "w342")}
                              alt={movie.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                              unoptimized
                            />
                          </div>
                          <div className="sm-result-info">
                            <p className="sm-result-title">{movie.title || movie.name}</p>
                            <p className="sm-result-year">
                              {movie.release_date ? new Date(movie.release_date).getFullYear() : "—"}
                            </p>
                          </div>
                          <RatingBadge rating={movie.vote_average} size="sm" />
                          <ArrowUpRight className="sm-result-arrow" />
                        </Link>
                      ))}
                    </>
                  )}

                  {/* No results */}
                  {query.trim() && results.length === 0 && (
                    <div className="sm-empty">
                      <p className="sm-empty-title">No results for &ldquo;{query}&rdquo;</p>
                      <p className="sm-empty-sub">
                        Try a different title, actor, or genre — or check for typos.
                      </p>
                    </div>
                  )}

                  {/* Empty state */}
                  {!query.trim() && (
                    <>
                      {recentSearches.length > 0 && (
                        <>
                          <div className="sm-recent-header">
                            <span className="sm-recent-label">Recent</span>
                            <button onClick={clearRecent} className="sm-clear-btn-text">Clear all</button>
                          </div>
                          <div className="sm-pills-wrap">
                            {recentSearches.map((s) => (
                              <span key={s} className="sm-pill">
                                <Clock style={{ color: "rgba(255,255,255,0.3)" }} />
                                <button onClick={() => setQuery(s)}>{s}</button>
                                <button onClick={() => removeRecent(s)} className="sm-pill-remove" aria-label="Remove">
                                  <X />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="sm-divider" />
                        </>
                      )}

                      <p className="sm-section-label">Trending</p>
                      <div className="sm-pills-wrap">
                        {TRENDING_SEARCHES.map((s) => (
                          <button key={s} className="sm-pill" onClick={() => setQuery(s)}>
                            <TrendingUp style={{ color: "#e50914" }} />
                            {s}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* ── Hint bar ── */}
                <div className="sm-hint-bar">
                  <span className="sm-hint"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                  <span className="sm-hint"><kbd>↵</kbd> open</span>
                  <span className="sm-hint"><kbd>ESC</kbd> close</span>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}