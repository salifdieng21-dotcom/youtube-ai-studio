'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      if (supabase) {
        // Supabase handles the hash fragment automatically
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
        }

        if (session) {
          // Ensure the profile row exists in the profiles table
          try {
            await supabase.from('profiles').upsert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
            }, { onConflict: 'id' });
          } catch (e) {
            console.error('Profile upsert error:', e);
          }
        }
      }

      // Redirect to dashboard
      router.replace('/');
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-studio-dark">
      <div className="text-center space-y-4 animate-pulse">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-600/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-violet-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-sm text-zinc-400 font-medium">Connexion Google en cours...</p>
        <p className="text-xs text-zinc-500">Vous allez être redirigé vers le tableau de bord.</p>
      </div>
    </div>
  );
}
