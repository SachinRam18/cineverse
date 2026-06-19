"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Trash2, Plus, ArrowUpDown, Grid, List,
  ChevronRight, FolderPlus, Folder, Edit, X, Check,
  Film, FolderHeart, BookmarkPlus,
} from "lucide-react";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { Movie } from "@/types/movie";
import { MOCK_MOVIES } from "@/lib/mock-data";
import { MovieCard } from "@/components/movie/MovieCard";
import Link from "next/link";
import Image from "next/image";
import { getPosterUrl } from "@/lib/mock-data";

export default function WatchlistPage() {
  const [mounted, setMounted] = useState(false);
  const {
    items, collections, remove, reorder,
    createCollection, deleteCollection, renameCollection,
    addToCollection, removeFromCollection,
  } = useWatchlistStore();

  const [activeTab, setActiveTab] = useState<"watchlist" | "collections">("watchlist");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [openMovieMenuId, setOpenMovieMenuId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [reorderMode, setReorderMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-6 pb-20 px-6 md:px-12 bg-[#09090f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--accent-red)]" />
      </div>
    );
  }

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    createCollection(newCollectionName.trim());
    setNewCollectionName("");
    setIsCreatingCollection(false);
  };

  const handleRenameCollection = (id: string) => {
    if (!editingName.trim()) return;
    renameCollection(id, editingName.trim());
    setEditingCollectionId(null);
  };

  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
  const selectedCollectionMovies = selectedCollection
    ? (selectedCollection.movieIds.map((mid) => MOCK_MOVIES.find((m) => m.id === mid)).filter(Boolean) as Movie[])
    : [];

  return (
    <div className="min-h-screen pt-6 pb-20 px-6 md:px-12 lg:px-16" style={{ background: "var(--bg-primary)" }}>

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight" style={{ marginBottom: "0.5rem" }}>My Library</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2">
            Your saved movies, watchlist, and custom collections
          </p>
        </div>

        {activeTab === "collections" && (
          <button
            onClick={() => setIsCreatingCollection(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-red)] hover:bg-[var(--accent-red-hover)] text-white font-semibold rounded-xl text-sm transition-all hover:scale-105 shadow-[var(--shadow-glow-red)] self-start md:self-auto"
          >
            <FolderPlus className="w-4 h-4" />
            New Collection
          </button>
        )}
      </div>

      {/* Tabs + view controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-12">
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab("watchlist"); setSelectedCollectionId(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "watchlist" && !selectedCollectionId
                ? "bg-[var(--accent-red)] text-white shadow-lg"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            Watchlist <span className="text-xs opacity-60 ml-1">({items.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "collections" || selectedCollectionId
                ? "bg-[var(--accent-red)] text-white shadow-lg"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            Collections <span className="text-xs opacity-60 ml-1">({collections.length})</span>
          </button>
        </div>

        {activeTab === "watchlist" && items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReorderMode((v) => !v)}
              className={`inline-flex h-8 items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all pill-spacing ${
                reorderMode
                  ? "bg-amber-500/20 border-amber-500/30 text-amber-300"
                  : "border-white/10 text-[var(--text-secondary)] hover:border-white/20 hover:text-white"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {reorderMode ? "Done" : "Reorder"}
            </button>
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">

        {/* Watchlist tab */}
        {activeTab === "watchlist" && !selectedCollectionId && (
          <motion.div
            key="watchlist-tab"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
                  <BookmarkPlus className="w-9 h-9 text-[var(--accent-red)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h3>
                <p className="text-[var(--text-secondary)] text-sm max-w-xs mb-8">
                  Add movies and shows you want to watch later.
                </p>
                <Link
                  href="/browse"
                  className="px-6 py-3 bg-[var(--accent-red)] hover:bg-[var(--accent-red-hover)] text-white font-bold rounded-full transition-all hover:scale-105 text-sm"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : viewMode === "grid" ? (
              <div>
                {reorderMode && (
                  <div className="text-amber-400/80 text-xs mb-5 inline-flex h-8 items-center gap-1.5 bg-amber-500/8 px-2.5 py-1.5 rounded-full max-w-max border border-amber-500/15 pill-spacing">
                    <ArrowUpDown className="w-3.5 h-3.5 flex-shrink-0" />
                    Use the arrow buttons to reorder your queue
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {items.map((movie, index) => (
                    <div key={movie.id} className="relative group w-full">
                      <MovieCard movie={movie} size="md" className="w-full" />

                      {/* Reorder overlay */}
                      {reorderMode && (
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-2 z-30">
                          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1">
                            #{index + 1}
                          </p>
                          <div className="flex gap-2">
                            <button
                              disabled={index === 0}
                              onClick={() => reorder(index, index - 1)}
                              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white rounded-lg transition-colors text-sm"
                              title="Move up"
                            >▲</button>
                            <button
                              disabled={index === items.length - 1}
                              onClick={() => reorder(index, index + 1)}
                              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white rounded-lg transition-colors text-sm"
                              title="Move down"
                            >▼</button>
                          </div>
                          <button
                            onClick={() => remove(movie.id)}
                            className="mt-3 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      )}

                      {/* Collection menu trigger */}
                      {!reorderMode && (
                        <div className="absolute top-2 left-2 z-30">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenMovieMenuId(openMovieMenuId === movie.id ? null : movie.id);
                            }}
                            className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100"
                            title="Add to collection"
                          >
                            <Folder className="w-3.5 h-3.5" />
                          </button>

                          <AnimatePresence>
                            {openMovieMenuId === movie.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenMovieMenuId(null)} />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                                  className="absolute left-0 mt-1.5 w-48 rounded-xl border border-white/10 shadow-2xl p-2 z-50"
                                  style={{ background: "rgba(15,15,25,0.97)" }}
                                >
                                  <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest px-2 py-1.5">
                                    Add to Collection
                                  </p>
                                  <div className="max-h-40 overflow-y-auto space-y-0.5">
                                    {collections.map((col) => {
                                      const isIn = col.movieIds.includes(movie.id);
                                      return (
                                        <button
                                          key={col.id}
                                          onClick={() => isIn ? removeFromCollection(col.id, movie.id) : addToCollection(col.id, movie.id)}
                                          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all text-left"
                                        >
                                          <span className="truncate">{col.name}</span>
                                          {isIn && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {collections.length === 0 && (
                                    <p className="text-xs text-white/30 px-2.5 py-2">No collections yet</p>
                                  )}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* List view */
              <div className="space-y-2 max-w-3xl">
                {items.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-white/4 border border-white/5 hover:bg-white/8 transition-colors group"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <span className="text-xs font-bold text-white/20 w-5 text-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="relative w-11 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image src={getPosterUrl(movie.poster_path, "w342")} alt={movie.title} fill className="object-cover" sizes="44px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate text-sm group-hover:text-[var(--accent-red)] transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-secondary)]">
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                        {movie.runtime && <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>}
                        <span className="text-amber-400 font-semibold">★ {movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/watch/${movie.id}?media=${movie.media_type === "tv" ? "tv" : "movie"}`}
                        className="p-2 rounded-full bg-white/8 hover:bg-white text-white hover:text-black transition-colors"
                        title="Watch Now"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </Link>
                      <button
                        onClick={() => remove(movie.id)}
                        className="p-2 rounded-full bg-red-500/8 hover:bg-red-500 text-red-400 hover:text-white transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Collections index */}
        {activeTab === "collections" && !selectedCollectionId && (
          <motion.div
            key="collections-index"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {collections.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
                  <FolderHeart className="w-9 h-9 text-[var(--accent-red)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No collections yet</h3>
                <p className="text-[var(--text-secondary)] text-sm max-w-xs mb-8">
                  Group your saved movies into themed collections.
                </p>
                <button
                  onClick={() => setIsCreatingCollection(true)}
                  className="px-6 py-3 bg-[var(--accent-red)] hover:bg-[var(--accent-red-hover)] text-white font-bold rounded-full transition-all hover:scale-105 text-sm"
                >
                  Create Collection
                </button>
              </div>
            )}

            {collections.map((col) => (
              <div
                key={col.id}
                onClick={() => setSelectedCollectionId(col.id)}
                className="group cursor-pointer rounded-2xl border border-white/6 bg-white/4 hover:bg-white/8 hover:border-white/12 transition-all p-5 flex flex-col justify-between h-44 relative overflow-hidden"
              >
                {/* Blurred backdrop preview */}
                {col.movieIds.length > 0 && (() => {
                  const firstMovie = MOCK_MOVIES.find((m) => m.id === col.movieIds[0]);
                  return firstMovie ? (
                    <div className="absolute inset-0 opacity-8 group-hover:opacity-12 transition-all">
                      <Image src={getPosterUrl(firstMovie.poster_path, "w500")} alt="" fill className="object-cover blur-sm scale-110" />
                    </div>
                  ) : null;
                })()}

                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent-red)]/12 text-[var(--accent-red)] flex items-center justify-center mb-3">
                    <FolderHeart className="w-4.5 h-4.5" />
                  </div>

                  {editingCollectionId === col.id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text" value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-sm text-white outline-none flex-1 min-w-0"
                        autoFocus
                      />
                      <button onClick={() => handleRenameCollection(col.id)} className="text-emerald-400 hover:text-emerald-300">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingCollectionId(null)} className="text-white/40 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base group-hover:text-[var(--accent-red)] transition-colors truncate flex-1">
                        {col.name}
                      </h3>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingCollectionId(col.id); setEditingName(col.name); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-white/40 hover:text-white flex-shrink-0"
                        title="Rename"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {col.movieIds.length} {col.movieIds.length === 1 ? "movie" : "movies"}
                  </span>
                  {col.id !== "favorites" && col.id !== "towatch" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteCollection(col.id); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-white/25 hover:text-red-400"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Collection detail */}
        {selectedCollectionId && selectedCollection && (
          <motion.div
            key="collection-detail"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => { setSelectedCollectionId(null); setActiveTab("collections"); }}
                  className="text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                  Collections
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                <h2 className="text-xl font-black text-white">{selectedCollection.name}</h2>
              </div>

              <div className="flex items-center gap-3">
                {selectedCollection.id !== "favorites" && selectedCollection.id !== "towatch" && (
                  <button
                    onClick={() => { deleteCollection(selectedCollection.id); setSelectedCollectionId(null); setActiveTab("collections"); }}
                    className="flex items-center gap-2 px-4 py-2 border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-semibold rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
                <button
                  onClick={() => { setSelectedCollectionId(null); setActiveTab("collections"); }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  ← Back
                </button>
              </div>
            </div>

            {selectedCollectionMovies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
                  <FolderHeart className="w-8 h-8 text-[var(--accent-red)]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">This collection is empty</h3>
                <p className="text-[var(--text-secondary)] text-sm max-w-xs mb-6">
                  Go to your Watchlist, hover a movie, and tap the folder icon to add it here.
                </p>
                <button
                  onClick={() => { setSelectedCollectionId(null); setActiveTab("watchlist"); }}
                  className="px-5 py-2.5 bg-[var(--accent-red)] hover:bg-[var(--accent-red-hover)] text-white font-bold rounded-full transition-all text-sm"
                >
                  Go to Watchlist
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {selectedCollectionMovies.map((movie) => (
                  <div key={movie.id} className="relative group w-full">
                    <MovieCard movie={movie} size="md" className="w-full" />
                    <button
                      onClick={() => removeFromCollection(selectedCollection.id, movie.id)}
                      className="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100"
                      title="Remove from collection"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Collection modal */}
      <AnimatePresence>
        {isCreatingCollection && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCreatingCollection(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="rounded-2xl border border-white/10 p-6 shadow-2xl" style={{ background: "rgba(16,16,24,0.98)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-white">Create Collection</h3>
                  <button onClick={() => setIsCreatingCollection(false)} className="text-white/40 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateCollection} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-2">
                      Collection Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sci-Fi Favorites, Late Night Picks…"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[var(--accent-red)] transition-all"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCreatingCollection(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[var(--accent-red)] hover:bg-[var(--accent-red-hover)] text-white font-bold rounded-xl text-sm transition-all shadow-[var(--shadow-glow-red)]"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
