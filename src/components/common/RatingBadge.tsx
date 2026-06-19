"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingBadge({
  rating,
  size = "sm",
  className,
}: RatingBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "bg-white/10 backdrop-blur-xl",
        "border border-white/10",
        "shadow-lg shadow-black/20",
        "font-semibold",
        "transition-all duration-300",

        size === "sm" && "gap-1.5 px-3 py-2 text-xs",
        size === "md" && "pill-sm gap-2 text-sm",
        size === "lg" && "gap-2.5 px-5 py-3 text-base",

        className
      )}
    >
      <Star
        className={cn(
          "fill-amber-400 text-amber-400 flex-shrink-0",
          size === "sm" && "w-3.5 h-3.5",
          size === "md" && "w-4 h-4",
          size === "lg" && "w-5 h-5"
        )}
      />

      <span className="text-white tabular-nums leading-tight">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}