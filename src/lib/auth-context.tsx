'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  provider: string; // 'google' | 'demo'
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isDemo: boolean; // true when Google OAuth is not configured on the server
  signInWithGoogle: () => Promise<void>;
  signInDemo: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isDemo: true,
  signInWithGoogle: async () => {},
  signInDemo: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const DEMO_USER_KEY = 'yt_studio_demo_user';

const DEMO_USER: UserProfile = {
  id: 'demo-user-001',
  email: 'creator@youtube-ai-studio.com',
  fullName: 'Créateur Pro',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  provider: 'demo'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleConfigured, setGoogleConfigured] = useState(true);

  // ── Boot: check existing Google session (HTTP-only cookie) ──
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        setGoogleConfigured(Boolean(data.googleConfigured));
        if (data.user) {
          localStorage.removeItem(DEMO_USER_KEY);
          setUser(data.user);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Auth init error:', e);
      }

      // Fallback: demo session
      const stored = localStorage.getItem(DEMO_USER_KEY);
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch {}
      }
      setIsLoading(false);
    };
    init();
  }, []);

  // ── Sign in with Google (server-side OAuth 2.0 + YouTube scopes) ──
  const signInWithGoogle = useCallback(async () => {
    if (!googleConfigured) {
      alert(
        "La connexion Google n'est pas encore configurée.\n\n" +
        "Ajoutez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans les variables d'environnement Netlify.\n\n" +
        'En attendant, utilisez le mode Démo pour tester la plateforme.'
      );
      return;
    }
    const returnTo = window.location.pathname.startsWith('/login') ? '/' : window.location.pathname;
    window.location.href = `/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
  }, [googleConfigured]);

  // ── Demo mode ──
  const signInDemo = useCallback(() => {
    setUser(DEMO_USER);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(DEMO_USER));
  }, []);

  // ── Sign out ──
  const signOut = useCallback(async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    setUser(null);
    localStorage.removeItem(DEMO_USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isDemo: !googleConfigured,
      signInWithGoogle,
      signInDemo,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
