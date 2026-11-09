import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { GOOGLE_SCOPES, STATE_COOKIE, getOrigin, getRedirectUri, isGoogleConfigured } from '@/lib/google-session';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(`${getOrigin(req)}/login?error=not_configured`);
  }
  const returnTo = new URL(req.url).searchParams.get('returnTo') || '/';
  const nonce = crypto.randomBytes(16).toString('hex');

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: getRedirectUri(req),
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state: nonce,
  });

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  res.cookies.set(STATE_COOKIE, JSON.stringify({ nonce, returnTo: returnTo.startsWith('/') ? returnTo : '/' }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
