'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Tv, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Zap, 
  Trash2, 
  Eye, 
  Users, 
  Video, 
  Wand2, 
  Globe,
  Youtube
} from 'lucide-react';
import { Channel, NicheType } from '@/types';
import { NICHES, CURATED_STOCK_IMAGES } from '@/lib/constants';
import { StudioStorage } from '@/lib/storage';
import { AIGeneratorService, ChannelGenerationResult } from '@/lib/ai-generator';
import { useAuth } from '@/lib/auth-context';

export default function ChannelsPage() {
  const { user, signInWithGoogle } = useAuth();
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Channel Creation State
  const [niche, setNiche] = useState<NicheType>('motivation');
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<ChannelGenerationResult | null>(null);
  const [channelName, setChannelName] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  useEffect(() => {
    setChannels(StudioStorage.getChannels());
  }, []);

  // AI Channel Generator
  const handleGenerateAIProfile = async () => {
    setIsGeneratingProfile(true);
    try {
      const res = await AIGeneratorService.generateChannelProfile(niche);
      setGeneratedProfile(res);
      setChannelName(res.selectedName);
      setHandle(res.handle);
      setDescription(res.description);
      setAvatarUrl(res.avatarUrl);
      setBannerUrl(res.bannerUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  const handleSaveChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;

    const newChan: Channel = {
      id: `chan-${Date.now()}`,
      name: channelName,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      niche,
      description,
      avatarUrl: avatarUrl || CURATED_STOCK_IMAGES[niche][0],
      bannerUrl: bannerUrl || CURATED_STOCK_IMAGES[niche][1],
      isConnected: false,
      subscribersCount: 0,
      viewsCount: 0,
      videosCount: 0,
      autoPilotEnabled: true,
      createdAt: new Date().toISOString()
    };

    StudioStorage.saveChannel(newChan);
    setChannels(StudioStorage.getChannels());
    setIsModalOpen(false);
    setGeneratedProfile(null);
  };

  const handleToggleAutopilot = (chan: Channel) => {
    const updated = { ...chan, autoPilotEnabled: !chan.autoPilotEnabled };
    StudioStorage.saveChannel(updated);
    setChannels(StudioStorage.getChannels());
  };

  const handleDeleteChannel = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette chaîne du studio ?')) {
      StudioStorage.deleteChannel(id);
      setChannels(StudioStorage.getChannels());
    }
  };

  const handleConnectGoogle = async (chan: Channel) => {
    // Demo mode: simulated link
    if (user?.provider !== 'google') {
      if (confirm("Mode Démo : la liaison sera simulée.\n\nVoulez-vous plutôt vous connecter avec Google pour lier une vraie chaîne YouTube ?")) {
        await signInWithGoogle();
        return;
      }
      const updated = { ...chan, isConnected: true, youtubeChannelId: `UC_${Math.random().toString(36).substring(2, 10)}` };
      StudioStorage.saveChannel(updated);
      setChannels(StudioStorage.getChannels());
      return;
    }

    setLinkingId(chan.id);
    try {
      const res = await fetch('/api/youtube/channels', { cache: 'no-store' });
      const data = await res.json();
      if (res.status === 401) {
        await signInWithGoogle();
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Erreur YouTube API');

      const ytChannels: Array<{ id: string; title: string; handle?: string; thumbnail?: string; subscribers: number; views: number; videos: number }> = data.channels || [];
      if (ytChannels.length === 0) {
        alert("Aucune chaîne YouTube n'est associée à ce compte Google. Créez d'abord une chaîne sur youtube.com.");
        return;
      }

      let selected = ytChannels[0];
      if (ytChannels.length > 1) {
        const choice = prompt(
          'Choisissez la chaîne YouTube à lier (numéro) :\n' +
          ytChannels.map((c, i) => `${i + 1}. ${c.title} ${c.handle ? `(${c.handle})` : ''}`).join('\n'),
          '1'
        );
        const idx = Number(choice) - 1;
        if (!ytChannels[idx]) return;
        selected = ytChannels[idx];
      }

      const updated: Channel = {
        ...chan,
        isConnected: true,
        youtubeChannelId: selected.id,
        subscribersCount: selected.subscribers,
        viewsCount: selected.views,
        videosCount: selected.videos,
        avatarUrl: selected.thumbnail || chan.avatarUrl,
      };
      StudioStorage.saveChannel(updated);
      setChannels(StudioStorage.getChannels());
    } catch (err: any) {
      alert(`Impossible de lier la chaîne YouTube : ${err.message}`);
    } finally {
      setLinkingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Tv className="w-7 h-7 text-violet-400" />
            Gestion des Chaînes YouTube
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Créez des chaînes configurées par l’IA, connectez plusieurs comptes Google et activez le pilote automatique.
          </p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            handleGenerateAIProfile();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Créer une Chaîne avec l’IA
        </button>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((chan) => (
          <div
            key={chan.id}
            className="glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col justify-between border border-studio-border shadow-xl"
          >
            <div>
              {/* Banner */}
              <div className="relative h-28 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={chan.bannerUrl}
                  alt={chan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-studio-card via-black/30 to-transparent" />
                
                {/* Niche Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-violet-300 capitalize">
                  {chan.niche}
                </div>
              </div>

              {/* Avatar & Channel Details */}
              <div className="p-5 pt-0 -mt-8 relative space-y-3">
                <div className="flex items-end justify-between">
                  <img
                    src={chan.avatarUrl}
                    alt={chan.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-studio-card shadow-lg"
                  />

                  {/* Connect Button Status */}
                  {chan.isConnected ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Liée à YouTube
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConnectGoogle(chan)}
                      disabled={linkingId === chan.id}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-400 text-xs font-semibold border border-red-500/30 transition-colors"
                    >
                      <Youtube className="w-3.5 h-3.5 fill-red-400" />
                      {linkingId === chan.id ? 'Liaison...' : 'Lier YouTube OAuth'}
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    {chan.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">{chan.handle}</p>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {chan.description}
                </p>

                {/* Metrics Stats */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div>
                    <p className="text-xs font-bold text-white">{chan.subscribersCount.toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-500">Abonnés</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{chan.videosCount}</p>
                    <p className="text-[10px] text-zinc-500">Vidéos</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{(chan.viewsCount / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-zinc-500">Vues</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-5 pt-3 border-t border-white/5 flex items-center justify-between">
              
              {/* Autopilot Toggle */}
              <button
                onClick={() => handleToggleAutopilot(chan)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                  chan.autoPilotEnabled 
                    ? 'text-violet-400 bg-violet-500/10' 
                    : 'text-zinc-500 hover:text-zinc-400 bg-white/5'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${chan.autoPilotEnabled ? 'fill-violet-400' : ''}`} />
                {chan.autoPilotEnabled ? 'Autopilote Actif' : 'Autopilote Inactif'}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href="/create"
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all"
                >
                  Créer Vidéo
                </Link>

                <button
                  onClick={() => handleDeleteChannel(chan.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Supprimer la chaîne"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Modal: AI Channel Creator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-studio-card border border-studio-border p-6 shadow-2xl space-y-6 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Générateur de Chaîne YouTube IA</h3>
                  <p className="text-xs text-zinc-400">Génération automatique du branding, nom, logo et bannière</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveChannel} className="space-y-4">
              
              {/* Niche Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">1. Choisissez votre niche YouTube</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {NICHES.slice(0, 6).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setNiche(n.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                        niche === n.id
                          ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                          : 'bg-studio-surface border-studio-border text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{n.emoji}</span>
                      <span className="truncate">{n.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Profile CTA */}
              <button
                type="button"
                onClick={handleGenerateAIProfile}
                disabled={isGeneratingProfile}
                className="w-full py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {isGeneratingProfile ? 'Génération IA en cours...' : 'Régénérer les Idées de Noms & Branding'}
              </button>

              {/* Generated Name Alternatives */}
              {generatedProfile && generatedProfile.names.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Suggestions de noms viraux :</label>
                  <div className="flex flex-wrap gap-2">
                    {generatedProfile.names.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setChannelName(n);
                          setHandle(`@${n.replace(/[\s&’']/g, '')}Officiel`);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          channelName === n 
                            ? 'bg-violet-600 text-white border-violet-500' 
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:border-violet-500/50'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name & Handle Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Nom de la chaîne</label>
                  <input
                    type="text"
                    required
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Identifiant (@handle)</label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Description Professionnelle & SEO</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-xs text-white resize-none"
                />
              </div>

              {/* Avatar & Banner Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Logo généré par l'IA</label>
                  <img src={avatarUrl || CURATED_STOCK_IMAGES[niche][0]} alt="" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Bannière générée par l'IA</label>
                  <img src={bannerUrl || CURATED_STOCK_IMAGES[niche][1]} alt="" className="w-full h-16 rounded-xl object-cover ring-2 ring-violet-500/30" />
                </div>
              </div>

              {/* Confirm Creation */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={!channelName.trim()}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 transition-all hover:scale-[1.01]"
                >
                  Sauvegarder et Activer la Chaîne
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
