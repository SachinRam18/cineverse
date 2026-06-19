# 🎬 CineVerse - Premium Movie Streaming Platform

A modern Next.js-based movie streaming platform with a clean, intuitive UI inspired by Netflix. Browse, search, and watch movies and TV shows with a fully functional video player and episode management system.

## 🚀 Features

- **🎥 Video Player**: Stream movies with multiple server options (Vidfast, Videasy, Vidrock)
- **📺 TV Shows**: Browse TV series with season and episode selection
- **🎬 Movies**: Discover trending, top-rated, and new release movies
- **📚 Watchlist**: Save movies to personal library with custom collections
- **🔍 Search**: Full-text search across movies and TV shows
- **📊 Browse**: Filter by genre, media type, and sort options
- **👤 Profile**: User profile and watchlist management
- **⚡ Performance**: Built with Next.js, Tailwind CSS, and Framer Motion

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js Pages & Routes
│   ├── page.tsx                  # 🏠 HOME: Hero + movie carousels
│   ├── browse/page.tsx           # 📂 BROWSE: Filter/search movies
│   ├── watch/[id]/page.tsx       # 📺 WATCH: Video player page
│   ├── movie/[id]/page.tsx       # 🎬 DETAIL: Movie details
│   ├── tv/[id]/page.tsx          # 📺 DETAIL: TV show details
│   ├── watchlist/page.tsx        # 📚 WATCHLIST: My library
│   ├── profile/page.tsx          # 👤 PROFILE: User settings
│   └── layout.tsx                # Root wrapper
│
├── components/                   # Reusable Components
│   ├── layout/Navbar.tsx         # 🧭 Fixed navigation bar
│   ├── movie/                    # Movie display components
│   │   ├── HeroBanner.tsx        # Featured carousel
│   │   ├── CarouselRow.tsx       # Generic horizontal scroll
│   │   ├── ContinueWatchingRow.tsx
│   │   └── MovieCard.tsx         # Individual movie card
│   ├── player/VideoPlayer.tsx    # 🎥 Streaming player
│   ├── watch/
│   │   ├── WatchPlayer.tsx       # Watch page wrapper
│   │   └── EpisodesCarousel.tsx  # Episode selection
│   ├── search/SearchModal.tsx    # 🔍 Search modal
│   ├── common/                   # Shared UI components
│   │   ├── GenreBadge.tsx
│   │   ├── RatingBadge.tsx
│   │   └── SkeletonCard.tsx
│   └── providers/QueryProvider.tsx
│
├── lib/                          # Utilities & APIs
│   ├── tmdb.ts                   # TMDB API integration
│   ├── mock-data.ts              # Movie data & URL generators
│   └── utils.ts                  # Helper functions
│
├── store/                        # Zustand State Management
│   ├── usePlayerStore.ts         # Video player state
│   ├── useWatchlistStore.ts      # Watchlist state
│   ├── useSearchStore.ts         # Search modal state
│   └── useProfileStore.ts        # User profile state
│
└── types/movie.ts               # TypeScript interfaces
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image
- **API Integration**: TMDB API
- **Video Players**: Embedded iframes (Vidfast, Videasy, Vidrock)

---

## 📚 Documentation

This project includes comprehensive documentation:

### 1. **LAYOUT_GUIDE.md** - Spacing & Z-Index Strategy
   - Z-index layer stack (Navbar z-50 to Background z-0)
   - Responsive spacing for each page
   - Component spacing conventions
   - Common layout issues & solutions

### 2. **COMPONENTS.md** - Component Reference
   - 20+ components fully documented
   - Props, features, usage examples
   - State management stores explained
   - File naming conventions

### 3. **FIXES_APPLIED.md** - Latest Updates (June 19)
   - Watch page player overlap - FIXED ✅
   - Episodes carousel creation - NEW ✅
   - Navbar visibility fixes - FIXED ✅
   - All changes fully documented

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd cineverse

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Visit http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🎨 Key Components

### Navigation
- **Navbar** - Fixed top navigation (z-50, h-66px) with search, links, mobile menu

### Movie Display
- **HeroBanner** - Auto-rotating featured movies carousel (90vh height)
- **CarouselRow** - Generic horizontal scrollable carousel
- **MovieCard** - Individual movie card with rating, watchlist actions
- **ContinueWatchingRow** - Resume watching carousel with progress

### Video Playback
- **VideoPlayer** - Main video player with multiple servers, quality/subtitle selection
- **WatchPlayer** - Wrapper for watch page (VideoPlayer + EpisodesCarousel)
- **EpisodesCarousel** - TV episode selection carousel (w-96, horizontal scroll)

### UI Components
- **GenreBadge** - Genre tag display with color
- **RatingBadge** - Rating star display with scoring
- **SkeletonCard** - Loading placeholder with pulsing animation
- **SearchModal** - Full-screen search with results grid

---

## 📐 Layout Architecture (CRITICAL)

### Z-Index Stack (Top to Bottom)
```
z-50 → Navbar (fixed position, always top)
z-30 → Modals/Dialogs (search modal, etc)
z-20 → Page Content (watch page player)
z-10 → Hero Content (home page content rows)
z-0  → Background (default layer)
```

### Spacing on Watch Page (FIXED)
```
Navbar (z-50, fixed, h-66px)
  ↓
Spacer: h-16 md:h-20 (64-80px)  ← Accounts for navbar height
  ↓
Player Wrapper: my-16 md:my-24  ← Centered with margins
  ↓
Related Movies/Info
```

### Hero Page Spacing
```
Hero Banner (pb-56 md:pb-72 lg:pb-80)
  ↓ Overlaps with negative margin
Content Rows (pt-32 md:pt-48 lg:pt-56, -mt-20 md:-mt-32 lg:-mt-40)
  ↓ Sits on top of hero with proper gradient
```

---

## 🎬 Video Player Features

### Multiple Servers
- **Vidfast** - Primary streaming provider
- **Videasy** - Alternative with anime support
- **Vidrock** - Backup streaming option

### Player Controls
- **Play/Pause** - Space bar or button click
- **Seek** - Arrow keys (±10 seconds)
- **Volume** - Hover slider or mute button
- **Fullscreen** - F key or fullscreen button
- **Mute** - M key or mute icon
- **Quality** - 4K, 1080p, 720p, 480p selector
- **Subtitles** - Language selection (10+ languages)
- **Server Switching** - Choose provider mid-stream

### Smart Features
- **Progress Tracking** - Saves to localStorage
- **Auto-Resume** - Remembers watch position
- **Quality Selection** - Persistent preference
- **Keyboard Shortcuts** - Full control via keyboard

---

## 📱 Responsive Design

All components fully responsive across devices:

| Screen | Breakpoint | Layout |
|--------|-----------|--------|
| Mobile | < 640px | Single column, full width |
| Tablet | 640-1024px | 2-3 column, adjusted spacing |
| Desktop | 1024px+ | Full featured 3+ columns |

Tailwind breakpoints used:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 🔧 Configuration

### Environment Setup
```bash
# Create .env.local file
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

### External APIs
- **TMDB**: Movie database API
- **Streaming**: Vidfast, Videasy, Vidrock embeds

---

## ✅ Recent Fixes (June 19, 2026)

### ✅ WATCH PAGE PLAYER OVERLAP - FIXED
**Problem**: Video player was overlapping with navbar
**Solution**: Added navbar spacer + proper z-index layering
**Result**: Player now displays correctly below navbar

### ✅ EPISODES CAROUSEL - CREATED
**Problem**: Episodes were in non-scrollable grid
**Solution**: Created horizontal scrollable EpisodesCarousel component
**Result**: Episodes now display beautifully with proper spacing

### ✅ NAVBAR VISIBILITY - FIXED
**Problem**: Navbar was hidden on /watch routes
**Solution**: Removed conditional return statement
**Result**: Navbar now visible on all pages

---

## 📖 Quick Reference

### Spacing for New Pages
```tsx
export default function NewPage() {
  return (
    <div className="min-h-screen">
      {/* Spacer for navbar */}
      <div className="h-16 md:h-20" />
      
      {/* Your content with proper z-index */}
      <div className="relative z-20 px-6 md:px-10 lg:px-12">
        {/* Content here */}
      </div>
    </div>
  );
}
```

### Add Movie Carousel
```tsx
<CarouselRow 
  title="Trending Now" 
  movies={movies}
  cardSize="lg"
/>
```

### Add Episode Selection
```tsx
<EpisodesCarousel
  title="Season 1"
  episodes={episodes}
  selectedEpisode={selected}
  onSelectEpisode={setSelected}
/>
```

---

## 📚 Documentation Files

All project documentation in root:
- **README.md** (this file) - Project overview
- **LAYOUT_GUIDE.md** - Spacing & layout strategy
- **COMPONENTS.md** - Component reference
- **FIXES_APPLIED.md** - Recent changes

---

## 🐛 Troubleshooting

### Content overlaps navbar?
- Add `<div className="h-16 md:h-20" />` at page top

### Z-index issues?
- Check LAYOUT_GUIDE.md for current stack
- Use z-50 (navbar) > z-20 (content) > z-10 (bg)

### Spacing looks wrong?
- Use `px-6 md:px-10 lg:px-12` for horizontal
- Use `my-16 md:my-24` for vertical spacing

---

## 💡 Code Standards

### Component Naming ✅
- `VideoPlayer.tsx` - Clear purpose
- `EpisodesCarousel.tsx` - Clear purpose
- `HeroBanner.tsx` - Clear purpose

### Documentation Style
All components have JSDoc with:
```tsx
/**
 * COMPONENT_NAME
 * 
 * What it does
 * 
 * Features: ...
 * Used on: Page/Route
 */
```

---

## 📞 Support

For questions:
1. Check **LAYOUT_GUIDE.md** - Spacing help
2. Check **COMPONENTS.md** - Component reference
3. Check **FIXES_APPLIED.md** - Recent updates
4. Review component code comments

---

## 🎯 Future Roadmap

- [ ] User authentication
- [ ] Payment integration
- [ ] AI recommendations
- [ ] Social features
- [ ] Offline downloads
- [ ] Viewing history
- [ ] Family profiles
- [ ] Enhanced search

---

**Status**: ✅ Production Ready (All Critical Issues Fixed)
**Last Updated**: June 19, 2026
**Version**: 1.0.0
