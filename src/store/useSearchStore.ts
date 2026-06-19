"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  query: string;
  recentSearches: string[];
  isOpen: boolean;
  setQuery: (q: string) => void;
  addRecent: (q: string) => void;
  removeRecent: (q: string) => void;
  clearRecent: () => void;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      query: "",
      recentSearches: [],
      isOpen: false,
      setQuery: (query) => set({ query }),
      addRecent: (q) =>
        set((s) => ({
          recentSearches: [q, ...s.recentSearches.filter((r) => r !== q)].slice(0, 8),
        })),
      removeRecent: (q) =>
        set((s) => ({ recentSearches: s.recentSearches.filter((r) => r !== q) })),
      clearRecent: () => set({ recentSearches: [] }),
      openModal: () => set({ isOpen: true }),
      closeModal: () => set({ isOpen: false, query: "" }),
      toggleModal: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "cineverse-search", partialize: (s) => ({ recentSearches: s.recentSearches }) }
  )
);
