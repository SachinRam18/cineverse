"use client";
import { Code, Mail, Heart, Film, Home, Bookmark, Play } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      background: "linear-gradient(to bottom, rgba(10,10,14,0.6) 0%, rgba(0,0,0,0.9) 100%)",
      borderTop: "2px solid transparent",
      backgroundImage: "linear-gradient(to bottom, rgba(10,10,14,0.6) 0%, rgba(0,0,0,0.9) 100%), linear-gradient(90deg, rgba(229,9,20,0.4) 0%, rgba(229,9,20,0.1) 50%, rgba(229,9,20,0.4) 100%)",
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box",
      marginLeft: "calc(-50vw + 50%)",
      marginRight: "calc(-50vw + 50%)",
      width: "100vw"
    }}>
      <style>{`
        .footer-container {
          padding: 2rem 4rem;
          font-family: 'Inter', sans-serif;
          border-top: 2px solid;
          border-image: linear-gradient(90deg, rgba(229,9,20,0.6) 0%, rgba(229,9,20,0.2) 50%, rgba(229,9,20,0.6) 100%) 1;
          position: relative;
        }
        @media (max-width: 640px) {
          .footer-container {
            padding: 1.5rem;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .footer-container {
            padding: 1.5rem 2.5rem;
          }
        }
        @media (min-width: 1025px) {
          .footer-container {
            padding: 2rem 4rem;
          }
        }

        .footer-logo-icon {
          background: linear-gradient(135deg, #e50914 0%, #ff4d00 100%);
          border-radius: 10px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
          transition: all 0.3s ease;
        }
        .footer-logo-icon:hover {
          transform: scale(1.1) rotate(3deg);
          box-shadow: 0 0 28px rgba(229, 9, 20, 0.5);
        }

        .footer-logo-text {
          font-size: 1.125rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #fff;
        }
        .footer-logo-text span {
          background: linear-gradient(90deg, #e50914, #ff6030);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-section-title {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #fff;
          text-transform: uppercase;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #e50914, #ff6030);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-link {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: all 0.2s ease;
          padding: 4px 0;
          display: block;
          position: relative;
        }
        .footer-link::before {
          content: '';
          position: absolute;
          left: 0;
          width: 0;
          height: 1.5px;
          background: linear-gradient(90deg, #e50914, #ff6030);
          transition: width 0.25s ease;
        }
        .footer-link:hover {
          color: #fff;
        }
        .footer-link:hover::before {
          width: 16px;
        }

        .footer-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(229, 9, 20, 0.15);
          border: 1px solid rgba(229, 9, 20, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e50914;
          cursor: pointer;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .footer-icon-btn:hover {
          background: rgba(229, 9, 20, 0.3);
          border-color: rgba(229, 9, 20, 0.5);
          color: #ff6030;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(229, 9, 20, 0.25);
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(229,9,20,0.3), transparent);
          margin: 2rem 0;
        }

        .footer-bottom-text {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.02em;
        }
        .footer-bottom-link {
          color: rgba(229, 9, 20, 0.8);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-bottom-link:hover {
          color: #e50914;
        }
      `}</style>

      <div className="footer-container">
        <div className="max-w-7xl mx-auto">
          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            {/* Brand - Takes 4 columns */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="footer-logo-icon">
                  <Film className="w-5 h-5" />
                </div>
                <div className="footer-logo-text">Cine<span>Verse</span></div>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginTop: "0.75rem" }}>
                Premium movie and TV show streaming experience. Discover cinematic entertainment in stunning quality.
              </p>
            </div>

            {/* Navigation - Takes 3 columns */}
            <div className="md:col-span-3">
              <h3 className="footer-section-title">Navigation</h3>
              <ul className="space-y-2">
                <li><a href="/" className="footer-link">Home</a></li>
                <li><a href="/browse" className="footer-link">Browse</a></li>
                <li><a href="/watchlist" className="footer-link">My Library</a></li>
                <li><a href="/profile" className="footer-link">Profile</a></li>
              </ul>
            </div>

            {/* Features - Takes 2.5 columns */}
            <div className="md:col-span-2">
              <h3 className="footer-section-title">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="footer-link">4K Streaming</a></li>
                <li><a href="#" className="footer-link">Recommendations</a></li>
                <li><a href="#" className="footer-link">Watchlist</a></li>
                <li><a href="#" className="footer-link">Settings</a></li>
              </ul>
            </div>

            {/* Social - Takes 2.5 columns */}
            <div className="md:col-span-3">
              <h3 className="footer-section-title">Connect</h3>
              <div className="flex gap-3">
                <button className="footer-icon-btn" title="GitHub">
                  <Code className="w-5 h-5" />
                </button>
                <button className="footer-icon-btn" title="Email">
                  <Mail className="w-5 h-5" />
                </button>
                <button className="footer-icon-btn" title="Heart">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="footer-icon-btn" title="Play">
                  <Play className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider" />
        </div>
      </div>
    </footer>
  );
}
