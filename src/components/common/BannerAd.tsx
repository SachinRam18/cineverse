"use client";
import Script from "next/script";

export function BannerAd() {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minHeight: "60px", margin: "1rem 0" }}>
      <Script
        src="https://a.magsrv.com/ad-provider.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined") {
            (window as any).AdProvider = (window as any).AdProvider || [];
            (window as any).AdProvider.push({ serve: {} });
          }
        }}
      />
      <ins className="eas6a97888e2" data-zoneid="5955686" />
    </div>
  );
}
