"use client";
import { create } from "zustand";

interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  quality: "4K" | "1080p" | "720p" | "480p";
  subtitle: string;
  isFullscreen: boolean;
  showControls: boolean;
  setPlaying: (v: boolean) => void;
  togglePlay: () => void;
  setMuted: (v: boolean) => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  setProgress: (v: number) => void;
  setDuration: (v: number) => void;
  setQuality: (q: PlayerState["quality"]) => void;
  setSubtitle: (s: string) => void;
  setFullscreen: (v: boolean) => void;
  setShowControls: (v: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  isMuted: false,
  volume: 80,
  progress: 0,
  duration: 0,
  quality: "1080p",
  subtitle: "Off",
  isFullscreen: false,
  showControls: true,
  setPlaying: (isPlaying) => set({ isPlaying }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setMuted: (isMuted) => set({ isMuted }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setQuality: (quality) => set({ quality }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setShowControls: (showControls) => set({ showControls }),
}));
