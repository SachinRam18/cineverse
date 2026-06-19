"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { GENRES } from "@/lib/mock-data";
import { Movie, SortOption } from "@/types/movie";
import { MovieCard } from "@/components/movie/MovieCard";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity",   label: "Most Popular" },
  { value: "vote_average", label: "Top Rated"    },
  { value: "release_date", label: "Newest First" },
  { value: "title",        label: "A – Z"         },
];

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive all state from URL so pagination + genre are always in sync
  const mediaParam = searchParams?.get("media");
  const genreParam = searchParams?.get("genre");
  const pageParam = Number(searchParams?.get("page") ?? "1");

  const [search, setSearch] = useState("");
  const media = search.trim()
    ? mediaParam === "tv" ? "tv" : mediaParam === "movie" ? "movie" : "all"
    : mediaParam === "tv" ? "tv" : "movie";

  const selectedGenre = genreParam ? Number(genreParam) : null;
  const page = Math.max(1, pageParam);

  const [sort, setSort] = useState<SortOption>("popularity");
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Helper to update URL params while preserving existing ones
  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    });
    router.push(`/browse?${params.toString()}`);
  }, [searchParams, router]);

  const setGenre = (id: number | null) => {
    updateParams({ genre: id ? String(id) : null, page: null });
  };

  const setPage = (p: number) => {
    updateParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when search/sort/minRating changes
  useEffect(() => {
    updateParams({ page: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, minRating]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setLoading(true);
      const params = new URLSearchParams({
        search: search.trim(),
        sort,
        minRating: minRating.toString(),
        genre: selectedGenre?.toString() ?? "",
        media,
        page: page.toString(),
      });

      try {
        const res = await fetch(`/api/movies?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setMovies(data.results ?? []);
        setTotalPages(data.total_pages ?? 1);
      } catch {
        if (!controller.signal.aborted) setMovies([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadMovies();
    return () => controller.abort();
  }, [search, selectedGenre, sort, minRating, media, page]);

  const filtered = useMemo(() => {
    if (minRating > 0 && !search.trim()) {
      return movies.filter((m) => m.vote_average >= minRating);
    }
    return movies;
  }, [movies, minRating, search]);

  return (
    <>
      <style>{`
        /* ── Page shell ── */
        .bp-root {
          min-height: 100vh;
          padding-bottom: 96px;
          background: var(--bg-primary);
        }

        /* ── Header ── */
        .bp-header {
          padding: calc(66px + 32px) 48px 40px;
        }
        @media (max-width: 768px) {
          .bp-header { padding: calc(66px + 24px) 24px 32px; }
          .bp-controls, .bp-genres, .bp-grid { padding-left: 24px; padding-right: 24px; }
        }

        .bp-eyebrow {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e50914;
          margin-bottom: 12px;
        }

        .bp-heading {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 2rem;
        }

        .bp-count {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        /* ── Controls row ── */
        .bp-controls {
          padding: 0 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .bp-controls-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* Search */
        .bp-search-wrap {
          flex: 1;
          min-width: 200px;
          position: relative;
        }
        .bp-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          width: 15px;
          height: 15px;
          pointer-events: none;
        }
        .bp-search-input {
          width: 100%;
          padding: 11px 40px 11px 44px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #fff;
          font-size: 0.875rem;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .bp-search-input::placeholder { color: rgba(255,255,255,0.28); }
        .bp-search-input:focus {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
        }
        .bp-search-clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .bp-search-clear:hover { color: #fff; }

        /* Sort select */
        .bp-sort-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .bp-sort-select {
          appearance: none;
          padding: 11px 36px 11px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: rgba(255,255,255,0.75);
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .bp-sort-select:focus { border-color: rgba(255,255,255,0.2); }
        .bp-sort-arrow {
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          pointer-events: none;
          width: 14px;
          height: 14px;
        }

        /* Filter button */
        .bp-filter-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 18px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .bp-filter-btn.inactive {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.55);
        }
        .bp-filter-btn.inactive:hover {
          border-color: rgba(255,255,255,0.2);
          color: #fff;
          background: rgba(255,255,255,0.1);
        }
        .bp-filter-btn.active {
          background: #e50914;
          border-color: #e50914;
          color: #fff;
        }

        /* Filter panel */
        .bp-filter-panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px 24px;
          overflow: hidden;
        }
        .bp-filter-label {
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 14px;
        }
        .bp-range-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .bp-range-row input[type="range"] {
          flex: 1;
          -webkit-appearance: none;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.15);
          outline: none;
          cursor: pointer;
        }
        .bp-range-row input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e50914;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(229,9,20,0.25);
          transition: box-shadow 0.2s ease;
        }
        .bp-range-row input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 5px rgba(229,9,20,0.3);
        }
        .bp-range-val {
          color: #f5c518;
          font-size: 0.82rem;
          font-weight: 700;
          width: 44px;
          text-align: right;
          flex-shrink: 0;
        }

        /* ── Genre pills ── */
        .bp-genres {
          padding: 0 24px 40px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .bp-genre-pill {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
        }
        .bp-genre-pill.off {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.45);
        }
        .bp-genre-pill.off:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.85);
        }
        .bp-genre-pill.on {
          background: #e50914;
          border-color: #e50914;
          color: #fff;
          box-shadow: 0 2px 12px rgba(229,9,20,0.35);
        }

        /* ── Section divider ── */
        .bp-divider {
          padding: 0 48px;
          margin-bottom: 32px;
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        @media (max-width: 768px) { .bp-divider { padding: 0 24px; } }
        .bp-divider-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .bp-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* ── Grid ── */
        .bp-grid {
          padding: 0 24px 48px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
        }

        /* ── Pagination ── */
        .bp-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 32px 24px 48px;
          flex-wrap: wrap;
        }
        .bp-page-btn {
          min-width: 36px;
          height: 36px;
          padding: 0 10px;
          border-radius: 10px;
          font-size: 0.8125rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.18s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .bp-page-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
          color: #fff;
        }
        .bp-page-btn.active {
          background: #e50914;
          border-color: #e50914;
          color: #fff;
          box-shadow: 0 2px 12px rgba(229,9,20,0.35);
        }
        .bp-page-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .bp-page-ellipsis {
          color: rgba(255,255,255,0.2);
          font-size: 0.8rem;
          padding: 0 4px;
          line-height: 36px;
        }
        .bp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 96px 24px;
          text-align: center;
          gap: 0;
        }
        .bp-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          margin-bottom: 18px;
        }
        .bp-empty-title {
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255,255,255,0.65);
          margin-bottom: 6px;
        }
        .bp-empty-sub {
          font-size: 0.825rem;
          color: rgba(255,255,255,0.25);
          max-width: 280px;
          line-height: 1.55;
        }
      `}</style>

      <div className="bp-root">

        {/* ── Header ── */}
        <div className="bp-header">
          <motion.p
            className="bp-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            Discover
          </motion.p>
          <motion.h1
            className="bp-heading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            Browse
          </motion.h1>
          <motion.p
            className="bp-count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            {filtered.length} {filtered.length === 1 ? "title" : "titles"} available
          </motion.p>
        </div>

        {/* ── Controls ── */}
        <div className="bp-controls">
          <div className="bp-controls-row">
            {/* Search */}
            <div className="bp-search-wrap">
              <Search className="bp-search-icon" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search titles, genres…"
                className="bp-search-input"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="bp-search-clear"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="bp-sort-wrap">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bp-sort-select"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} style={{ background: "#111118" }}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="bp-sort-arrow" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`bp-filter-btn ${showFilters ? "active" : "inactive"}`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {minRating > 0 && !showFilters && (
                <span style={{
                  background: "#e50914",
                  color: "#fff",
                  borderRadius: "10px",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  padding: "1px 6px",
                  marginLeft: 2,
                }}>
                  {minRating.toFixed(1)}+
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="bp-filter-panel">
                  <p className="bp-filter-label">Minimum Rating</p>
                  <div className="bp-range-row">
                    <input
                      type="range" min={0} max={10} step={0.5} value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                    />
                    <span className="bp-range-val">
                      {minRating > 0 ? `${minRating.toFixed(1)}+` : "Any"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Genre pills ── */}
        <div className="bp-genres">
          <button
            onClick={() => setGenre(null)}
            className={`bp-genre-pill ${selectedGenre === null ? "on" : "off"}`}
          >
            All
          </button>
          {GENRES.slice(0, 12).map((g) => (
            <button
              key={g.id}
              onClick={() => setGenre(selectedGenre === g.id ? null : g.id)}
              className={`bp-genre-pill ${selectedGenre === g.id ? "on" : "off"}`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="bp-divider">
          <span className="bp-divider-label">
            {selectedGenre
              ? GENRES.find((g) => g.id === selectedGenre)?.name
              : search.trim()
              ? `Results for "${search}"`
              : "All titles"}
          </span>
          <span className="bp-divider-line" />
          <span className="bp-divider-label">{filtered.length}</span>
        </div>

        {/* ── Grid / Empty ── */}
        <div className="bp-grid">
          {loading ? (
            Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "2/3", borderRadius: "14px" }} />
            ))
          ) : filtered.length === 0 ? (
            <motion.div
              className="bp-empty"
              style={{ width: "100%" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bp-empty-icon">🎬</div>
              <p className="bp-empty-title">No titles found</p>
              <p className="bp-empty-sub">Try a different search term or adjust your filters to find something to watch.</p>
            </motion.div>
          ) : (
            filtered.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} size="md" />
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && !loading && (
          <div className="bp-pagination">
            <button
              className="bp-page-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={14} /> Prev
            </button>

            {(() => {
              const pages: (number | "...")[] = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (page > 3) pages.push("...");
                for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
                if (page < totalPages - 2) pages.push("...");
                pages.push(totalPages);
              }
              return pages.map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="bp-page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`bp-page-btn ${p === page ? "active" : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                )
              );
            })()}

            <button
              className="bp-page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}

      </div>
    </>
  );
}