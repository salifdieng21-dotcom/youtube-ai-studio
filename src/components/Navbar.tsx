'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Youtube, 
  Sparkles, 
  Coins, 
  Plus, 
  ChevronDown, 
  Layers, 
  Video, 
  Calendar, 
  Zap, 
  Tv,
  CheckCircle2,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { StudioStorage } from '@/lib/storage';
import { Channel, UserCredits } from '@/types';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, isDemo } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [credits, setCredits] = useState<UserCredits>({ balance: 500, plan: 'pro', monthlyQuota: 500, totalGenerated: 0 });
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);

  useEffect(() => {
    const loadedChannels = StudioStorage.getChannels();
    setChannels(loadedChannels);
    if (loadedChannels.length > 0) {
      setActiveChannel(loadedChannels[0]);
    }
    setCredits(StudioStorage.getCredits());
  }, []);

  const handleAddCredits = (amount: number) => {
    const updated = StudioStorage.addCredits(amount);
    setCredits({ ...updated });
    setIsRechargeModalOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Tableau de bord', icon: Layers },
    { href: '/create', label: 'Générateur Vidéo IA', icon: Video },
    { href: '/channels', label: 'Mes Chaînes', icon: Tv },
    { href: '/autopilot', label: 'Pilote Automatique', icon: Zap },
    { href: '/calendar', label: 'Calendrier', icon: Calendar },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-studio-border bg-studio-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight flex items-center gap-1.5">
                  YouTube <span className="text-violet-400">AI Studio</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">PRO</span>
                </span>
                <span className="text-[11px] text-zinc-400 -mt-1">Automatisation & Génération de Chaînes</span>
              </div>
            </Link>

            {/* Main Navigation (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-violet-600/15 text-violet-300 border border-violet-500/30 shadow-sm' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-zinc-400'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Area: Channel Switcher, Credits & User Profile */}
          <div className="flex items-center gap-3">
            
            {/* Active Channel Selector Dropdown */}
            {activeChannel && (
              <div className="relative">
                <button
                  onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-studio-surface border border-studio-border hover:border-violet-500/40 text-xs text-zinc-200 transition-all"
                >
                  <img 
                    src={activeChannel.avatarUrl} 
                    alt={activeChannel.name} 
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-violet-500/50" 
                  />
                  <span className="font-medium max-w-[120px] truncate">{activeChannel.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {isChannelDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-studio-card border border-studio-border shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/5">
                      Mes Chaînes Connectées
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {channels.map((chan) => (
                        <button
                          key={chan.id}
                          onClick={() => {
                            setActiveChannel(chan);
                            setIsChannelDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                            activeChannel.id === chan.id ? 'bg-violet-600/20 text-violet-300' : 'hover:bg-white/5 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <img src={chan.avatarUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
                            <div className="truncate">
                              <p className="font-medium truncate">{chan.name}</p>
                              <p className="text-[10px] text-zinc-500">{chan.handle}</p>
                            </div>
                          </div>
                          {activeChannel.id === chan.id && (
                            <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <Link
                      href="/channels"
                      onClick={() => setIsChannelDropdownOpen(false)}
                      className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-violet-600/20 text-xs font-medium text-violet-300 border border-violet-500/20 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Créer une nouvelle chaîne
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* AI Credits Badge */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRechargeModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-950/40 border border-violet-500/30 hover:border-violet-400/60 transition-all group"
              >
                <Coins className="w-4 h-4 text-violet-400 group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-semibold text-violet-200">
                  {credits.balance} <span className="text-[11px] text-violet-400/80 font-normal">crédits</span>
                </span>
                <span className="w-5 h-5 rounded-lg bg-violet-600/40 text-violet-300 flex items-center justify-center text-xs group-hover:bg-violet-600 transition-colors">
                  +
                </span>
              </button>
            </div>

            {/* Fast Generate CTA */}
            <Link
              href="/create"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Créer
            </Link>

            {/* Google / User Profile & Logout */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-1.5 rounded-xl bg-studio-surface border border-studio-border hover:border-violet-500/40 text-xs text-zinc-200 transition-all"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}
                    alt={user.fullName || user.email}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-violet-500"
                  />
                  <span className="hidden lg:inline text-xs font-medium max-w-[100px] truncate">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-studio-card border border-studio-border shadow-2xl p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-white/5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white truncate">{user.fullName || 'Compte Créateur'}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">
                          {user.provider === 'google' ? 'Google' : 'Demo'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={async () => {
                          setIsUserDropdownOpen(false);
                          await signOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-violet-400" />
                Connexion
              </Link>
            )}

          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-white/5 py-2 px-2 bg-studio-dark/95">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium ${
                  isActive ? 'text-violet-400' : 'text-zinc-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Credits Recharge Modal */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-studio-card border border-studio-border p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Recharger des crédits IA</h3>
                  <p className="text-xs text-zinc-400">1 crédit = 1 génération de scène ou voix off</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRechargeModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { credits: 250, price: '19 €', popular: false, bonus: '' },
                { credits: 750, price: '49 €', popular: true, bonus: '+150 offerts' },
                { credits: 2500, price: '129 €', popular: false, bonus: 'Pack Agence' },
              ].map((pack, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddCredits(pack.credits)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    pack.popular 
                      ? 'bg-violet-600/10 border-violet-500/50 hover:bg-violet-600/20 ring-1 ring-violet-500/30' 
                      : 'bg-white/5 border-white/10 hover:border-violet-500/30'
                  }`}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{pack.credits} Crédits</span>
                      {pack.bonus && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold">
                          {pack.bonus}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400">Production instantanée & sans limite</span>
                  </div>
                  <span className="text-base font-extrabold text-violet-400">{pack.price}</span>
                </button>
              ))}
            </div>

            <p className="text-center text-[11px] text-zinc-500">
              Paiement sécurisé via Stripe. Facture et TVA disponibles.
            </p>
          </div>
        </div>
      )}
    </>
  );
}