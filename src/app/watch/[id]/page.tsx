import { fetchMovieDetails, fetchTvDetails } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import { WatchPlayer } from "@/components/watch/WatchPlayer";
import { CarouselRow } from "@/components/movie/CarouselRow";
import Link from "next/link";
import { Star, Clock, Calendar, ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ media?: string | string[] }>;
}

export default async function WatchPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { media } = await searchParams;
  const mediaId = Number(id);
  const mediaType = Array.isArray(media) ? media[0] : media;

  const movie =
    mediaType === "tv"
      ? await fetchTvDetails(mediaId)
      : mediaType === "movie"
        ? await fetchMovieDetails(mediaId)
        : (await fetchTvDetails(mediaId)) ?? (await fetchMovieDetails(mediaId));

  if (!movie) notFound();

  const related = (movie.similar ?? []).slice(0, 12);

  return (
    <div className="min-h-screen relative" style={{ background: "#000" }}>
      {/* Fixed navbar spacer - accounts for fixed navbar height (66px) */}
      <div className="h-16 md:h-20" />

      {/* Player wrapper - centered with proper spacing from navbar */}
      <div className="relative z-20 my-16 md:my-24 px-6 md:px-10 lg:px-12">
        <WatchPlayer movie={movie} />
      </div>

      {/* Info + related below the player */}
      <div className="mt-12 md:mt-16" style={{ background: "var(--bg-primary)" }}>
        <div className="px-6 md:px-10 py-8 space-y-4 md:space-y-6" style={{
          borderBottom: "1px solid transparent",
          borderImage: "linear-gradient(90deg, transparent, rgba(229,9,20,0.4), transparent) 1"
        }}>
          {/* Back link */}
          <Link
            href={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to details
          </Link>

          {/* Title + meta */}
          <h1 className="text-xl md:text-2xl font-black text-white leading-tight" style={{ marginBottom: "1.5rem" }}>
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3 h-3 fill-amber-400" />
              {movie.vote_average.toFixed(1)}
            </span>
            {movie.runtime && (
              <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                <Clock className="w-3 h-3" />
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}
            <span className="flex items-center gap-1 text-[var(--text-secondary)]">
              <Calendar className="w-3 h-3" />
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>

          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-3xl">
            {movie.overview}
          </p>
        </div>

        {related.length > 0 && (
          <div className="pb-28 pt-12 md:pt-20">
            <div className="px-6 md:px-10">
              <CarouselRow title="Up Next" movies={related} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
