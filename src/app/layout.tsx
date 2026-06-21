import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchModal } from "@/components/search/SearchModal";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { BannerAd } from "@/components/common/BannerAd";

export const metadata: Metadata = {
  title: "CineVerses",
  description: "Discover and stream thousands of movies and TV shows in stunning 4K. CineVerses is your premium destination for cinematic entertainment.",
  keywords: ["movies", "streaming", "cinema", "4K", "tv shows", "watch online"],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "CineVerses",
    description: "Your premium destination for cinematic entertainment.",
    type: "website",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://quge5.com/88/tag.min.js" data-zone="251657" async data-cfasync="false"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script src="https://pl29828697.effectivecpmnetwork.com/97/f0/79/97f0795f37d50e8f673f650a6b6baf0b.js"></script>
      </head>
      <body suppressHydrationWarning>
        <a href="https://www.effectivecpmnetwork.com/fg4z75ky?key=17cd319389fd490c67f3ea9b4512385d" style={{ display: "none" }} aria-hidden="true" />
        <QueryProvider>
          <Suspense fallback={null}>
            <Navbar />
            <SearchModal />
            <main className="pt-[76px]" style={{ paddingBottom: "2rem" }}>{children}</main>
            <BannerAd />
            <Footer />
          </Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
