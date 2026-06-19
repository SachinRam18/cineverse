# CineVerse Layout & Spacing Guide

## Critical Z-Index Stack (Top to Bottom)

```
z-50   → Navbar (fixed, top: 0) - HEIGHT: 66px
z-30   → Modal/Dialogs
z-20   → Page Content (watch page player)
z-10   → Hero content rows (home page)
z-0    → Background
```

## Spacing Strategy

### HOME PAGE (/app/page.tsx)
```
┌─────────────────────────────────┐
│  NAVBAR (z-50, fixed, h-66px)   │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  HERO BANNER (90vh)             │  Content positioned at bottom
│  - Full viewport height         │  pb-56 md:pb-72 lg:pb-80
│  - Gradient overlays            │
│  - Auto-carousel (8s)           │
│  - CTA Buttons at bottom        │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  CONTENT ROWS (z-10)            │  Negative margin: -mt-20 md:-mt-32 lg:-mt-40
│  - Continue Watching (overlaps) │  Top padding: pt-32 md:pt-48 lg:pt-56
│  - Trending Now                 │  Creates layered effect
│  - Top Rated, New, Genres       │  Sits above hero gradient
└─────────────────────────────────┘
```

### WATCH PAGE (/app/watch/[id]/page.tsx)
```
┌─────────────────────────────────┐
│  NAVBAR (z-50, fixed, h-66px)   │
└─────────────────────────────────┘
                  ↓
         66px spacer (h-16 md:h-20)  ← Accounts for navbar
                  ↓
┌─────────────────────────────────┐
│  VIDEO PLAYER (z-20)            │  my-16 md:my-24 margin for spacing
│  - Stream/Trailer toggle        │  px-6 md:px-10 lg:px-12
│  - Server selector              │
│  - Full video controls          │
└─────────────────────────────────┘
                  ↓
         Episodes Carousel
                  ↓
         Related Movies
```

## Component Files & Their Purpose

### Layout Components
- **Navbar.tsx** - Fixed navigation (z-50, all pages)
- **Layout.tsx** - Root wrapper with providers

### Movie Display
- **HeroBanner.tsx** - Hero carousel (home page)
- **CarouselRow.tsx** - Generic horizontal scroll movie carousel
- **ContinueWatchingRow.tsx** - Continue watching carousel
- **MovieCard.tsx** - Individual movie card component

### Watch Page Components
- **VideoPlayer.tsx** - Main video player (stream/preview)
- **WatchPlayer.tsx** - Watch page wrapper (VideoPlayer + EpisodesCarousel)
- **EpisodesCarousel.tsx** - Episode selection carousel

### Common Components
- **GenreBadge.tsx** - Genre tag display
- **RatingBadge.tsx** - Rating star display
- **SkeletonCard.tsx** - Loading placeholders

### Utility Files
- **mock-data.ts** - Movie data & image URL generators
- **tmdb.ts** - TMDB API calls
- **utils.ts** - Helper functions (cn() for tailwind classes)

### Store/State Management
- **usePlayerStore** - Video player state
- **useProfileStore** - User profile state
- **useSearchStore** - Search modal state
- **useWatchlistStore** - Watchlist management

## Key Measurements

| Element | Height | Z-Index | Fixed? |
|---------|--------|---------|--------|
| Navbar | 66px | 50 | Yes (top-0) |
| Hero Banner | 90vh | 0 | No |
| Video Player | 56.25vw (16:9) | 20 | No |
| Spacer | 64px-80px | 0 | No |

## Padding/Margin Conventions

- **Navbar**: `h-[66px]` (fixed height)
- **Spacer**: `h-16 md:h-20` (accounts for navbar)
- **Content horizontal**: `px-6 md:px-10 lg:px-12`
- **Content vertical**: `py-6`, `my-8`, `mt-16`, etc.
- **Negative overlap**: `-mt-20 md:-mt-32 lg:-mt-40`

## Common Issues & Solutions

### Issue: Content overlaps navbar
**Solution**: Add `h-16 md:h-20` spacer div at top of page

### Issue: Hero content hidden behind navbar
**Solution**: Use proper z-index and bottom padding on hero

### Issue: Video player overlaps navbar
**Solution**: Add navbar spacer + proper margin on player wrapper

---
**Last Updated**: June 19, 2026
