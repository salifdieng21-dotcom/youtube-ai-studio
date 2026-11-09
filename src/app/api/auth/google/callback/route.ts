import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  GoogleSession, SESSION_COOKIE, STATE_COOKIE, cookieOptions, encrypt, getOrigin, getRedirectUri,
} from '@/lib/google-session';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const origin = getOrigin(req);
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauthError = url.searchParams.get('error');

  let stored: { nonce: string; returnTo: string } | null = null;
  try { stored = JSON.parse(cookies().get(STATE_COOKIE)?.value || 'null'); } catch {}

  const fail = (reason: string) => {
    const r = NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(reason)}`);
    r.cookies.delete(STATE_COOKIE);
    return r;
  };

  if (oauthError) return fail(oauthError);
  if (!code || !state || !stored || stored.nonce !== state) return fail('invalid_state');

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: getRedirectUri(req),
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) {
    console.error('Google token exchange failed:', await tokenRes.text());
    return fail('token_exchange_failed');
  }
  const tokens = await tokenRes.json();

  const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!infoRes.ok) return fail('userinfo_failed');
  const info = await infoRes.json();

  const session: GoogleSession = {
    sub: info.sub,
    email: info.email || '',
    name: info.name || info.given_name || 'Utilisateur',
    picture: info.picture || '',
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
  };

  const res = NextResponse.redirect(`${origin}${stored.returnTo || '/'}`);
  res.cookies.set(SESSION_COOKIE, encrypt(session), cookieOptions);
  res.cookies.delete(STATE_COOKIE);
  return res;
}
