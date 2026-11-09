import { NextResponse } from 'next/server';
import { SESSION_COOKIE, cookieOptions, encrypt, getValidSession, isGoogleConfigured } from '@/lib/google-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const configured = isGoogleConfigured();
  const result = configured ? await getValidSession() : null;
  if (!result) {
    return NextResponse.json({ user: null, googleConfigured: configured });
  }
  const { session, updated } = result;
  const res = NextResponse.json({
    googleConfigured: true,
    user: {
      id: session.sub,
      email: session.email,
      fullName: session.name,
      avatarUrl: session.picture,
      provider: 'google',
    },
  });
  if (updated) res.cookies.set(SESSION_COOKIE, encrypt(session), cookieOptions);
  return res;
}
