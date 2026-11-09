'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sliders, 
  RotateCw, 
  Tv, 
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Channel, AutopilotConfig, VideoProject } from '@/types';
import { StudioStorage } from '@/lib/storage';
import { AIGeneratorService } from '@/lib/ai-generator';
import { VOICE_PRESETS, MUSIC_TRACKS } from '@/lib/constants';

export default function AutopilotPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('');
  const [configs, setConfigs] = useState<AutopilotConfig[]>([]);

  // Current Config Form
  const [videosPerWeek, setVideosPerWeek] = useState<number>(3);
  const [publishTime, setPublishTime] = useState<string>('18:00');
  const [format, setFormat] = useState<'long' | 'short'>('short');
  const [autoApprove, setAutoApprove] = useState<boolean>(true);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  // Live Runner State
  const [isRunningCycle, setIsRunningCycle] = useState<boolean>(false);
  const [cycleStep, setCycleStep] = useState<string>('');
  const [cycleProgress, setCycleProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    'Agent Autopilote initialisé et en veille.',
    'Surveillance des tendances YouTube activée.'
  ]);

  useEffect(() => {
    const loadedChannels = StudioStorage.getChannels();
    const loadedConfigs = StudioStorage.getAutopilotConfigs();
    setChannels(loadedChannels);
    setConfigs(loadedConfigs);

    if (loadedChannels.length > 0) {
      const firstId = loadedChannels[0].id;
      setActiveChannelId(firstId);
      const conf = loadedConfigs.find(c => c.channelId === firstId);
      if (conf) {
        setVideosPerWeek(conf.videosPerWeek);
        setPublishTime(conf.publishTime);
        setFormat(conf.format);
        setAutoApprove(conf.autoApprove);
        setIsEnabled(conf.enabled);
      }
    }
  }, []);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const activeConfig = configs.find(c => c.channelId === activeChannelId);

  // Save updated config
  const handleSaveConfig = () => {
    if (!activeChannel) return;

    const updated: AutopilotConfig = {
      id: activeConfig?.id || `auto-${Date.now()}`,
      channelId: activeChannel.id,
      niche: activeChannel.niche,
      format,
      videosPerWeek,
      publishTime,
      preferredDays: [1, 3, 5],
      autoApprove,
      includeShorts: format === 'short',
      enabled: isEnabled,
      lastGeneratedAt: activeConfig?.lastGeneratedAt,
      nextScheduledAt: '2026-11-04T18:00:00Z',
      queue: activeConfig?.queue || [
        { topic: 'La psychologie cachée de la productivité extrême', targetDate: '2026-11-04', status: 'queued' },
        { topic: 'Pourquoi les méthodes traditionnelles échouent toujours', targetDate: '2026-11-06', status: 'queued' }
      ]
    };

    StudioStorage.saveAutopilotConfig(updated);
    setConfigs(StudioStorage.getAutopilotConfigs());
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] Configuration mise à jour pour ${activeChannel.name}`, ...prev]);
  };

  // Trigger one Autonomous AI cycle immediately
  const handleTriggerCycleNow = async () => {
    if (!activeChannel) return;

    setIsRunningCycle(true);
    setCycleProgress(10);
    setCycleStep(`Recherche autonome de tendances virales en ${activeChannel.niche}...`);

    try {
      await new Promise(r => setTimeout(r, 800));
      setCycleProgress(30);
      const chosenTopic = `Les secrets méconnus du succès en ${activeChannel.niche}`;
      setCycleStep(`Sujet retenu : « ${chosenTopic} »`);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] Sujet sélectionné : ${chosenTopic}`, ...prev]);

      await new Promise(r => setTimeout(r, 900));
      setCycleProgress(60);
      setCycleStep('Génération automatique du script, voix off et sous-titres...');

      const script = await AIGeneratorService.generateScript(
        chosenTopic,
        activeChannel.niche,
        format,
        format === 'short' ? 1 : 4
      );

      setCycleProgress(85);
      setCycleStep('Génération de la miniature IA et calcul de la date de publication...');
      const thumb = AIGeneratorService.generateThumbnailConfig(script.title, activeChannel.niche);

      await new Promise(r => setTimeout(r, 600));
      setCycleProgress(100);
      setCycleStep('Vidéo programmée et ajoutée au calendrier YouTube !');

      const targetIso = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

      const newVideo: VideoProject = {
        id: `vid-${Date.now()}`,
        title: script.title,
        description: script.description,
        tags: script.tags,
        niche: activeChannel.niche,
        format,
        targetDurationMinutes: format === 'short' ? 1 : 4,
        scenes: script.scenes,
        voiceSettings: VOICE_PRESETS[0],
        musicTrack: MUSIC_TRACKS[0],
        musicVolume: 0.35,
        subtitlesEnabled: true,
        subtitlesColor: '#facc15',
        thumbnail: thumb,
        status: 'scheduled',
        channelId: activeChannel.id,
        scheduledAt: targetIso,
        createdAt: new Date().toISOString()
      };

      StudioStorage.saveVideo(newVideo);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 🚀 Vidéo « ${newVideo.title} » créée et programmée avec succès.`, ...prev]);

      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}

    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningCycle(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-7 h-7 text-violet-400 fill-violet-400" />
            Mode Pilote Automatique (Autopilot)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Laissez l’IA créer et programmer vos vidéos de manière 100% autonome chaque semaine.
          </p>
        </div>

        <button
          onClick={handleTriggerCycleNow}
          disabled={isRunningCycle}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all hover:scale-105 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {isRunningCycle ? 'Cycle en cours...' : 'Déclencher un Cycle Immédiat'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Configuration Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl space-y-5">
            
            {/* Channel Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-violet-400" />
                Sélectionner la chaîne à automatiser
              </label>
              <select
                value={activeChannelId}
                onChange={(e) => setActiveChannelId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-studio-surface border border-studio-border text-sm text-white"
              >
                {channels.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.niche})
                  </option>
                ))}
              </select>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p className="text-sm font-bold text-white">Statut du Pilote Automatique</p>
                <p className="text-xs text-zinc-400">Activer la génération et programmation sans intervention</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEnabled(!isEnabled)}
                className={`w-14 h-8 rounded-full p-1 transition-colors ${
                  isEnabled ? 'bg-violet-600' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Weekly Frequency Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">Fréquence de production hebdomadaire</span>
                <span className="font-bold text-violet-400 text-sm">{videosPerWeek} vidéos / semaine</span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                value={videosPerWeek}
                onChange={(e) => setVideosPerWeek(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
                <span>1 vidéo (Tranquille)</span>
                <span>3 vidéos (Optimal)</span>
                <span>7 vidéos (Croissance Maximale)</span>
              </div>
            </div>

            {/* Format & Optimal Hour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Format automatique</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-xs text-white"
                >
                  <option value="short">YouTube Shorts (9:16) - Viralité rapide</option>
                  <option value="long">Vidéo Longue (16:9) - Fort engagement</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                  Heure de publication
                </label>
                <input
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-xs text-white"
                />
              </div>
            </div>

            {/* Auto-Approve Checkbox */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="autoApprove"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 accent-violet-600"
              />
              <label htmlFor="autoApprove" className="text-xs text-zinc-300 font-medium cursor-pointer">
                Publication 100% automatique sur YouTube sans validation manuelle requise
              </label>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition-all hover:scale-[1.01]"
              >
                Enregistrer la Configuration
              </button>
            </div>

          </div>

          {/* Running Cycle Progress Card */}
          {isRunningCycle && (
            <div className="glass-panel p-5 rounded-2xl space-y-3 animate-in fade-in bg-gradient-to-r from-violet-950/30 to-studio-card">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-violet-300 flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-violet-400" />
                  {cycleStep}
                </span>
                <span className="font-mono text-zinc-400">{cycleProgress}%</span>
              </div>
              <div className="w-full h-2 bg-studio-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-300"
                  style={{ width: `${cycleProgress}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Right: Upcoming Queue & Live Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upcoming Video Queue */}
          <div className="glass-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                File d’Attente des Sujets
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold">
                Planifié par l’IA
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { topic: 'La psychologie cachée de la productivité extrême', date: 'Mercredi 4 Nov - 18h00', status: 'ready' },
                { topic: 'Pourquoi 90% des méthodes échouent dès la 2e semaine', date: 'Vendredi 6 Nov - 18h00', status: 'queued' },
                { topic: 'Le rituel stoïcien des 3 questions du soir', date: 'Dimanche 8 Nov - 18h00', status: 'queued' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-violet-300 font-medium">{item.date}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-violet-600/20 text-violet-400">
                      {item.status === 'ready' ? 'Programmé' : 'En attente'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{item.topic}</p>
                </div>
              ))}
            </div>

            <Link
              href="/calendar"
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Voir le calendrier complet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Activity Logs Console */}
          <div className="glass-panel p-5 rounded-3xl space-y-3 font-mono">
            <h3 className="font-bold text-white text-xs font-sans flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Journal d’Activité de l’Agent IA
            </h3>

            <div className="p-3 rounded-2xl bg-black/60 border border-white/5 max-h-48 overflow-y-auto space-y-1.5 text-[11px] text-zinc-400">
              {logs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-zinc-600">&gt; </span>
                  <span className={idx === 0 ? 'text-violet-300 font-semibold' : ''}>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
