import { notFound } from "next/navigation";
import { getBackdropUrl, getPosterUrl, getProfileUrl } from "@/lib/mock-data";
import { fetchMovieDetails } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Clock, Calendar, Globe } from "lucide-react";
import { GenreBadge } from "@/components/common/GenreBadge";
import { CarouselRow } from "@/components/movie/CarouselRow";
import { MovieDetailClient } from "./MovieDetailClient";

export const dynamic = "force-dynamic";

type Params = { id: string };

interface Props {
  params: Promise<Params>;
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const movie = await fetchMovieDetails(Number(id));
  if (!movie) notFound();

  const cast = movie.credits?.cast.slice(0, 8) ?? [];
  const similar = movie.similar?.slice(0, 12) ?? [];
  const director = movie.credits?.crew.find((c) => c.job === "Director");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Full-width backdrop */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src={getBackdropUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(9,9,15,0.97) 10%, rgba(9,9,15,0.5) 65%, transparent 100%)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-black/20" />
      </div>

      {/* Main content */}
      <div className="relative -mt-56 md:-mt-64 z-10 px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 md:flex-row md:gap-20 lg:gap-24 items-start">
          {/* Poster */}
          <div className="flex-shrink-0 w-52 sm:w-60 md:w-64 lg:w-72 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-[28px] overflow-hidden shadow-[0_28px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/12">
              <Image
                src={getPosterUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 160px, 240px"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-0 md:pt-10 lg:pt-14 min-w-0 flex flex-col gap-5">
            {/* Genres */}
            <div className="flex flex-wrap gap-2.5">
              {movie.genres?.map((g) => (
                <GenreBadge key={g.id} name={g.name} size="md" />
              ))}
            </div>

            {/* Title */}
            <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95]" style={{ marginBottom: "2rem" }}>
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-[var(--text-secondary)] italic text-base md:text-lg leading-relaxed">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="inline-flex h-8 items-center gap-1.5 bg-amber-500/12 text-amber-400 font-bold px-2.5 rounded-full border border-amber-500/20 pill-spacing">
                <Star className="w-4 h-4 fill-amber-400" />
                {movie.vote_average.toFixed(1)}
                <span className="text-amber-400/50 font-normal text-xs">/ 10</span>
              </div>

              {movie.runtime && (
                <div className="inline-flex h-8 items-center gap-1.5 text-[var(--text-secondary)] bg-white/6 px-2.5 rounded-full border border-white/8 pill-spacing">
                  <Clock className="w-4 h-4" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </div>
              )}

              <div className="inline-flex h-8 items-center gap-1.5 text-[var(--text-secondary)] bg-white/6 px-2.5 rounded-full border border-white/8 pill-spacing">
                <Calendar className="w-4 h-4" />
                {new Date(movie.release_date).getFullYear()}
              </div>

              <div className="inline-flex h-8 items-center gap-1.5 text-[var(--text-secondary)] bg-white/6 px-2.5 rounded-full border border-white/8 pill-spacing">
                <Globe className="w-4 h-4" />
                {movie.original_language.toUpperCase()}
              </div>
            </div>

            {/* Overview */}
            <p className="text-[var(--text-secondary)] leading-8 md:leading-9 text-base md:text-lg max-w-2xl">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link href={`/watch/${movie.id}`} className="pill pill-red">
                <Play className="w-4 h-4 fill-white" />
                Watch Now
              </Link>

              <MovieDetailClient movie={movie} />

              {movie.trailer_key && (
                <a
                  href={`https://youtube.com/watch?v=${movie.trailer_key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill pill-glass"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Trailer
                </a>
              )}
            </div>

            {director && (
              <p className="text-sm text-[var(--text-secondary)]">
                Directed by <span className="text-white font-semibold">{director.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>
            <div style={{ 
              paddingTop: "1.5rem", 
              paddingBottom: "1rem", 
              paddingRight: "1rem",
              borderTop: "1px solid transparent",
              borderBottom: "1px solid transparent",
              borderImage: "linear-gradient(90deg, transparent, rgba(229,9,20,0.4), transparent) 1"
            }}>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight" style={{ marginBottom: "1rem" }}>Cast</h2>
              <style>{`
                .cast-card {
                  width: 130px;
                  background: rgba(255,255,255,0.03);
                  border: 1px solid rgba(255,255,255,0.1);
                  border-radius: 16px;
                  padding: 1.25rem 0.75rem;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  transition: border-color 0.2s ease, background 0.2s ease;
                }
                .cast-card:hover {
                  border-color: rgba(255,255,255,0.2);
                  background: rgba(255,255,255,0.06);
                }
              `}</style>
              <div className="flex gap-4 overflow-x-auto carousel-scroll pb-4 pr-4">
                {cast.map((member) => (
                  <div key={member.id} className="flex-shrink-0" style={{ width: "130px" }}>
                    <div className="cast-card">
                      <div className="relative overflow-hidden rounded-full flex-shrink-0" style={{ width: "80px", height: "80px" }}>
                        <Image
                          src={getProfileUrl(member.profile_path)}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="text-center w-full" style={{ marginTop: "0.875rem" }}>
                        <p className="text-sm font-semibold text-white leading-tight line-clamp-2">{member.name}</p>
                        <p className="text-xs leading-tight line-clamp-2" style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>{member.character}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Similar movies */}
        {similar.length > 0 && (
          <div style={{ marginTop: "2.5rem" }} className="mx-[-1.25rem] sm:mx-[-2rem] md:mx-[-3rem] lg:mx-[-4rem]">
            <CarouselRow title="More Like This" movies={similar} />
          </div>
        )}
      </div>
    </div>
  );
}
