'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import LoginPage from '@/app/login/page';

// Pages that don't require authentication
const PUBLIC_PATHS = ['/login'];

function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  // Public paths bypass the gate
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return <>{children}</>;
  }

  // Loading spinner while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-studio-dark">
        <div className="text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-600/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-violet-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-xs text-zinc-400">Chargement du Studio...</p>
        </div>
      </div>
    );
  }

  // Not logged in → show the login page
  if (!user) {
    return <LoginPage />;
  }

  // Logged in → render the app shell with Navbar
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-studio-border py-8 bg-studio-card/40 mt-16 text-center text-xs text-zinc-500 space-y-2">
        <p className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Connecté en tant que <strong className="text-zinc-300">{user.email}</strong> via {user.provider === 'google' ? 'Google OAuth' : 'Mode Démo'}
        </p>
        <p>© 2026 YouTube AI Studio. Plateforme autonome de création et d'automatisation vidéo.</p>
      </footer>
    </div>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
