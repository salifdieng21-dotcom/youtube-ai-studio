'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Youtube, Sparkles, ShieldCheck, Zap, Video, Globe } from 'lucide-react';

export default function LoginPage() {
  const { signInWithGoogle, signInDemo, isDemo } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get('error');
    if (!err) return;
    const messages: Record<string, string> = {
      access_denied: "Vous avez refusé l'autorisation Google.",
      invalid_state: 'La session de connexion a expiré. Veuillez réessayer.',
      token_exchange_failed: "Échec de l'échange du code Google. Vérifiez l'URI de redirection dans Google Cloud Console.",
      userinfo_failed: 'Impossible de récupérer votre profil Google.',
      not_configured: "La connexion Google n'est pas configurée sur le serveur.",
    };
    setAuthError(messages[err] || `Erreur de connexion Google : ${err}`);
  }, []);

  return (
    <div className="min-h-screen bg-studio-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Ambient Background Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl animate-pulse pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-lg">
        
        {/* Logo & Branding */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-2xl shadow-violet-600/40 mb-4">
            <Youtube className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            YouTube <span className="text-violet-400">AI Studio</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Créez des chaînes YouTube, générez des vidéos réalistes avec l'IA et automatisez vos publications.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-studio-card border border-studio-border rounded-3xl p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-white">Connexion à votre Studio</h2>
            <p className="text-xs text-zinc-400">Connectez-vous avec Google pour accéder à toutes les fonctionnalités</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-xs text-red-300">{authError}</p>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-sm shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98] border border-zinc-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Se connecter avec Google
          </button>

          {/* Separator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo Mode Button */}
          <button
            onClick={signInDemo}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 hover:border-violet-400/50 text-violet-300 font-semibold text-sm transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            Tester en Mode Démo (sans compte Google)
          </button>

          {/* Note Supabase */}
          {isDemo && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-center">
              <p className="text-[11px] text-amber-400/80 leading-relaxed">
                💡 <strong>Mode hors-ligne :</strong> Google OAuth n'est pas configuré. Ajoutez <code className="text-amber-300">GOOGLE_CLIENT_ID</code> et <code className="text-amber-300">GOOGLE_CLIENT_SECRET</code> dans les variables d'environnement.
              </p>
            </div>
          )}

        </div>

        {/* Features Grid Below Login */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Video, label: 'Vidéos IA 4K', sub: 'Kling, Runway, Sora' },
            { icon: Globe, label: 'Publication Auto', sub: 'YouTube Data API' },
            { icon: ShieldCheck, label: 'OAuth Officiel', sub: 'Google Cloud' },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="text-center p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                <Icon className="w-5 h-5 text-violet-400 mx-auto" />
                <p className="text-[11px] font-bold text-white">{feat.label}</p>
                <p className="text-[10px] text-zinc-500">{feat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-600 mt-6">
          En vous connectant, vous acceptez les conditions d'utilisation.
          <br />
          © 2026 YouTube AI Studio • Google OAuth 2.0 & YouTube Data API v3
        </p>

      </div>
    </div>
  );
}
