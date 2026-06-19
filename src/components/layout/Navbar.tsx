"use client";
/**
 * NAVBAR COMPONENT
 * 
 * Fixed navigation bar displayed on all pages (z-50, top: 0).
 * Height: 66px (h-[66px])
 * 
 * Features:
 * - Logo + site name
 * - Navigation links (Home, Movies, TV Shows, Genres)
 * - Search functionality
 * - Responsive mobile menu
 * - Dynamic background (gradient when scrolled, transparent on hero)
 * 
 * Z-Index: z-50 (highest to stay above all content)
 * Spacing: All pages must account for navbar height (66px)
 */
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, Film, Bookmark, Menu, X, Tv, Flame, Ghost, Laugh, Heart, Swords } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Movies", icon: Film },
  { href: "/browse?media=tv", label: "TV Shows", icon: Tv },
  { href: "/browse?genre=28", label: "Action", icon: Flame },
  { href: "/browse?genre=878", label: "Sci-Fi", icon: Swords },
  { href: "/browse?genre=27", label: "Horror", icon: Ghost },
  { href: "/browse?genre=35", label: "Comedy", icon: Laugh },
  { href: "/browse?genre=10749", label: "Romance", icon: Heart },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useSearchStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const media = searchParams.get("media");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

        .navbar-root {
          font-family: 'Inter', sans-serif;
        }

        /* Scrolled state: rich dark glass */
        @keyframes border-pulse {
          0%, 100% { box-shadow: 0 1px 0 0 rgba(229,9,20,0.4), 0 8px 32px -8px rgba(0,0,0,0.6); }
          50%       { box-shadow: 0 1px 8px 0 rgba(229,9,20,1), 0 8px 32px -8px rgba(0,0,0,0.6); }
        }
        .navbar-scrolled {
          background: rgba(10, 10, 14, 0.92);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-bottom: 1px solid rgba(229,9,20,0.5);
          animation: border-pulse 2.5s ease-in-out infinite;
        }

        /* Default: cinematic gradient fade */
        .navbar-transparent {
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.32) 60%,
            transparent 100%
          );
          border-bottom: 1px solid transparent;
        }

        /* Logo glow pulse */
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 12px 2px rgba(229,9,20,0.45); }
          50%       { box-shadow: 0 0 22px 6px rgba(229,9,20,0.65); }
        }
        .logo-icon {
          background: #09090f;
          border-radius: 10px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: glow-pulse 3.5s ease-in-out infinite;
          transition: transform 0.2s ease;
        }
        .logo-icon:hover { transform: scale(1.08); }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #fff;
        }
        .logo-text span {
          background: linear-gradient(90deg, #e50914, #ff6030);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Nav links */
        .nav-link {
          position: relative;
          padding: 5px 12px;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: rgba(255,255,255,0.6);
          border-radius: 8px;
          transition: color 0.2s ease, background 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link svg {
          transition: color 0.2s ease, transform 0.2s ease;
          color: rgba(255,255,255,0.35);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #e50914, #ff6030);
          border-radius: 2px;
          transform: translateX(-50%);
          transition: width 0.25s ease;
        }
        .nav-link:hover {
          color: #fff;
          background: rgba(229,9,20,0.08);
        }
        .nav-link:hover svg {
          color: #e50914;
          transform: scale(1.15);
        }
        .nav-link:hover::after { width: 60%; }

        /* Active nav link */
        .nav-link-active {
          color: #fff !important;
          background: rgba(229,9,20,0.1) !important;
        }
        .nav-link-active svg {
          color: #e50914 !important;
        }
        .nav-link-active::after {
          width: 60% !important;
        }

        /* Divider between main links and genre links */
        .nav-divider {
          width: 1px;
          height: 18px;
          background: rgba(255,255,255,0.12);
          margin: 0 4px;
          flex-shrink: 0;

        /* ── Search button ── */
        .search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #e50914, #ff4d00);
          border: none;
          cursor: pointer;
          transition: all 0.22s ease;
          flex-shrink: 0;
          box-shadow: 0 2px 12px rgba(229,9,20,0.45);
        }
        .search-btn:hover {
          transform: translateY(-2px) scale(1.08);
          box-shadow: 0 6px 20px rgba(229,9,20,0.65);
        }
        .search-btn svg {
          color: #fff;
          transition: transform 0.2s ease;
        }
        .search-btn:hover svg { transform: scale(1.15) rotate(-8deg); }

        /* ── Avatar ── */
        .avatar-wrap {
          position: relative;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          cursor: pointer;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(135deg, #e50914, #ff8c00, #e50914);
          background-size: 200% 200%;
          animation: avatar-gradient 3s ease infinite;
          box-shadow: 0 2px 12px rgba(229,9,20,0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        @keyframes avatar-gradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .avatar-wrap:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 20px rgba(229,9,20,0.65);
        }
        .avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #0e0505;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.82rem;
          font-weight: 900;
        }

        /* Mobile menu */
        .mobile-drawer {
          background: rgba(10, 10, 14, 0.98);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }

        .mobile-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 8px 0;
        }

        /* Hamburger */
        .menu-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.7);
          border-radius: 10px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .menu-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }

        /* Live badge */
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          background: #e50914;
          border-radius: 4px;
          padding: 1px 5px;
          line-height: 1.6;
          margin-left: 6px;
          vertical-align: middle;
        }
        .live-badge::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff;
          animation: live-pulse 1.2s ease-in-out infinite;
        }
      `}</style>

      <motion.header
        className={cn(
          "navbar-root fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "navbar-scrolled" : "navbar-transparent"
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between px-8 sm:px-12 md:px-16 lg:px-20 h-[66px] gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" style={{ marginLeft: "2rem" }}>
            <div className="logo-icon" style={{ overflow: "hidden", padding: 0 }}>
              <Image src="/logo.svg" alt="CineVerse" width={34} height={34} priority />
            </div>
            <span className="logo-text hidden sm:block">
              Cine<span>Verse</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Primary links */}
            <Link href="/" className={cn("nav-link", pathname === "/" && "nav-link-active")}>
              <Home size={13} /> Home
            </Link>
            <Link href="/browse" className={cn("nav-link", pathname === "/browse" && !media && "nav-link-active")}>
              <Film size={13} /> Movies
            </Link>
            <Link href="/browse?media=tv" className={cn("nav-link", pathname === "/browse" && media === "tv" && "nav-link-active")}>
              <Tv size={13} /> TV Shows
            </Link>

            <span className="nav-divider" />

            {/* Genre links */}
            <Link href={`/browse?genre=28`} className={cn("nav-link", pathname?.includes("genre=28") && "nav-link-active")}>
              <Flame size={13} /> Action
            </Link>
            <Link href={`/browse?genre=878`} className={cn("nav-link", pathname?.includes("genre=878") && "nav-link-active")}>
              <Swords size={13} /> Sci-Fi
            </Link>
            <Link href={`/browse?genre=27`} className={cn("nav-link", pathname?.includes("genre=27") && "nav-link-active")}>
              <Ghost size={13} /> Horror
            </Link>
            <Link href={`/browse?genre=35`} className={cn("nav-link", pathname?.includes("genre=35") && "nav-link-active")}>
              <Laugh size={13} /> Comedy
            </Link>
            <Link href={`/browse?genre=10749`} className={cn("nav-link", pathname?.includes("genre=10749") && "nav-link-active")}>
              <Heart size={13} /> Romance
            </Link>

            <span className="nav-divider" />

            <Link href="/watchlist" className={cn("nav-link", pathname === "/watchlist" && "nav-link-active")}>
              <Bookmark size={13} /> Watchlist
            </Link>
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-4" style={{ marginRight: "2rem" }}>

            {/* Search */}
            <button
              onClick={openModal}
              aria-label="Search"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #e50914, #ff4d00)",
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                boxShadow: "0 2px 14px rgba(229,9,20,0.55)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 22px rgba(229,9,20,0.75)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 14px rgba(229,9,20,0.55)";
              }}
            >
              <Search size={15} color="#fff" />
            </button>

            {/* Avatar */}
            <Link href="/profile">
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  padding: "2px",
                  background: "linear-gradient(135deg, #e50914 0%, #ff8c00 50%, #e50914 100%)",
                  boxShadow: "0 2px 14px rgba(229,9,20,0.5)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 22px rgba(229,9,20,0.75)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 14px rgba(229,9,20,0.5)";
                }}
              >
                <div style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#120404",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: 900,
                }}>U</div>
              </div>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden menu-btn"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={20} />
                    </motion.span>
                  : <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={20} />
                    </motion.span>
                }
              </AnimatePresence>
            </button>

          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="mobile-drawer md:hidden overflow-hidden"
            >
              <nav className="flex flex-col px-4 py-4 gap-0.5">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="mobile-nav-link"
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                ))}

                <div className="mobile-divider" />

                <button
                  onClick={() => { setMobileOpen(false); openModal(); }}
                  className="mobile-nav-link w-full text-left"
                >
                  <Search size={17} />
                  Search
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}