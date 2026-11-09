import crypto from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'yt_studio_session';
export const STATE_COOKIE = 'yt_studio_oauth_state';

export const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
].join(' ');

export interface GoogleSession {
  sub: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // ms epoch
}

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

// Key derived from the client secret so no extra secret is required.
function getKey(): Buffer {
  const secret = process.env.SESSION_SECRET || process.env.GOOGLE_CLIENT_SECRET || '';
  return crypto.createHash('sha256').update(`yt-studio-session:${secret}`).digest();
}

export function encrypt(data: unknown): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64url');
}

export function decrypt<T>(value: string): T | null {
  try {
    const buf = Buffer.from(value, 'base64url');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const enc = buf.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv);
    decipher.setAuthTag(tag);
    const out = Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
    return JSON.parse(out) as T;
  } catch {
    return null;
  }
}

export function getOrigin(req: Request): string {
  const url = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || url.host;
  const proto = req.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  return `${proto}://${host}`;
}

export function getRedirectUri(req: Request): string {
  return `${getOrigin(req)}/api/auth/google/callback`;
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

export function readSession(): GoogleSession | null {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  return raw ? decrypt<GoogleSession>(raw) : null;
}

/** Returns a valid session, refreshing the access token when needed.
 *  `updated` is true when the cookie must be re-written. */
export async function getValidSession(): Promise<{ session: GoogleSession; updated: boolean } | null> {
  const session = readSession();
  if (!session) return null;
  if (session.expiresAt - 60_000 > Date.now()) return { session, updated: false };
  if (!session.refreshToken) return null;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: session.refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    session: {
      ...session,
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
    },
    updated: true,
  };
}
