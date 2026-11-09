'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Tv, 
  Video, 
  Send, 
  Eye, 
  Users, 
  Sparkles, 
  Zap, 
  Plus, 
  Play, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Calendar as CalendarIcon
} from 'lucide-react';
import { StudioStorage } from '@/lib/storage';
import { Channel, VideoProject, AnalyticsSummary } from '@/types';
import PublishModal from '@/components/PublishModal';

export default function DashboardPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    totalChannels: 0,
    totalVideosCreated: 0,
    totalVideosPublished: 0,
    totalViews: 0,
    totalSubscribers: 0,
    avgWatchTimeMinutes: 0,
    creditsRemaining: 0
  });

  const [publishingVideo, setPublishingVideo] = useState<VideoProject | null>(null);

  useEffect(() => {
    setChannels(StudioStorage.getChannels());
    setVideos(StudioStorage.getVideos());
    setAnalytics(StudioStorage.getAnalyticsSummary());
  }, []);

  const handleVideoPublished = (updated: VideoProject) => {
    setVideos(prev => prev.map(v => v.id === updated.id ? updated : v));
    setAnalytics(StudioStorage.getAnalyticsSummary());
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950/40 via-studio-card to-studio-surface border border-studio-border p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Plateforme IA Autonome de Production YouTube
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Générez, Montez et Publiez vos Vidéos avec <span className="gradient-text">l’IA</span>
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Créez des chaînes YouTube complètes, transformez vos idées en vidéos virales avec voix off et sous-titres dynamiques, et automatisez vos publications.
            </p>
          </div>

          {/* Primary Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link
              href="/create"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Nouvelle Vidéo IA
            </Link>
            <Link
              href="/autopilot"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 font-semibold text-sm transition-all"
            >
              <Zap className="w-4 h-4 text-violet-400" />
              Mode Autopilote
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Key Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Chaînes Connectées',
            value: analytics.totalChannels,
            icon: Tv,
            change: '+1 ce mois',
            color: 'text-violet-400',
            bg: 'bg-violet-500/10'
          },
          {
            label: 'Vidéos Créées (IA)',
            value: analytics.totalVideosCreated,
            icon: Video,
            change: '100% automatisé',
            color: 'text-fuchsia-400',
            bg: 'bg-fuchsia-500/10'
          },
          {
            label: 'Vidéos Publiées',
            value: analytics.totalVideosPublished,
            icon: Send,
            change: 'Sur YouTube',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
          },
          {
            label: 'Vues Totales Estimées',
            value: (analytics.totalViews / 1000000).toFixed(1) + ' M',
            icon: Eye,
            change: '+24.5% cette semaine',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
                <div className={`w-8 h-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Publications & Channels & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Video Projects (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-violet-400" />
                Projets & Publications Récentes
              </h2>
              <p className="text-xs text-zinc-400">Gérez, prévisualisez et publiez vos créations vidéo</p>
            </div>
            <Link
              href="/create"
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              Créer <Plus className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {videos.map((vid) => {
              const channel = channels.find(c => c.id === vid.channelId);
              return (
                <div
                  key={vid.id}
                  className="glass-panel glass-panel-hover p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Meta */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-24 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 group">
                      <img
                        src={vid.thumbnail?.bgImageUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-bold text-white">
                        {vid.format === 'short' ? 'SHORT' : '16:9'}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate max-w-md">
                        {vid.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                        {channel && (
                          <span className="flex items-center gap-1 text-zinc-300">
                            <img src={channel.avatarUrl} className="w-3.5 h-3.5 rounded-full" alt="" />
                            {channel.name}
                          </span>
                        )}
                        <span>•</span>
                        <span className="text-zinc-500">{vid.scenes.length} scènes</span>
                        <span>•</span>
                        <span className="capitalize text-violet-400">{vid.niche}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    {/* Status Badge */}
                    <div>
                      {vid.status === 'published' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Publiée
                        </span>
                      )}
                      {vid.status === 'scheduled' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          Programmée
                        </span>
                      )}
                      {vid.status === 'draft' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-500/10 text-zinc-400 text-xs font-semibold border border-zinc-500/20">
                          Brouillon
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPublishingVideo(vid)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-semibold border border-violet-500/30 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        Publier
                      </button>

                      {vid.youtubeUrl && (
                        <a
                          href={vid.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                          title="Voir sur YouTube"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Channels & Growth (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Channels Card */}
          <div className="glass-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Tv className="w-4 h-4 text-violet-400" />
                Mes Chaînes YouTube
              </h3>
              <Link href="/channels" className="text-xs text-violet-400 hover:text-violet-300 font-semibold">
                Gérer
              </Link>
            </div>

            <div className="space-y-3">
              {channels.map((chan) => (
                <div key={chan.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={chan.avatarUrl} className="w-8 h-8 rounded-full object-cover ring-1 ring-violet-500/40" alt="" />
                      <div>
                        <p className="text-xs font-bold text-white">{chan.name}</p>
                        <p className="text-[10px] text-zinc-400">{chan.handle}</p>
                      </div>
                    </div>
                    {chan.autoPilotEnabled && (
                      <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold border border-violet-500/30 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-violet-300" /> Auto
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400 border-t border-white/5">
                    <span>{chan.subscribersCount.toLocaleString()} abonnés</span>
                    <span>{chan.videosCount} vidéos</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/channels"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 text-xs font-semibold text-violet-300 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Créer une Chaîne avec l’IA
            </Link>
          </div>

          {/* Autopilot Quick Status Card */}
          <div className="glass-panel p-5 rounded-3xl space-y-3 bg-gradient-to-br from-violet-950/20 to-studio-card">
            <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
              <Zap className="w-4 h-4 fill-violet-400" />
              Pilote Automatique Hebdomadaire
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              L’IA recherche automatiquement les tendances, génère les scripts, monte les vidéos et les programme selon votre calendrier.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-violet-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Prochaine sortie programmée</p>
                <p className="text-[11px] text-violet-300">Mercredi à 18h00</p>
              </div>
              <Link
                href="/autopilot"
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow transition-all"
              >
                Configurer
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Publish Modal Popup */}
      {publishingVideo && (
        <PublishModal
          video={publishingVideo}
          channels={channels}
          isOpen={true}
          onClose={() => setPublishingVideo(null)}
          onPublished={handleVideoPublished}
        />
      )}

    </div>
  );
}
