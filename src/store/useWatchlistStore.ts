"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "@/types/movie";

export interface Collection {
  id: string;
  name: string;
  movieIds: number[];
}

interface WatchlistState {
  items: Movie[];
  collections: Collection[];
  add: (movie: Movie) => void;
  remove: (id: number) => void;
  toggle: (movie: Movie) => void;
  isInWatchlist: (id: number) => boolean;
  reorder: (from: number, to: number) => void;
  createCollection: (name: string) => void;
  deleteCollection: (id: string) => void;
  renameCollection: (id: string, name: string) => void;
  addToCollection: (collectionId: string, movieId: number) => void;
  removeFromCollection: (collectionId: string, movieId: number) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      collections: [
        { id: "favorites", name: "Favorites ❤", movieIds: [] },
        { id: "towatch", name: "To Watch 🍿", movieIds: [] },
      ],
      add: (movie) =>
        set((s) => ({
          items: s.items.find((m) => m.id === movie.id) ? s.items : [...s.items, movie],
        })),
      remove: (id) =>
        set((s) => ({
          items: s.items.filter((m) => m.id !== id),
          collections: s.collections.map((c) => ({
            ...c,
            movieIds: c.movieIds.filter((mid) => mid !== id),
          })),
        })),
      toggle: (movie) => {
        if (get().isInWatchlist(movie.id)) get().remove(movie.id);
        else get().add(movie);
      },
      isInWatchlist: (id) => get().items.some((m) => m.id === id),
      reorder: (from, to) =>
        set((s) => {
          const arr = [...s.items];
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          return { items: arr };
        }),
      createCollection: (name) =>
        set((s) => ({
          collections: [
            ...s.collections,
            { id: Math.random().toString(36).substr(2, 9), name, movieIds: [] },
          ],
        })),
      deleteCollection: (id) =>
        set((s) => ({
          collections: s.collections.filter((c) => c.id !== id),
        })),
      renameCollection: (id, name) =>
        set((s) => ({
          collections: s.collections.map((c) => (c.id === id ? { ...c, name } : c)),
        })),
      addToCollection: (collectionId, movieId) =>
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  movieIds: c.movieIds.includes(movieId) ? c.movieIds : [...c.movieIds, movieId],
                }
              : c
          ),
        })),
      removeFromCollection: (collectionId, movieId) =>
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id === collectionId
              ? { ...c, movieIds: c.movieIds.filter((mid) => mid !== movieId) }
              : c
          ),
        })),
    }),
    { name: "cineverse-watchlist" }
  )
);

