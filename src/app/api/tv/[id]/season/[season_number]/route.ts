import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; season_number: string }> }
) {
  const { id, season_number } = await params;
  if (!API_KEY || !id || !season_number) {
    return NextResponse.json({ episodes: [] }, { status: 200 });
  }

  const url = `${TMDB_BASE}/tv/${encodeURIComponent(id)}/season/${encodeURIComponent(season_number)}?api_key=${API_KEY}&language=en-US`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ episodes: [] }, { status: 200 });
    }
    const data = await res.json();
    return NextResponse.json({ episodes: data.episodes ?? [] });
  } catch {
    return NextResponse.json({ episodes: [] }, { status: 200 });
  }
}
