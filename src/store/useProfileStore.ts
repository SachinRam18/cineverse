"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
  username: string;
  avatarId: string;
  preferredGenreId: number | null;
  streamQuality: "4K" | "1080p" | "720p";
  autoplayNext: boolean;
  audioLanguage: string;
  planTier: string;
  favoriteIds: number[];
  
  setUsername: (name: string) => void;
  setAvatarId: (id: string) => void;
  setPreferredGenreId: (id: number | null) => void;
  setStreamQuality: (quality: "4K" | "1080p" | "720p") => void;
  setAutoplayNext: (val: boolean) => void;
  setAudioLanguage: (lang: string) => void;
  toggleFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      username: "Cinematic Explorer",
      avatarId: "avatar-purple",
      preferredGenreId: 878, // Sci-Fi default
      streamQuality: "1080p",
      autoplayNext: true,
      audioLanguage: "English (Original)",
      planTier: "CineVerse Premium 4K + HDR",
      favoriteIds: [693134, 157336, 27205, 569094], // Dune, Interstellar, Inception, Spider-Verse default favorites

      setUsername: (username) => set({ username }),
      setAvatarId: (avatarId) => set({ avatarId }),
      setPreferredGenreId: (preferredGenreId) => set({ preferredGenreId }),
      setStreamQuality: (streamQuality) => set({ streamQuality }),
      setAutoplayNext: (autoplayNext) => set({ autoplayNext }),
      setAudioLanguage: (audioLanguage) => set({ audioLanguage }),
      toggleFavorite: (movieId) =>
        set((s) => {
          const isFav = s.favoriteIds.includes(movieId);
          return {
            favoriteIds: isFav
              ? s.favoriteIds.filter((id) => id !== movieId)
              : [...s.favoriteIds, movieId],
          };
        }),
      isFavorite: (movieId) => get().favoriteIds.includes(movieId),
    }),
    { name: "cineverse-profile" }
  )
);
