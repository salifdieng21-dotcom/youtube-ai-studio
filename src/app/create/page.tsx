'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Video, 
  Tv, 
  Smartphone, 
  Monitor, 
  Mic, 
  Music, 
  Send, 
  Wand2, 
  Eye, 
  Layers,
  Clock,
  Cpu,
  Sliders,
  CheckCircle2,
  Flame,
  Camera
} from 'lucide-react';
import { 
  NicheType, 
  VideoFormat, 
  VideoProject, 
  VoiceSettings, 
  MusicTrack, 
  Channel, 
  VideoEngineId, 
  RealismSettings 
} from '@/types';
import { 
  NICHES, 
  VOICE_PRESETS, 
  MUSIC_TRACKS, 
  AI_VIDEO_ENGINES, 
  DURATION_OPTIONS 
} from '@/lib/constants';
import { StudioStorage } from '@/lib/storage';
import { AIGeneratorService } from '@/lib/ai-generator';
import VideoPlayer from '@/components/VideoPlayer';
import ThumbnailEditor from '@/components/ThumbnailEditor';
import PublishModal from '@/components/PublishModal';

export default function CreateVideoPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');

  // Form State
  const [niche, setNiche] = useState<NicheType>('motivation');
  const [format, setFormat] = useState<VideoFormat>('short');
  const [targetSeconds, setTargetSeconds] = useState<number>(60);
  const [selectedEngine, setSelectedEngine] = useState<VideoEngineId>('kling-v15');
  const [topic, setTopic] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceSettings>(VOICE_PRESETS[0]);
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack>(MUSIC_TRACKS[0]);
  const [musicVolume, setMusicVolume] = useState<number>(0.3);

  // Realism advanced controls
  const [showRealismSettings, setShowRealismSettings] = useState<boolean>(false);
  const [realismSettings, setRealismSettings] = useState<RealismSettings>({
    lighting: 'cinematic',
    cameraMotion: 'smooth-tracking',
    lensType: 'anamorphic-35mm',
    renderResolution: '4k',
    frameRate: 60,
    depthOfField: true,
    colorGrading: 'teal-and-orange'
  });

  // Generation Pipeline State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  // Result Video Project
  const [generatedVideo, setGeneratedVideo] = useState<VideoProject | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'scenes' | 'thumbnail'>('preview');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const list = StudioStorage.getChannels();
    setChannels(list);
    if (list.length > 0) {
      setSelectedChannelId(list[0].id);
      setNiche(list[0].niche);
    }
  }, []);

  // Compute required credits based on duration and engine
  const computeCreditsCost = () => {
    const base = Math.max(15, Math.round((targetSeconds / 30) * 12));
    const isProEngine = selectedEngine === 'kling-v15' || selectedEngine === 'sora-turbo';
    return isProEngine ? base + 8 : base;
  };

  const creditsCost = computeCreditsCost();

  // Pick random viral topic suggestion from selected niche
  const pickRandomTopic = () => {
    const currentNiche = NICHES.find(n => n.id === niche);
    if (currentNiche && currentNiche.suggestedTopics.length > 0) {
      const random = currentNiche.suggestedTopics[Math.floor(Math.random() * currentNiche.suggestedTopics.length)];
      setTopic(random);
    }
  };

  // Launch Full AI Generation Pipeline
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    // Check Credits
    const hasCredits = StudioStorage.deductCredits(creditsCost);
    if (!hasCredits) {
      alert(`Solde de crédits insuffisant (${creditsCost} crédits requis). Veuillez recharger vos crédits.`);
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    const chosenEngineObj = AI_VIDEO_ENGINES.find(e => e.id === selectedEngine) || AI_VIDEO_ENGINES[0];
    setGenerationStep(`Initialisation du moteur vidéo ${chosenEngineObj.name}...`);

    try {
      await new Promise(r => setTimeout(r, 600));
      setProgress(25);
      setGenerationStep(`Génération du script cinématique pour durée cible (${targetSeconds}s)...`);

      const scriptResult = await AIGeneratorService.generateScript(
        topic,
        niche,
        format,
        targetSeconds,
        selectedEngine,
        realismSettings
      );

      setProgress(55);
      setGenerationStep(`Synthèse des scènes vidéo avec ${chosenEngineObj.name} (${chosenEngineObj.qualityTag})...`);
      await new Promise(r => setTimeout(r, 800));

      setProgress(80);
      setGenerationStep('Génération des sous-titres synchronisés et rendu de la voix off IA...');
      const thumbnailConfig = AIGeneratorService.generateThumbnailConfig(scriptResult.title, niche);
      await new Promise(r => setTimeout(r, 600));

      setProgress(100);
      setGenerationStep('Montage ultra-réaliste terminé avec succès !');

      const newVideo: VideoProject = {
        id: `vid-${Date.now()}`,
        title: scriptResult.title,
        description: scriptResult.description,
        tags: scriptResult.tags,
        niche,
        format,
        targetDurationMinutes: Math.ceil(targetSeconds / 60),
        targetDurationSeconds: targetSeconds,
        engine: selectedEngine,
        realismSettings,
        scenes: scriptResult.scenes,
        voiceSettings: selectedVoice,
        musicTrack: selectedMusic,
        musicVolume,
        subtitlesEnabled: true,
        subtitlesColor: '#facc15',
        thumbnail: thumbnailConfig,
        status: 'ready',
        channelId: selectedChannelId || (channels[0]?.id || 'chan-1'),
        createdAt: new Date().toISOString()
      };

      StudioStorage.saveVideo(newVideo);
      setGeneratedVideo(newVideo);
      setActiveTab('preview');

    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Générateur Vidéo IA Studio • Moteurs Phares 2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Génération Vidéo Réaliste <span className="text-violet-400">Kling AI & Cinéma</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Produisez des vidéos ultra-réalistes jusqu’à 3 minutes (180s) avec Kling AI, Runway Gen-3, Sora Turbo et Google Veo 2.
          </p>
        </div>

        {generatedVideo && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4 fill-white" />
              Publier sur YouTube
            </button>
          </div>
        )}
      </div>

      {/* Main Creation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="glass-panel p-6 rounded-3xl space-y-5">
            
            {/* 1. MOTEUR IA VIDÉO (Kling, Runway, Sora, etc.) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-violet-400" />
                  Moteur Vidéo IA Ultra-Réaliste
                </span>
                <span className="text-[10px] text-violet-400 uppercase font-bold tracking-wider">
                  Haute Définition
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {AI_VIDEO_ENGINES.map((eng) => {
                  const isSelected = selectedEngine === eng.id;
                  return (
                    <button
                      key={eng.id}
                      type="button"
                      onClick={() => setSelectedEngine(eng.id)}
                      className={`relative p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-violet-600/20 border-violet-500 ring-1 ring-violet-500/50 shadow-md shadow-violet-600/20'
                          : 'bg-studio-surface border-studio-border hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                          {eng.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold truncate">
                          {eng.badge}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-mono">
                          ★ {eng.realismScore}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. DURÉE DE LA VIDÉO (Jusqu'à 3 MINUTES / 180s) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                  Durée de la vidéo (Jusqu'à 3 min)
                </label>
                <span className="text-xs font-mono font-bold text-violet-300">
                  {targetSeconds} secondes ({Math.floor(targetSeconds / 60)}m {targetSeconds % 60 ? `${targetSeconds % 60}s` : ''})
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = targetSeconds === opt.seconds;
                  return (
                    <button
                      key={opt.seconds}
                      type="button"
                      onClick={() => setTargetSeconds(opt.seconds)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30'
                          : 'bg-studio-surface border-studio-border text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px] font-extrabold">{opt.label.split(' ')[0]}</div>
                      <div className="text-[9px] opacity-75">{opt.scenesCount} scènes</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Paramètres Réalisme Avancés (Cinéma, Caméra, Éclairage) */}
            <div className="border border-white/5 rounded-2xl bg-studio-surface/50 p-3 space-y-3">
              <button
                type="button"
                onClick={() => setShowRealismSettings(!showRealismSettings)}
                className="w-full flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-violet-400" />
                  Paramètres de Réalisme & Caméra
                </span>
                <span className="text-[11px] text-violet-400">
                  {showRealismSettings ? 'Masquer' : 'Ajuster (4K, 60fps)'}
                </span>
              </button>

              {showRealismSettings && (
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/5 text-xs animate-in fade-in">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Éclairage Cinématographique</label>
                    <select
                      value={realismSettings.lighting}
                      onChange={(e) => setRealismSettings({ ...realismSettings, lighting: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-[11px]"
                    >
                      <option value="cinematic">Cinématique 35mm</option>
                      <option value="golden-hour">Golden Hour (Coucher de soleil)</option>
                      <option value="dramatic-shadows">Ombres dramatiques / Noir</option>
                      <option value="studio-neon">Studio & Cyberpunk Néon</option>
                      <option value="natural-daylight">Lumière du jour naturelle</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Mouvement de Caméra</label>
                    <select
                      value={realismSettings.cameraMotion}
                      onChange={(e) => setRealismSettings({ ...realismSettings, cameraMotion: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-[11px]"
                    >
                      <option value="smooth-tracking">Travelling fluide (Tracking)</option>
                      <option value="drone-fpv">Vol de Drone FPV</option>
                      <option value="orbit-360">Orbite 360° immersive</option>
                      <option value="slow-push-in">Zoom lent avant (Push-in)</option>
                      <option value="handheld-dynamic">Caméra portée dynamique</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Objectif & Lentille</label>
                    <select
                      value={realismSettings.lensType}
                      onChange={(e) => setRealismSettings({ ...realismSettings, lensType: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-[11px]"
                    >
                      <option value="anamorphic-35mm">Anamorphique 35mm (Scope)</option>
                      <option value="master-prime-50mm">Master Prime 50mm (Portrait)</option>
                      <option value="wide-angle-24mm">Grand-angle 24mm</option>
                      <option value="telephoto-85mm">Téléobjectif 85mm</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Colorimétrie (LUT)</label>
                    <select
                      value={realismSettings.colorGrading}
                      onChange={(e) => setRealismSettings({ ...realismSettings, colorGrading: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-[11px]"
                    >
                      <option value="teal-and-orange">Teal & Orange (Hollywood)</option>
                      <option value="cinematic-warm">Chaud & Épique</option>
                      <option value="moody-film">Moody Film Argentique</option>
                      <option value="vibrant-clean">Vibrant & Ultra Net</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Target Channel & Format Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-violet-400" />
                  Chaîne YouTube
                </label>
                <select
                  value={selectedChannelId}
                  onChange={(e) => {
                    setSelectedChannelId(e.target.value);
                    const found = channels.find(c => c.id === e.target.value);
                    if (found) setNiche(found.niche);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Format</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFormat('short')}
                    className={`flex items-center justify-center gap-1 p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                      format === 'short'
                        ? 'bg-violet-600 text-white border-violet-500'
                        : 'bg-studio-surface border-studio-border text-zinc-400'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    Shorts
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('long')}
                    className={`flex items-center justify-center gap-1 p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                      format === 'long'
                        ? 'bg-violet-600 text-white border-violet-500'
                        : 'bg-studio-surface border-studio-border text-zinc-400'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    16:9
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Niche Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Niche thématique</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value as NicheType)}
                className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {NICHES.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.emoji} {n.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Topic Input with AI Inspiration Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">Sujet ou Idée de la vidéo</label>
                <button
                  type="button"
                  onClick={pickRandomTopic}
                  className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
                >
                  <Wand2 className="w-3 h-3" />
                  Idée virale IA
                </button>
              </div>
              <textarea
                rows={2}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex : Le secret méconnu de la productivité des empereurs romains..."
                className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            {/* 7. Voice & Music Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-violet-400" />
                  Voix Off IA
                </label>
                <select
                  value={selectedVoice.voiceId}
                  onChange={(e) => {
                    const v = VOICE_PRESETS.find(p => p.voiceId === e.target.value);
                    if (v) setSelectedVoice(v);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-studio-surface border border-studio-border text-xs text-white"
                >
                  {VOICE_PRESETS.map((v) => (
                    <option key={v.voiceId} value={v.voiceId}>
                      {v.voiceName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-violet-400" />
                  Musique de fond
                </label>
                <select
                  value={selectedMusic.id}
                  onChange={(e) => {
                    const m = MUSIC_TRACKS.find(t => t.id === e.target.value);
                    if (m) setSelectedMusic(m);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-studio-surface border border-studio-border text-xs text-white"
                >
                  {MUSIC_TRACKS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Launch Generation Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-500 hover:from-violet-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating 
                  ? 'Génération Réaliste en cours...' 
                  : `Générer la Vidéo (${targetSeconds}s • ${creditsCost} Crédits)`}
              </button>
            </div>

          </form>

          {/* Real-time Generation Progress Bar */}
          {isGenerating && (
            <div className="glass-panel p-5 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-violet-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                  {generationStep}
                </span>
                <span className="font-mono text-zinc-400">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-studio-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Output: Video Player, Scenes & Thumbnail (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {generatedVideo ? (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                {[
                  { id: 'preview', label: 'Lecteur Vidéo & Rendu', icon: Video },
                  { id: 'scenes', label: 'Script & Scènes Découpées', icon: Layers },
                  { id: 'thumbnail', label: 'Miniature IA', icon: Eye },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                          : 'text-zinc-400 hover:text-white bg-white/5'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Live Interactive Video Player */}
              {activeTab === 'preview' && (
                <div className="glass-panel p-6 rounded-3xl space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white text-base">{generatedVideo.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{generatedVideo.description}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-xs font-bold text-violet-300 shrink-0">
                      {generatedVideo.targetDurationSeconds || 60}s ({generatedVideo.scenes.length} scènes)
                    </span>
                  </div>

                  <VideoPlayer project={generatedVideo} />
                </div>
              )}

              {/* Tab 2: Scene-by-Scene Script Editor */}
              {activeTab === 'scenes' && (
                <div className="glass-panel p-6 rounded-3xl space-y-4 max-h-[700px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div>
                      <h3 className="font-bold text-white text-sm">Découpage Scène par Scène</h3>
                      <p className="text-[11px] text-zinc-400">Total : {generatedVideo.scenes.length} scènes générées pour {generatedVideo.targetDurationSeconds || 60}s</p>
                    </div>
                    <span className="text-xs text-violet-400 font-semibold flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />
                      Moteur : {AI_VIDEO_ENGINES.find(e => e.id === generatedVideo.engine)?.name || 'Kling AI'}
                    </span>
                  </div>

                  {generatedVideo.scenes.map((scene, idx) => (
                    <div key={scene.id} className="p-4 rounded-2xl bg-studio-surface border border-studio-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[10px]">
                            {scene.order}
                          </span>
                          Scène #{scene.order} • {scene.durationSeconds}s
                        </span>
                        <button
                          onClick={() => AIGeneratorService.speakScene(scene.dialogue, generatedVideo.voiceSettings)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-zinc-300 transition-colors"
                        >
                          <Mic className="w-3 h-3 text-violet-400" />
                          Tester la voix
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-400 font-medium">Texte de la narration (Voix off synchronisée)</label>
                        <textarea
                          rows={2}
                          value={scene.dialogue}
                          onChange={(e) => {
                            const newScenes = [...generatedVideo.scenes];
                            newScenes[idx].dialogue = e.target.value;
                            newScenes[idx].subtitle = e.target.value;
                            setGeneratedVideo({ ...generatedVideo, scenes: newScenes });
                            StudioStorage.saveVideo({ ...generatedVideo, scenes: newScenes });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <img 
                          src={scene.imageUrl} 
                          alt="" 
                          className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-violet-500/30" 
                        />
                        <div className="text-[11px] text-zinc-400 leading-tight space-y-1">
                          <div>
                            <span className="font-semibold text-zinc-300">Prompt visuel IA : </span>
                            {scene.visualPrompt}
                          </div>
                          {scene.cameraMovement && (
                            <div className="text-[10px] text-violet-400 font-mono">
                              🎥 Caméra : {scene.cameraMovement}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Thumbnail Editor */}
              {activeTab === 'thumbnail' && (
                <div className="glass-panel p-6 rounded-3xl">
                  <ThumbnailEditor
                    initialData={generatedVideo.thumbnail}
                    niche={generatedVideo.niche}
                    onSave={(updatedThumb) => {
                      const updated = { ...generatedVideo, thumbnail: updatedThumb };
                      setGeneratedVideo(updated);
                      StudioStorage.saveVideo(updated);
                    }}
                  />
                </div>
              )}

            </div>
          ) : (
            /* Empty State Before Generation */
            <div className="glass-panel p-12 rounded-3xl text-center space-y-4 flex flex-col items-center justify-center min-h-[450px]">
              <div className="w-16 h-16 rounded-3xl bg-violet-600/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
                <Video className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-bold text-white text-base">Prêt pour une génération ultra-réaliste</h3>
                <p className="text-xs text-zinc-400">
                  Sélectionnez un moteur (Kling AI, Runway, Sora Turbo), choisissez la durée jusqu’à 3 minutes (180s), et lancez la création.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Publication Modal */}
      {generatedVideo && (
        <PublishModal
          video={generatedVideo}
          channels={channels}
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          onPublished={(updated) => setGeneratedVideo(updated)}
        />
      )}

    </div>
  );
}