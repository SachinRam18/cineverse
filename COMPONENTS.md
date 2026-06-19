# CineVerse Component Documentation

## File Structure Overview

```
src/
├── app/                           # Next.js pages/routes
│   ├── page.tsx                   # HOME: Hero + movie carousels
│   ├── browse/page.tsx            # BROWSE: Browse movies/TV by filters
│   ├── watch/[id]/page.tsx        # WATCH: Video player page
│   ├── movie/[id]/page.tsx        # DETAIL: Movie details page
│   ├── tv/[id]/page.tsx           # TV DETAIL: TV show details
│   ├── watchlist/page.tsx         # WATCHLIST: My library & collections
│   ├── profile/page.tsx           # PROFILE: User profile settings
│   └── layout.tsx                 # ROOT: Providers & root layout
│
├── components/                    # Reusable React components
│   ├── layout/
│   │   └── Navbar.tsx             # FIXED NAV: All pages navbar (z-50)
│   ├── movie/
│   │   ├── HeroBanner.tsx         # HERO: Featured movie carousel
│   │   ├── CarouselRow.tsx        # CAROUSEL: Generic horizontal scroll
│   │   ├── ContinueWatchingRow.tsx # CONTINUE: Resume watching row
│   │   └── MovieCard.tsx          # CARD: Individual movie card
│   ├── player/
│   │   └── VideoPlayer.tsx        # VIDEO: Stream/preview player (embedded iframe)
│   ├── watch/
│   │   ├── WatchPlayer.tsx        # WATCH: Video page wrapper
│   │   └── EpisodesCarousel.tsx   # EPISODES: Episode selection carousel
│   ├── common/
│   │   ├── GenreBadge.tsx         # BADGE: Genre tag
│   │   ├── RatingBadge.tsx        # BADGE: Rating stars
│   │   └── SkeletonCard.tsx       # SKELETON: Loading placeholders
│   ├── search/
│   │   └── SearchModal.tsx        # SEARCH: Search modal overlay
│   └── providers/
│       └── QueryProvider.tsx      # PROVIDER: React Query wrapper
│
├── lib/                           # Utility functions
│   ├── tmdb.ts                    # API: TMDB integration
│   ├── mock-data.ts               # DATA: Movie data + URL generators
│   └── utils.ts                   # UTILS: Helper functions
│
├── store/                         # Zustand state management
│   ├── usePlayerStore.ts          # STATE: Video player
│   ├── useProfileStore.ts         # STATE: User profile
│   ├── useSearchStore.ts          # STATE: Search modal
│   └── useWatchlistStore.ts       # STATE: Watchlist
│
└── types/
    └── movie.ts                   # TYPES: TypeScript interfaces
```

## Component Documentation

### Navigation

#### Navbar.tsx
**Location**: `components/layout/Navbar.tsx`
**Type**: Global, Fixed
**Z-Index**: 50 (top layer)
**Height**: 66px
**Position**: Fixed (top: 0)

**Exports**:
- `Navbar()` - Main navigation component

**Props**: None (uses hooks for state)

**Features**:
- Logo & site name
- Navigation links (Home, Movies, TV, Genres)
- Search icon (opens SearchModal)
- Responsive mobile menu
- Dynamic background (gradient on scroll)

**Usage**:
```tsx
// In layout.tsx
<Navbar />
```

---

### Movie Display Components

#### HeroBanner.tsx
**Location**: `components/movie/HeroBanner.tsx`
**Type**: Display
**Used On**: Home page

**Exports**:
- `HeroBanner({ movies })` - Hero carousel with featured movies

**Props**:
- `movies: Movie[]` - Array of movies to display

**Features**:
- Full viewport hero image carousel
- Auto-rotates every 8 seconds
- Movie title, rating, genres, description
- CTA buttons (Watch Now, More Info, Add to Watchlist)
- Navigation controls (prev/next, slide dots, mute)
- Gradient overlays for text readability

**Layout**:
- Height: 90vh (full viewport)
- Content positioned at bottom with pb-56 md:pb-72 lg:pb-80
- Content rows overlap with negative margin

---

#### CarouselRow.tsx
**Location**: `components/movie/CarouselRow.tsx`
**Type**: Display
**Used On**: Multiple pages

**Exports**:
- `CarouselRow({ title, movies, isLoading, cardSize, className })` - Generic horizontal carousel

**Props**:
- `title: string` - Section title
- `movies: Movie[]` - Movies to display
- `isLoading?: boolean` - Loading state
- `cardSize?: "sm" | "md" | "lg"` - Card size
- `className?: string` - Additional CSS classes

**Features**:
- Horizontal scrollable carousel
- Left/right navigation arrows (appear on hover)
- "See All" link (appears on hover)
- Skeleton loading cards
- Smooth scroll behavior

**Example**:
```tsx
<CarouselRow 
  title="Trending Now" 
  movies={trending}
  cardSize="lg"
/>
```

---

#### ContinueWatchingRow.tsx
**Location**: `components/movie/ContinueWatchingRow.tsx`
**Type**: Display (specialized)
**Used On**: Home page

**Exports**:
- `ContinueWatchingRow({ title, cardSize, className })` - Resume watching carousel

**Props**:
- `title: string` - Section title
- `cardSize?: "lg"` - Card size
- `className?: string` - Additional CSS classes

**Features**:
- Shows movies being watched
- Displays progress bar on cards
- Loads from localStorage (continue_watching)
- Smooth animations

**Example**:
```tsx
<ContinueWatchingRow title="Continue Watching" cardSize="lg" />
```

---

#### MovieCard.tsx
**Location**: `components/movie/MovieCard.tsx`
**Type**: Display (atomic)
**Used In**: CarouselRow, ContinueWatchingRow, Browse page

**Exports**:
- `MovieCard({ movie, index, size, progress })` - Individual movie card

**Props**:
- `movie: Movie` - Movie object
- `index?: number` - Array index
- `size?: "sm" | "md" | "lg"` - Card size
- `progress?: number` - Watch progress (0-100)

**Features**:
- Movie poster image
- Hover overlay with actions
- Watch/Info/Watchlist buttons
- Rating badge
- Watch progress indicator
- Link to movie details

---

### Player Components

#### VideoPlayer.tsx
**Location**: `components/player/VideoPlayer.tsx`
**Type**: Display (complex)
**Used On**: Watch page

**Exports**:
- `VideoPlayer({ movie, season, episode })` - Main video player

**Props**:
- `movie: Movie` - Movie/TV object
- `season?: number` - TV season (optional)
- `episode?: number` - TV episode (optional)

**Features**:
- Embedded iframe player (Vidfast, Videasy, Vidrock)
- Server selection (3 provider options)
- Stream vs Preview toggle
- Quality selector
- Subtitles selector
- Volume/mute controls
- Fullscreen toggle
- Keyboard shortcuts (space, arrows, F, M)
- Progress tracking (localStorage)
- Auto-resume from saved progress

**Controls**:
- `Play/Pause` - Space or click button
- `Skip ±10s` - Arrow keys or buttons
- `Fullscreen` - F or button
- `Mute` - M or button
- `Subtitle` - Click button
- `Quality` - Click button

---

#### WatchPlayer.tsx
**Location**: `components/watch/WatchPlayer.tsx`
**Type**: Container/Wrapper
**Used On**: Watch page (/watch/[id])

**Exports**:
- `WatchPlayer({ movie })` - Watch page wrapper

**Props**:
- `movie: Movie` - Movie/TV object

**Features**:
- Conditional rendering (TV shows only for episodes)
- Season selector (buttons)
- Episode carousel
- Fetches season/episode data from API

**Used Together**:
```tsx
// VideoPlayer: Renders the actual player
// EpisodesCarousel: Shows episode list
```

---

#### EpisodesCarousel.tsx
**Location**: `components/watch/EpisodesCarousel.tsx`
**Type**: Display
**Used In**: WatchPlayer component

**Exports**:
- `EpisodesCarousel({ title, episodes, isLoading, selectedEpisode, onSelectEpisode })` - Episode carousel

**Props**:
- `title: string` - Section title (e.g., "Season 5")
- `episodes: EpisodeItem[]` - Array of episodes
- `isLoading?: boolean` - Loading state
- `selectedEpisode?: number` - Currently selected episode number
- `onSelectEpisode?: (episodeNumber) => void` - Selection callback

**Features**:
- Horizontal scrollable episode carousel
- Episode thumbnail, title, description, air date
- Selection highlighting (red border)
- Left/right scroll buttons
- Loading skeleton cards
- Width: w-96 (384px)

---

### Common Components

#### GenreBadge.tsx
**Location**: `components/common/GenreBadge.tsx`
**Type**: Display (atomic)
**Used In**: HeroBanner, Movie detail pages

**Exports**:
- `GenreBadge({ name, size })` - Genre tag badge

**Props**:
- `name: string` - Genre name (e.g., "Action")
- `size?: "sm" | "md" | "lg"` - Badge size

**Features**:
- Colored borders per genre
- Smooth animations
- Responsive sizing

---

#### RatingBadge.tsx
**Location**: `components/common/RatingBadge.tsx`
**Type**: Display (atomic)
**Used In**: HeroBanner, MovieCard, Detail pages

**Exports**:
- `RatingBadge({ rating, size })` - Rating with star

**Props**:
- `rating: number` - Rating (0-10)
- `size?: "sm" | "md" | "lg"` - Badge size

**Features**:
- Star icon
- Rating number
- Color-coded (red for high, yellow for medium)

---

#### SkeletonCard.tsx
**Location**: `components/common/SkeletonCard.tsx`
**Type**: Display (loading state)
**Used In**: Carousels during loading

**Exports**:
- `SkeletonCard()` - Individual card placeholder
- `SkeletonHero()` - Hero banner placeholder
- `SkeletonRow()` - Row of skeleton cards
- `SkeletonDetailPage()` - Detail page placeholder

**Features**:
- Pulsing animation
- Matches card dimensions
- Smooth loading state

---

### Search Component

#### SearchModal.tsx
**Location**: `components/search/SearchModal.tsx`
**Type**: Modal overlay
**Used On**: All pages (triggered by Navbar)

**Exports**:
- `SearchModal()` - Search modal component

**Features**:
- Full-screen modal overlay
- Real-time search
- Movie/TV results
- Results grid display
- Close on escape/backdrop click

**State Management**: Uses `useSearchStore`

---

## State Management (Zustand Stores)

### usePlayerStore.ts
**Location**: `store/usePlayerStore.ts`

**State**:
- `isPlaying: boolean`
- `isMuted: boolean`
- `volume: number`
- `progress: number`
- `duration: number`
- `quality: string` ("4K", "1080p", "720p", "480p")
- `subtitle: string`
- `isFullscreen: boolean`
- `showControls: boolean`

**Actions**:
- `togglePlay()`, `toggleMute()`, `setVolume()`, `setProgress()`, etc.

---

### useWatchlistStore.ts
**Location**: `store/useWatchlistStore.ts`

**State**:
- `watchlist: Movie[]`

**Actions**:
- `toggle(movie)` - Add/remove from watchlist
- `isInWatchlist(movieId)` - Check if in watchlist
- `add(movie)`, `remove(movieId)`, `clear()`

---

### useSearchStore.ts
**Location**: `store/useSearchStore.ts`

**State**:
- `isOpen: boolean`
- `query: string`

**Actions**:
- `openModal()`, `closeModal()`
- `setQuery(query)`

---

### useProfileStore.ts
**Location**: `store/useProfileStore.ts`

**State**:
- User profile data

**Actions**:
- Profile management

---

## File Naming Conventions

✅ **Clear & Descriptive** (Good)
- `VideoPlayer.tsx` - Clear it's a video player
- `EpisodesCarousel.tsx` - Clear it displays episodes
- `HeroBanner.tsx` - Clear it's a hero section

❌ **Ambiguous** (Avoid)
- `Player.tsx` - Too generic
- `Carousel.tsx` - Too generic (which carousel?)
- `Row.tsx` - Too generic

---

## Quick Navigation

- 🎬 **Movie Display**: CarouselRow, MovieCard, HeroBanner
- 📺 **Watch Page**: VideoPlayer, WatchPlayer, EpisodesCarousel
- 🎮 **Player Controls**: VideoPlayer (internal)
- 🔍 **Search**: SearchModal
- 🏠 **Navigation**: Navbar
- 🎨 **Common UI**: GenreBadge, RatingBadge, SkeletonCard

---
**Last Updated**: June 19, 2026
