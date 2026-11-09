import { NextResponse } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/google-session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const session = readSession();
  if (session?.refreshToken || session?.accessToken) {
    // Best effort: revoke Google access
    fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(session.refreshToken || session.accessToken)}`, {
      method: 'POST',
    }).catch(() => {});
  }
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
