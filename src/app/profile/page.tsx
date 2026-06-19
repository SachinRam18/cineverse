"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Heart, Play, Film, Camera,
  Check, CreditCard, Sliders, ChevronRight, X, Eye, EyeOff, Lock, Mail,
} from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { MOCK_MOVIES, MOCK_TV_SHOWS, GENRES, getBackdropUrl, getPosterUrl } from "@/lib/mock-data";
import { MovieCard } from "@/components/movie/MovieCard";
import { Movie } from "@/types/movie";
import Link from "next/link";
import Image from "next/image";

const AVATAR_OPTIONS = [
  { id: "avatar-purple", name: "Nebula", gradient: "from-purple-600 via-pink-500 to-red-500" },
  { id: "avatar-blue", name: "Ocean", gradient: "from-blue-600 via-cyan-500 to-emerald-400" },
  { id: "avatar-red", name: "Solar", gradient: "from-red-600 via-orange-500 to-yellow-500" },
  { id: "avatar-green", name: "Aurora", gradient: "from-emerald-600 via-teal-500 to-cyan-500" },
  { id: "avatar-gold", name: "Supernova", gradient: "from-amber-500 via-yellow-400 to-orange-600" },
];

const VALID_EMAIL = "admin@123";
const VALID_PASSWORD = "admin@123";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const {
    username, avatarId, preferredGenreId, streamQuality,
    autoplayNext, audioLanguage, planTier, favoriteIds,
    setUsername, setAvatarId, setPreferredGenreId, setStreamQuality,
    setAutoplayNext, setAudioLanguage, toggleFavorite,
  } = useProfileStore();

  const { items: watchlistItems } = useWatchlistStore();

  const [activeSection, setActiveSection] = useState<"overview" | "edit" | "settings">("overview");
  const [nameInput, setNameInput] = useState(username);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarId);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(preferredGenreId);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [continueWatchingItems, setContinueWatchingItems] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      setNameInput(username);
      setSelectedAvatar(avatarId);
      setSelectedGenre(preferredGenreId);
    }
  }, [mounted, username, avatarId, preferredGenreId]);

  useEffect(() => {
    if (mounted) {
      const stored = localStorage.getItem("cineverse_continue_watching");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const items = parsed.map((item: any) => {
              const movie =
                item.mediaType === "tv"
                  ? MOCK_TV_SHOWS.find((m) => m.id === item.movieId)
                  : item.episode
                    ? MOCK_TV_SHOWS.find((m) => m.id === item.movieId) ?? MOCK_MOVIES.find((m) => m.id === item.movieId)
                  : MOCK_MOVIES.find((m) => m.id === item.movieId) ?? MOCK_TV_SHOWS.find((m) => m.id === item.movieId);
              return {
                movie: movie || { id: item.movieId, title: `Movie ${item.movieId}`, backdrop_path: null, genres: [] },
                progress: Math.round(item.progress),
                label: item.episode ? `Episode ${item.episode}` : null,
              };
            }).filter(item => item.movie !== null);
            setContinueWatchingItems(items);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      const defaultItems = MOCK_MOVIES.slice(8, 12).map((m, i) => ({
        movie: m,
        progress: [65, 30, 85, 12][i],
        label: null as string | null,
      }));
      setContinueWatchingItems(defaultItems);
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-6 pb-20 flex items-center justify-center bg-[#09090f]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--accent-red)]" />
      </div>
    );
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        setIsSignedIn(true);
      } else {
        setLoginError("Invalid email or password.");
      }
      setLoginLoading(false);
    }, 600);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="rounded-2xl border border-white/8 p-8 shadow-2xl" style={{ background: "rgba(16,16,24,0.97)", backdropFilter: "blur(24px)" }}>
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <div style={{ background: "linear-gradient(135deg,#e50914,#ff4d00)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={16} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff" }}>
                Cine<span style={{ background: "linear-gradient(90deg,#e50914,#ff6030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Verse</span>
              </span>
            </div>

            <h2 className="text-xl font-black text-white text-center mb-1">Sign in to your account</h2>
            <p className="text-sm text-center mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>Use <span className="text-white/70 font-mono">admin@123</span> for both fields</p>

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setLoginError(""); }}
                  className="w-full rounded-xl text-sm text-white outline-none transition-all pl-11 pr-4 py-3"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${loginError ? "rgba(229,9,20,0.5)" : "rgba(255,255,255,0.09)"}` }}
                  required
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError(""); }}
                  className="w-full rounded-xl text-sm text-white outline-none transition-all pl-11 pr-11 py-3"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${loginError ? "rgba(229,9,20,0.5)" : "rgba(255,255,255,0.09)"}` }}
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {loginError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs font-semibold" style={{ color: "#e50914" }}>
                    {loginError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#e50914,#ff4d00)", boxShadow: "0 4px 20px rgba(229,9,20,0.35)" }}
              >
                {loginLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const favoriteMovies = favoriteIds
    .map((fid) => MOCK_MOVIES.find((m) => m.id === fid))
    .filter(Boolean) as Movie[];

  const activeAvatar = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(nameInput.trim() || "Explorer");
    setAvatarId(selectedAvatar);
    setPreferredGenreId(selectedGenre);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setActiveSection("overview");
  };

  return (
    <div className="min-h-screen pt-6 pb-24" style={{ background: "var(--bg-primary)" }}>

      {/* Banner */}
      <div className="relative h-44 md:h-56 w-full overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-red-950">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
      </div>

      {/* Profile card overlay */}
      <div className="relative -mt-20 z-10 px-6 md:px-12 lg:px-16 mb-16">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">

          {/* Avatar */}
          <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${activeAvatar.gradient} flex items-center justify-center text-white text-4xl md:text-5xl font-black shadow-2xl border-4 border-[#09090f] flex-shrink-0 group cursor-pointer`}
            onClick={() => setActiveSection("edit")}
          >
            {username.charAt(0).toUpperCase()}
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Name + plan */}
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight" style={{ marginBottom: "1.5rem" }}>{username}</h1>
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent-red)]/15 text-[var(--accent-red)] text-[11px] font-bold uppercase tracking-wider border border-[var(--accent-red)]/25">
                PRO
              </span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">{planTier || "Premium Plan"}</p>
            <p className="text-white/25 text-xs mt-1">Member since June 2024</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveSection(activeSection === "edit" ? "overview" : "edit")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeSection === "edit"
                  ? "bg-white text-black border-white"
                  : "glass glass-hover border-white/10 text-white"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveSection(activeSection === "settings" ? "overview" : "settings")}
              className={`p-2.5 rounded-xl transition-all border ${
                activeSection === "settings"
                  ? "bg-white text-black border-white"
                  : "glass glass-hover border-white/10 text-white"
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="space-y-24"
            >
              {/* Continue Watching */}
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Play className="w-4 h-4 text-[var(--accent-red)] fill-[var(--accent-red)]" />
                  Continue Watching
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {continueWatchingItems.map(({ movie, progress, label }) => (
                    <Link
                      key={movie.id}
                      href={`/watch/${movie.id}?media=${movie.media_type === "tv" ? "tv" : "movie"}`}
                      className="group rounded-2xl overflow-hidden bg-white/4 border border-white/5 hover:border-white/10 transition-all flex flex-col"
                    >
                      {/* Backdrop thumbnail (landscape) */}
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <Image
                          src={getBackdropUrl(movie.backdrop_path, "w780")}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[var(--accent-red)] flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                          <div className="h-full bg-[var(--accent-red)]" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-white truncate text-sm">{movie.title}</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          {label ? `${label} • ` : ""}{progress}% watched
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Favorites + Watchlist preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Favorites */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    Favorites
                  </h3>
                  {favoriteMovies.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border border-white/5 bg-white/3">
                      <p className="text-[var(--text-secondary)] text-sm">No favorites saved yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {favoriteMovies.map((movie) => (
                        <div key={movie.id} className="relative group">
                          <MovieCard movie={movie} size="sm" />
                          <button
                            onClick={() => toggleFavorite(movie.id)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black text-red-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove from favorites"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Watchlist sidebar preview */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-purple-400" />
                      Watchlist
                    </h3>
                    <Link
                      href="/watchlist"
                      className="text-xs font-semibold text-[var(--text-secondary)] hover:text-white flex items-center gap-1 transition-colors"
                    >
                      View all <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {watchlistItems.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl border border-white/5 bg-white/3">
                      <p className="text-[var(--text-secondary)] text-sm mb-3">Your watchlist is empty</p>
                      <Link href="/browse" className="text-xs text-[var(--accent-red)] font-semibold hover:underline">
                        Find something to watch
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {watchlistItems.slice(0, 5).map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`}
                          className="flex items-center gap-3 p-2 rounded-xl bg-white/4 hover:bg-white/8 transition-colors"
                        >
                          <div className="relative w-9 h-13 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={getPosterUrl(movie.poster_path, "w342")} alt="" fill className="object-cover" sizes="36px" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-white text-xs truncate">{movie.title}</h4>
                            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                              {new Date(movie.release_date).getFullYear()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* EDIT PROFILE */}
          {activeSection === "edit" && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="max-w-xl"
            >
              <h3 className="text-xl font-bold text-white mb-7">Edit Profile</h3>
              <form onSubmit={handleProfileSave} className="space-y-6">
                {/* Display name */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-[var(--accent-red)] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                    placeholder="Your name"
                    required
                  />
                </div>

                {/* Avatar */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-3">
                    Avatar Style
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                          selectedAvatar === av.id
                            ? "bg-white/10 border-white/50"
                            : "border-white/8 hover:border-white/20"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${av.gradient} shadow-md`} />
                        <span className="text-[10px] text-white/60 font-medium">{av.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred genre */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-3">
                    Preferred Genre
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGenre(null)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        selectedGenre === null
                          ? "bg-[var(--accent-red)] border-[var(--accent-red)] text-white"
                          : "border-white/10 text-white/50 hover:border-white/25"
                      }`}
                    >
                      No preference
                    </button>
                    {GENRES.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGenre(g.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          selectedGenre === g.id
                            ? "bg-[var(--accent-red)] border-[var(--accent-red)] text-white"
                            : "border-white/10 text-white/50 hover:border-white/25"
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[var(--accent-red)] hover:bg-[var(--accent-red-hover)] text-white font-bold rounded-xl text-sm transition-all shadow-[var(--shadow-glow-red)]"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("overview")}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* SETTINGS */}
          {activeSection === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="max-w-2xl space-y-6"
            >
              {/* App preferences */}
              <div className="bg-white/4 border border-white/5 rounded-2xl p-6">
                <h4 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Playback Preferences
                </h4>
                <div className="space-y-5 divide-y divide-white/5">
                  {/* Video quality */}
                  <div className="flex items-center justify-between pt-5 first:pt-0">
                    <div>
                      <h5 className="font-semibold text-sm text-white">Video Quality</h5>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">Default streaming resolution</p>
                    </div>
                    <select
                      value={streamQuality}
                      onChange={(e) => setStreamQuality(e.target.value as "4K" | "1080p" | "720p")}
                      className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-[var(--accent-red)] transition-all cursor-pointer"
                    >
                      <option value="4K">4K UHD</option>
                      <option value="1080p">Full HD (1080p)</option>
                      <option value="720p">HD (720p)</option>
                    </select>
                  </div>

                  {/* Autoplay */}
                  <div className="flex items-center justify-between pt-5">
                    <div>
                      <h5 className="font-semibold text-sm text-white">Autoplay Next</h5>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">Automatically play the next episode</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoplayNext}
                        onChange={(e) => setAutoplayNext(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-red)]" />
                    </label>
                  </div>

                  {/* Language */}
                  <div className="flex items-center justify-between pt-5">
                    <div>
                      <h5 className="font-semibold text-sm text-white">Audio Language</h5>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">Preferred soundtrack language</p>
                    </div>
                    <select
                      value={audioLanguage}
                      onChange={(e) => setAudioLanguage(e.target.value)}
                      className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-[var(--accent-red)] transition-all cursor-pointer"
                    >
                      <option>English (Original)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>Korean</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Billing */}
              <div className="bg-white/4 border border-white/5 rounded-2xl p-6">
                <h4 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Billing & Subscription
                </h4>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/4 border border-white/5">
                    <div>
                      <p className="text-[10px] text-white/35 uppercase font-bold tracking-widest mb-1">Active Plan</p>
                      <h5 className="font-bold text-sm text-white">{planTier || "Premium"}</h5>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">$19.99 / month · Renews Jul 12, 2026</p>
                    </div>
                    <button className="px-4 py-2 border border-white/10 hover:border-white/30 rounded-lg text-xs font-semibold text-white transition-all self-start sm:self-auto">
                      Change Plan
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/4 border border-white/5">
                    <div>
                      <p className="text-[10px] text-white/35 uppercase font-bold tracking-widest mb-1">Payment</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[10px] font-bold text-white">VISA</span>
                        <span className="font-bold text-sm text-white">•••• 4890</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-white/10 hover:border-white/30 rounded-lg text-xs font-semibold text-white transition-all self-start sm:self-auto">
                      Update Card
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save success toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[200] flex items-center gap-2.5 px-5 py-3 bg-emerald-500 text-white rounded-xl shadow-2xl font-semibold text-sm"
          >
            <Check className="w-4 h-4" />
            Profile saved
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
