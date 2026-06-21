export const dynamic = "force-dynamic";
import { fetchTrending, fetchTrendingTv, fetchTopRated, fetchNewReleases, fetchByGenre } from "@/lib/tmdb";
import { HeroBanner } from "@/components/movie/HeroBanner";
import { CarouselRow } from "@/components/movie/CarouselRow";
import { ContinueWatchingRow } from "@/components/movie/ContinueWatchingRow";

export default async function HomePage() {
  const trending = await fetchTrending();
  const topRated = await fetchTopRated();
  const newReleases = await fetchNewReleases();
  const actionMovies = await fetchByGenre(28);
  const scifiMovies = await fetchByGenre(878);
  const thrillerMovies = await fetchByGenre(53);
  const trendingTv = await fetchTrendingTv();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero banner - full viewport coverage */}
      <HeroBanner movies={trending.slice(0, 5)} />

      {/* Content rows with proper spacing - positioned to overlap hero with negative margin */}
      <div className="relative z-10 pb-24 pt-32 md:pt-48 lg:pt-56 -mt-20 md:-mt-32 lg:-mt-40">
        <ContinueWatchingRow title="Continue Watching" cardSize="lg" />
        <CarouselRow title="Trending Now" movies={trending} cardSize="lg" />
        <CarouselRow title="Top Rated" movies={topRated} cardSize="lg" />
        <CarouselRow title="New Releases" movies={newReleases} cardSize="lg" />
        <CarouselRow title="Action" movies={actionMovies} cardSize="lg" />
        <CarouselRow title="Science Fiction" movies={scifiMovies} cardSize="lg" />
        <CarouselRow title="Trending TV" movies={trendingTv} cardSize="lg" />
        <CarouselRow title="Mystery & Thriller" movies={thrillerMovies} cardSize="lg" />
      </div>
    </div>
  );
}
