'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Video, 
  Send, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { VideoProject, Channel } from '@/types';
import { StudioStorage } from '@/lib/storage';

export default function CalendarPage() {
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [selectedVideoDetails, setSelectedVideoDetails] = useState<VideoProject | null>(null);

  useEffect(() => {
    setVideos(StudioStorage.getVideos());
    setChannels(StudioStorage.getChannels());
  }, []);

  const filteredVideos = videos.filter(v => 
    selectedChannelFilter === 'all' ? true : v.channelId === selectedChannelFilter
  );

  // November 2026 calendar days simulation
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-violet-400" />
            Calendrier des Sorties YouTube
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Visualisez et gérez le planning de publication de vos chaînes en un coup d’œil.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Channel Filter */}
          <div className="flex items-center gap-2 bg-studio-surface px-3 py-1.5 rounded-xl border border-studio-border text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedChannelFilter}
              onChange={(e) => setSelectedChannelFilter(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none"
            >
              <option value="all">Toutes les chaînes</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Programmer
          </Link>
        </div>
      </div>

      {/* Calendar Month Navigation Header */}
      <div className="glass-panel p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Novembre 2026
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1.5 rounded-xl bg-white/5 text-xs font-semibold text-zinc-300">
              Aujourd’hui
            </button>
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-400 pb-2 border-b border-white/5">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid (Days 1 to 30) */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            // Find videos scheduled or published on this day
            const dayVideos = filteredVideos.filter((v) => {
              const dateStr = v.scheduledAt || v.publishedAt;
              if (!dateStr) return false;
              const date = new Date(dateStr);
              return date.getDate() === day;
            });

            const isToday = day === 2; // Nov 2, 2026

            return (
              <div
                key={day}
                className={`min-h-[110px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                  isToday 
                    ? 'bg-violet-950/20 border-violet-500/50 ring-1 ring-violet-500/30' 
                    : 'bg-studio-surface/50 border-white/5 hover:border-violet-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-lg ${
                    isToday ? 'bg-violet-600 text-white' : 'text-zinc-400'
                  }`}>
                    {day}
                  </span>
                  {dayVideos.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  )}
                </div>

                {/* Video Event Pills */}
                <div className="space-y-1.5 my-1 overflow-hidden">
                  {dayVideos.map((vid) => {
                    const isPublished = vid.status === 'published';
                    return (
                      <button
                        key={vid.id}
                        onClick={() => setSelectedVideoDetails(vid)}
                        className={`w-full text-left p-1.5 rounded-xl text-[10px] font-semibold truncate flex items-center gap-1.5 border transition-all ${
                          isPublished
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-violet-500/15 text-violet-200 border-violet-500/30 hover:bg-violet-500/25'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-violet-400'}`} />
                        <span className="truncate">{vid.title}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] text-zinc-600 text-right font-mono">
                  {dayVideos.length > 0 ? `${dayVideos.length} sortie(s)` : ''}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Video Details Modal on click */}
      {selectedVideoDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-studio-card border border-studio-border p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Détails de la Vidéo</span>
              <button onClick={() => setSelectedVideoDetails(null)} className="text-zinc-500 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
              <img src={selectedVideoDetails.thumbnail?.bgImageUrl} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">{selectedVideoDetails.title}</h3>
              <p className="text-xs text-zinc-400 line-clamp-3">{selectedVideoDetails.description}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Format :</span>
                <span className="text-white font-semibold">{selectedVideoDetails.format === 'short' ? 'YouTube Short (9:16)' : '16:9 Long'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Statut :</span>
                <span className="text-emerald-400 font-semibold capitalize">{selectedVideoDetails.status}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Date prévue :</span>
                <span className="text-violet-300 font-mono">
                  {new Date(selectedVideoDetails.scheduledAt || selectedVideoDetails.publishedAt || '').toLocaleString('fr-FR')}
                </span>
              </div>
            </div>

            {selectedVideoDetails.youtubeUrl && (
              <a
                href={selectedVideoDetails.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
              >
                Voir sur YouTube <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
