"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Subtitles, ChevronLeft, Server,
} from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface VideoPlayerProps {
  movie: Movie;
  season?: number;
  episode?: number;
}

type ContinueWatchingItem = {
  movieId: number;
  mediaType: "movie" | "tv";
  progress: number;
  timestamp: number;
  duration: number;
  episode: number;
  watchedAt: string;
};

const QUALITIES = ["4K", "1080p", "720p", "480p"] as const;
const SUBTITLES = ["Off", "English", "Spanish", "French", "German", "Japanese"];
const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export function VideoPlayer({ movie, season, episode }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const currentSeason = season ?? 1;
  const currentEpisode = episode ?? 1;
  const mediaType = movie.media_type === "tv" ? "tv" : "movie";

  const {
    isPlaying, isMuted, volume, progress, duration, quality, subtitle,
    isFullscreen, showControls,
    togglePlay, toggleMute, setVolume, setProgress, setDuration,
    setQuality, setSubtitle, setFullscreen, setShowControls, setPlaying,
  } = usePlayerStore();

  const [showQuality, setShowQuality] = useState(false);
  const [showSubs, setShowSubs] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerSource, setPlayerSource] = useState<"stream" | "trailer">("stream");
  const [activeServer, setActiveServer] = useState<"vidfast" | "videasy" | "vidrock">(() => {
    if (typeof window === "undefined") return "vidfast";
    const s = localStorage.getItem("cineverse_active_server");
    return s === "vidrock" || s === "videasy" || s === "vidfast" ? s : "vidfast";
  });

  const changeServer = (srv: "vidfast" | "videasy" | "vidrock") => {
    setActiveServer(srv);
    localStorage.setItem("cineverse_active_server", srv);
  };

  // postMessage progress listener
  useEffect(() => {
    const handleProgressMessage = (event: MessageEvent) => {
      const isVideasy = event.origin.includes("videasy.net");
      const isVidfast = ["vidfast.pro","vidfast.in","vidfast.io","vidfast.me",
        "vidfast.net","vidfast.pm","vidfast.xyz"].some(d => event.origin.includes(d));
      if (!isVideasy && !isVidfast) return;
      try {
        let data = event.data;
        if (typeof data === "string") data = JSON.parse(data);
        if (data && typeof data === "object") {
          const ts = data.timestamp || data.time || data.currentTime || data.seconds;
          const dur = data.duration;
          const pct = data.progress ?? (ts != null && dur ? (ts / dur) * 100 : undefined);
          if (ts != null) localStorage.setItem(
            `cineverse_progress_${movie.id}_${currentSeason}_${currentEpisode}`,
            Math.floor(ts).toString()
          );
          if (pct != null) {
            const key = "cineverse_continue_watching";
            const items: ContinueWatchingItem[] = JSON.parse(localStorage.getItem(key) || "[]");
            localStorage.setItem(key, JSON.stringify([
              { movieId: movie.id, mediaType, progress: pct, timestamp: ts || 0,
                duration: dur || 0, episode: currentEpisode, watchedAt: new Date().toISOString() },
              ...items.filter(i => i.movieId !== movie.id || i.mediaType !== mediaType),
            ].slice(0, 8)));
          }
        }
      } catch { /* ignore */ }
    };
    window.addEventListener("message", handleProgressMessage);
    return () => window.removeEventListener("message", handleProgressMessage);
  }, [movie.id, currentSeason, currentEpisode, mediaType]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playerSource === "trailer" && isPlaying) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [isPlaying, setPlaying, playerSource]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume / 100;
    v.muted = isMuted;
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v?.duration) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
    if (v.buffered.length > 0)
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v?.duration) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * v.duration;
    setCurrentTime(v.currentTime);
    setProgress(pct);
  };

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs)) return "0:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${m}:${String(s).padStart(2, "0")}`;
  };

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    if (isPlaying)
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, [isPlaying, setShowControls]);

  useEffect(() => { resetHideTimer(); }, [isPlaying, resetHideTimer]);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) { await el.requestFullscreen(); setFullscreen(true); }
    else { await document.exitFullscreen(); setFullscreen(false); }
  }, [setFullscreen]);

  useEffect(() => {
    const h = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, [setFullscreen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.code === "ArrowRight" && videoRef.current) videoRef.current.currentTime += 10;
      if (e.code === "ArrowLeft" && videoRef.current) videoRef.current.currentTime -= 10;
      if (e.code === "KeyF") toggleFullscreen();
      if (e.code === "KeyM") toggleMute();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [togglePlay, toggleMute, toggleFullscreen]);

  const isTVShow = movie.media_type === "tv"
    || movie.genres?.some(g => g.name.toLowerCase().includes("tv") || g.name.toLowerCase().includes("show"))
    || movie.title.toLowerCase().includes("series");

  const isAnime = (
    movie.genre_ids?.includes(16) ||
    movie.genres?.some(g => g.id === 16 || g.name.toLowerCase().includes("anime") || g.name.toLowerCase().includes("animation"))
  ) && movie.original_language === "ja";

  const savedProgressTime = useMemo<number | null>(() => {
    if (typeof window === "undefined") return null;
    const val = localStorage.getItem(`cineverse_progress_${movie.id}_${currentSeason}_${currentEpisode}`);
    return val ? parseInt(val, 10) : null;
  }, [movie.id, currentSeason, currentEpisode]);

  const embedUrl = useMemo(() => {
    if (activeServer === "vidrock") {
      return isTVShow
        ? `https://vidrock.ru/tv/${movie.imdb_id || movie.id}/${currentSeason}/${currentEpisode}`
        : `https://vidrock.ru/movie/${movie.imdb_id || movie.id}`;
    }
    if (activeServer === "videasy") {
      const base = isAnime
        ? isTVShow
          ? `https://player.videasy.net/anime/${movie.id}/${currentEpisode}`
          : `https://player.videasy.net/anime/${movie.id}`
        : isTVShow
          ? `https://player.videasy.net/tv/${movie.id}/${currentSeason}/${currentEpisode}`
          : `https://player.videasy.net/movie/${movie.id}`;
      const p = ["color=e50914","nextEpisode=true","autoplayNextEpisode=true","episodeSelector=true","overlay=true"];
      if (savedProgressTime && savedProgressTime > 5) p.push(`progress=${savedProgressTime}`);
      return `${base}?${p.join("&")}`;
    }
    // VidFast
    const base = isTVShow
      ? `https://vidfast.pro/tv/${movie.imdb_id || movie.id}/${currentSeason}/${currentEpisode}`
      : `https://vidfast.pro/movie/${movie.imdb_id || movie.id}`;
    const p = ["autoPlay=true","theme=e50914"];
    if (isTVShow) p.push("nextButton=true","autoNext=true");
    if (savedProgressTime && savedProgressTime > 5) p.push(`startAt=${savedProgressTime}`);
    return `${base}?${p.join("&")}`;
  }, [activeServer, isTVShow, isAnime, movie.id, movie.imdb_id, currentSeason, currentEpisode, savedProgressTime]);

  const closeAll = () => { setShowQuality(false); setShowSubs(false); };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black w-full overflow-hidden select-none",
        isFullscreen ? "h-screen" : "h-[56.25vw] max-h-[85vh] min-h-[300px]"
      )}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={() => closeAll()}
    >
      {/* Stream iframe */}
      {playerSource === "stream" && (
        <iframe
          src={embedUrl}
          className="absolute inset-0 z-10 w-full h-full border-0 bg-black"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      )}

      {/* Trailer video */}
      {playerSource === "trailer" && (
        <video
          ref={videoRef}
          src={SAMPLE_VIDEO}
          className="absolute inset-0 z-10 w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
          onEnded={() => setPlaying(false)}
          onClick={togglePlay}
          playsInline
        />
      )}

      {/* Top bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-16 group"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => {
              if (isPlaying) {
                const timer = setTimeout(() => setShowControls(false), 2000);
                hideTimer.current = timer;
              }
            }}
          >
            {/* Back */}
            <Link
              href={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`}
              className="flex items-center gap-2 rounded-full text-white text-[13px] font-medium bg-white/10 hover:bg-white/[0.17] border border-white/[0.16] transition-colors"
              style={{ padding: "0.5rem 1rem" }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="max-w-[160px] truncate">{movie.title}</span>
            </Link>

            {/* Right controls */}
            <div className="flex items-center gap-2.5">
              {/* Server switcher */}
              {playerSource === "stream" && (
                <div className="flex items-center gap-1 bg-black/55 border border-white/[0.12] rounded-full p-1.5">
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/40 border-r border-white/10 mr-0.5 select-none">
                    <Server className="w-3.5 h-3.5 text-purple-400" />
                    Server
                  </div>
                  {(["videasy", "vidfast", "vidrock"] as const).map((srv) => (
                    <button
                      key={srv}
                      onClick={(e) => { e.stopPropagation(); changeServer(srv); }}
                      className={cn(
                        "rounded-full text-[11px] font-bold transition-all",
                        activeServer === srv
                          ? "bg-purple-600 text-white"
                          : "text-white/55 hover:text-white"
                      )}
                      style={{ padding: "0.5rem 0.75rem" }}
                    >
                      {srv.charAt(0).toUpperCase() + srv.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Source tabs */}
              <div className="flex items-center gap-0.5 bg-black/55 border border-white/[0.12] rounded-full p-1.5">
                {(["stream", "trailer"] as const).map((src) => (
                  <button
                    key={src}
                    onClick={(e) => { e.stopPropagation(); setPlayerSource(src); }}
                    className={cn(
                      "rounded-full text-[11px] font-bold transition-all capitalize",
                      playerSource === src
                        ? "bg-[var(--accent-red)] text-white"
                        : "text-white/55 hover:text-white"
                    )}
                    style={{ padding: "0.5rem 0.75rem" }}
                  >
                    {src === "trailer" ? "Preview" : "Stream"}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center play indicator (trailer only) */}
      <AnimatePresence>
        {playerSource === "trailer" && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="w-[72px] h-[72px] rounded-full bg-black/55 border border-white/20 flex items-center justify-center">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls (trailer only) */}
      <AnimatePresence>
        {playerSource === "trailer" && showControls && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col justify-end z-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 42%)" }}
          >
            <div className="pointer-events-auto px-4 md:px-5 pb-4">
              {/* Progress */}
              <div className="group/prog mb-3">
                <div className="relative flex items-center h-5 cursor-pointer">
                  <div className="relative w-full h-[3px] group-hover/prog:h-[5px] rounded-full bg-white/20 transition-all duration-150 overflow-visible">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-white/25" style={{ width: `${buffered}%` }} />
                    <div className="absolute left-0 top-0 h-full rounded-full bg-[var(--accent-red)]" style={{ width: `${progress}%` }} />
                    {/* Scrubber thumb */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover/prog:opacity-100 transition-opacity pointer-events-none"
                      style={{ left: `${progress}%` }}
                    />
                    <input
                      type="range" min={0} max={100} step={0.1} value={progress}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}
                  className="text-white/75 hover:text-white transition-colors"
                  aria-label="Rewind 10s"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  className="w-9 h-9 rounded-full bg-white hover:bg-white/90 flex items-center justify-center flex-shrink-0 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying
                    ? <Pause className="w-[18px] h-[18px] text-black fill-black" />
                    : <Play className="w-[18px] h-[18px] text-black fill-black ml-0.5" />
                  }
                </button>

                <button
                  onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}
                  className="text-white/75 hover:text-white transition-colors"
                  aria-label="Forward 10s"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/vol">
                  <button onClick={toggleMute} className="text-white/75 hover:text-white transition-colors" aria-label="Toggle mute">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="w-0 group-hover/vol:w-[72px] overflow-hidden transition-all duration-300">
                    <input
                      type="range" min={0} max={100} value={isMuted ? 0 : volume} step={1}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        if (Number(e.target.value) > 0 && isMuted) toggleMute();
                      }}
                      className="w-[72px]"
                    />
                  </div>
                </div>

                <span className="text-[12px] text-white/50 font-mono ml-1 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="flex-1" />

                {/* Subtitles */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowSubs(v => !v); setShowQuality(false); }}
                    className={cn("text-white/75 hover:text-white transition-colors", showSubs && "text-white")}
                    aria-label="Subtitles"
                  >
                    <Subtitles className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {showSubs && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                        className="absolute bottom-10 right-0 w-36 rounded-xl overflow-hidden border border-white/10"
                        style={{ background: "rgba(10,10,18,0.97)" }}
                        onClick={e => e.stopPropagation()}
                      >
                        <p className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white/35 border-b border-white/[0.08]">Subtitles</p>
                        {SUBTITLES.map(s => (
                          <button key={s} onClick={() => { setSubtitle(s); setShowSubs(false); }}
                            className={cn("w-full px-4 py-2 text-[13px] text-left transition-colors",
                              subtitle === s ? "text-[var(--accent-red)] bg-[var(--accent-red)]/10" : "text-white/65 hover:bg-white/[0.05]"
                            )}
                          >{s}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quality */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowQuality(v => !v); setShowSubs(false); }}
                    className={cn(
                      "text-[11px] font-bold px-2 py-1 rounded border transition-colors",
                      showQuality
                        ? "border-[var(--accent-red)] text-[var(--accent-red)]"
                        : "border-white/25 text-white/65 hover:border-white/50 hover:text-white"
                    )}
                  >
                    {quality}
                  </button>
                  <AnimatePresence>
                    {showQuality && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                        className="absolute bottom-10 right-0 w-32 rounded-xl overflow-hidden border border-white/10"
                        style={{ background: "rgba(10,10,18,0.97)" }}
                        onClick={e => e.stopPropagation()}
                      >
                        <p className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white/35 border-b border-white/[0.08]">Quality</p>
                        {QUALITIES.map(q => (
                          <button key={q} onClick={() => { setQuality(q); setShowQuality(false); }}
                            className={cn("w-full px-4 py-2 text-[13px] text-left flex items-center gap-2 transition-colors",
                              quality === q ? "text-[var(--accent-red)] bg-[var(--accent-red)]/10" : "text-white/65 hover:bg-white/[0.05]"
                            )}
                          >
                            {q}
                            {q === "4K" && <span className="text-[10px] text-amber-400 font-bold">HDR</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                  className="text-white/75 hover:text-white transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}