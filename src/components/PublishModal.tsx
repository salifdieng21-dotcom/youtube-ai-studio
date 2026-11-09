'use client';

import React, { useState } from 'react';
import { 
  Youtube, 
  Send, 
  Calendar, 
  Clock, 
  Lock, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoProject, Channel } from '@/types';
import { YouTubeClient } from '@/lib/youtube-client';
import { StudioStorage } from '@/lib/storage';

interface PublishModalProps {
  video: VideoProject;
  channels: Channel[];
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (updatedVideo: VideoProject) => void;
}

export default function PublishModal({ video, channels, isOpen, onClose, onPublished }: PublishModalProps) {
  if (!isOpen) return null;

  const [selectedChannelId, setSelectedChannelId] = useState<string>(
    video.channelId || (channels[0]?.id || '')
  );
  const [publishType, setPublishType] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-11-04');
  const [scheduledTime, setScheduledTime] = useState<string>('18:00');
  const [privacy, setPrivacy] = useState<'public' | 'unlisted' | 'private'>('public');

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string>('');

  const activeChannel = channels.find(c => c.id === selectedChannelId) || channels[0];

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const scheduledIso = publishType === 'schedule' 
        ? new Date(`${scheduledDate}T${scheduledTime}:00Z`).toISOString() 
        : undefined;

      // Call YouTube API Service
      const result = await YouTubeClient.publishVideo(
        activeChannel?.isConnected ? 'MOCK_TOKEN' : '',
        {
          title: video.title,
          description: video.description,
          tags: video.tags,
          privacyStatus: privacy,
          publishAt: scheduledIso
        },
        video.thumbnail?.bgImageUrl
      );

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      // Update video in Storage
      const updated: VideoProject = {
        ...video,
        status: publishType === 'schedule' ? 'scheduled' : 'published',
        channelId: selectedChannelId,
        youtubeUrl: result.url,
        youtubeVideoId: result.youtubeId,
        scheduledAt: scheduledIso,
        publishedAt: publishType === 'now' ? new Date().toISOString() : undefined
      };

      StudioStorage.saveVideo(updated);
      setPublishedUrl(result.url);
      setPublishSuccess(true);
      if (onPublished) onPublished(updated);

    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-studio-card border border-studio-border p-6 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
              <Youtube className="w-6 h-6 fill-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Publication sur YouTube</h3>
              <p className="text-xs text-zinc-400">Google OAuth & YouTube Data API v3</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {!publishSuccess ? (
          <div className="space-y-4">
            
            {/* Target Channel Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Chaîne YouTube cible</label>
              <select
                value={selectedChannelId}
                onChange={(e) => setSelectedChannelId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-studio-surface border border-studio-border text-sm text-white focus:outline-none focus:border-violet-500"
              >
                {channels.map((chan) => (
                  <option key={chan.id} value={chan.id}>
                    {chan.name} ({chan.handle}) - {chan.isConnected ? '✓ Connectée' : '⚠️ Non liée'}
                  </option>
                ))}
              </select>
            </div>

            {/* Publication Mode Toggle (Now vs Schedule) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPublishType('now')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  publishType === 'now'
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'bg-studio-surface border-studio-border text-zinc-400 hover:text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                Publier Immédiatement
              </button>

              <button
                type="button"
                onClick={() => setPublishType('schedule')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  publishType === 'schedule'
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'bg-studio-surface border-studio-border text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Programmer la Vidéo
              </button>
            </div>

            {/* Date & Time Picker when scheduled */}
            {publishType === 'schedule' && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 animate-in fade-in">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-violet-400" />
                    Date de publication
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-studio-surface border border-studio-border text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-violet-400" />
                    Heure (Optimale)
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-studio-surface border border-studio-border text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* Privacy Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Visibilité sur YouTube</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'public', label: 'Public', icon: Globe },
                  { id: 'unlisted', label: 'Non répertorié', icon: AlertCircle },
                  { id: 'private', label: 'Privé', icon: Lock },
                ].map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPrivacy(p.id as any)}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        privacy === p.id 
                          ? 'bg-violet-600/20 border-violet-500 text-violet-300' 
                          : 'bg-studio-surface border-studio-border text-zinc-400'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Summary Card */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <img
                src={video.thumbnail?.bgImageUrl}
                alt=""
                className="w-16 h-10 rounded-lg object-cover ring-1 ring-violet-500/30 shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{video.title}</p>
                <p className="text-[11px] text-zinc-400">
                  {video.format === 'short' ? '⚡ YouTube Short' : '🎥 Format Long 16:9'} • {video.scenes.length} scènes
                </p>
              </div>
            </div>

            {/* Confirm Publish CTA */}
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <Youtube className="w-4 h-4 fill-white" />
              {isPublishing 
                ? 'Publication en cours sur YouTube...' 
                : publishType === 'now' ? 'Confirmer la Publication Immédiate' : 'Confirmer la Programmation'}
            </button>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">Vidéo Traitée avec Succès !</h4>
              <p className="text-xs text-zinc-400">
                {publishType === 'now' 
                  ? 'La vidéo a été envoyée sur votre chaîne YouTube et est en cours de traitement par les serveurs Google.'
                  : `La vidéo a été programmée pour le ${scheduledDate} à ${scheduledTime}.`}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-studio-surface border border-studio-border flex items-center justify-between text-xs font-mono text-violet-300">
              <span className="truncate">{publishedUrl}</span>
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-white hover:text-violet-400 transition-colors ml-2"
              >
                Ouvrir <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              Fermer et Retourner au Studio
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
