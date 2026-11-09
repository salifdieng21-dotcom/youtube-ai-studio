'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
  isDemo: boolean; // true when Supabase is not configured
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

  const supabaseConfigured = isSupabaseConfigured();

  // ── Boot: check existing session ──
  useEffect(() => {
    const init = async () => {
      // 1. Try Supabase session first
      if (supabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Utilisateur',
              avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
              provider: 'google'
            });
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Supabase auth init error:', e);
        }
      }

      // 2. Fallback: check demo session in localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(DEMO_USER_KEY);
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {}
        }
      }

      setIsLoading(false);
    };

    init();

    // Listen for Supabase auth state changes
    if (supabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Utilisateur',
            avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
            provider: 'google'
          };
          setUser(profile);
        } else {
          // Only clear if supabase event, keep demo user
          const stored = typeof window !== 'undefined' ? localStorage.getItem(DEMO_USER_KEY) : null;
          if (!stored) {
            setUser(null);
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [supabaseConfigured]);

  // ── Sign in with Google via Supabase ──
  const signInWithGoogle = useCallback(async () => {
    if (!supabaseConfigured || !supabase) {
      alert(
        'Supabase n\'est pas configuré.\n\n' +
        'Pour activer la connexion Google :\n' +
        '1. Créez un projet sur https://supabase.com\n' +
        '2. Activez le provider Google dans Authentication > Providers\n' +
        '3. Ajoutez vos clés dans .env.local\n\n' +
        'En attendant, utilisez le mode Démo pour tester la plateforme.'
      );
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'openid email profile https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly'
      }
    });

    if (error) {
      console.error('Google sign-in error:', error);
      alert(`Erreur de connexion Google : ${error.message}`);
    }
  }, [supabaseConfigured]);

  // ── Sign in with Demo mode (no Supabase needed) ──
  const signInDemo = useCallback(() => {
    setUser(DEMO_USER);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(DEMO_USER));
    }
  }, []);

  // ── Sign out ──
  const signOut = useCallback(async () => {
    if (supabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY);
    }
  }, [supabaseConfigured]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isDemo: !supabaseConfigured,
      signInWithGoogle,
      signInDemo,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
