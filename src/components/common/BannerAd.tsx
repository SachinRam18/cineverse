"use client";
import { useEffect } from "react";

export function BannerAd() {
  useEffect(() => {
    // Push ad serve after mount
    if (typeof window !== "undefined") {
      (window as any).AdProvider = (window as any).AdProvider || [];
      (window as any).AdProvider.push({ serve: {} });
    }
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <script
        async
        type="application/javascript"
        src="https://a.magsrv.com/ad-provider.js"
      />
      <ins className="eas6a97888e2" data-zoneid="5955686" />
    </div>
  );
}
