"use client";

import { cn } from "@/lib/utils";

interface GenreBadgeProps {
  name: string;
  size?: "sm" | "md";
  className?: string;
}

const genreColors: Record<string, string> = {
  Action: "bg-red-500/15 text-red-300 border-red-500/25",
  Adventure: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  Animation: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
  Comedy: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  Crime: "bg-zinc-500/15 text-zinc-300 border-zinc-500/25",
  Documentary: "bg-teal-500/15 text-teal-300 border-teal-500/25",
  Drama: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  Family: "bg-green-500/15 text-green-300 border-green-500/25",
  Fantasy: "bg-purple-500/15 text-purple-300 border-purple-500/25",
  History: "bg-stone-500/15 text-stone-300 border-stone-500/25",
  Horror: "bg-red-900/25 text-red-200 border-red-900/40",
  Music: "bg-pink-500/15 text-pink-300 border-pink-500/25",
  Mystery: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
  Romance: "bg-rose-500/15 text-rose-300 border-rose-500/25",
  "Sci-Fi": "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  Thriller: "bg-slate-500/15 text-slate-300 border-slate-500/25",
  War: "bg-neutral-500/15 text-neutral-300 border-neutral-500/25",
  Western: "bg-yellow-900/15 text-yellow-200 border-yellow-900/30",
};

export function GenreBadge({
  name,
  size = "sm",
  className,
}: GenreBadgeProps) {
  const colors =
    genreColors[name] ??
    "bg-white/10 text-white/70 border-white/15";

  return (
    <span
      className={cn(
        "pill-sm rounded-full inline-flex items-center justify-center border",
        "font-semibold tracking-[0.02em] whitespace-nowrap",
        "transition-all duration-300 hover:scale-105",
        "text-[11px]",
        "pill-spacing",
        colors,
        className
      )}
    >
      {name}
    </span>
  );
}