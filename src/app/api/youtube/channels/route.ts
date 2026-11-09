import { NextResponse } from 'next/server';
import { SESSION_COOKIE, cookieOptions, encrypt, getValidSession } from '@/lib/google-session';

export const dynamic = 'force-dynamic';

// Lists the YouTube channels owned by the signed-in Google account.
export async function GET() {
  const result = await getValidSession();
  if (!result) return NextResponse.json({ error: 'Non connecté à Google' }, { status: 401 });

  const ytRes = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
    { headers: { Authorization: `Bearer ${result.session.accessToken}` } }
  );
  const data = await ytRes.json();
  if (!ytRes.ok) {
    return NextResponse.json({ error: data.error?.message || 'Erreur YouTube API' }, { status: ytRes.status });
  }

  const channels = (data.items || []).map((c: any) => ({
    id: c.id,
    title: c.snippet?.title,
    handle: c.snippet?.customUrl,
    thumbnail: c.snippet?.thumbnails?.high?.url || c.snippet?.thumbnails?.default?.url,
    subscribers: Number(c.statistics?.subscriberCount || 0),
    views: Number(c.statistics?.viewCount || 0),
    videos: Number(c.statistics?.videoCount || 0),
  }));

  const res = NextResponse.json({ channels });
  if (result.updated) res.cookies.set(SESSION_COOKIE, encrypt(result.session), cookieOptions);
  return res;
}
