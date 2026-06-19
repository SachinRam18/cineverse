"use client";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("flex-shrink-0 w-40 md:w-48 lg:w-52", className)}>
      <div className="skeleton rounded-xl aspect-[2/3] w-full mb-2" />
      <div className="skeleton h-3 w-3/4 mb-1 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative w-full h-[85vh] skeleton rounded-none">
      <div className="absolute bottom-24 left-16 space-y-4">
        <div className="skeleton h-12 w-80 rounded-lg" />
        <div className="skeleton h-5 w-64 rounded" />
        <div className="skeleton h-4 w-96 rounded" />
        <div className="flex gap-3 mt-6">
          <div className="skeleton h-12 w-36 rounded-full" />
          <div className="skeleton h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="px-6 md:px-12 mb-10">
      <div className="skeleton h-6 w-48 mb-5 rounded" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonDetailPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="skeleton w-full h-[60vh]" />
      <div className="px-6 md:px-16 py-10 space-y-6">
        <div className="skeleton h-10 w-96 rounded-lg" />
        <div className="skeleton h-5 w-64 rounded" />
        <div className="skeleton h-4 w-full max-w-2xl rounded" />
        <div className="skeleton h-4 w-5/6 max-w-2xl rounded" />
      </div>
    </div>
  );
}
