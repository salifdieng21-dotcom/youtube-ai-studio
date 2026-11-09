import { Channel, VideoProject, AutopilotConfig, UserCredits, AnalyticsSummary } from '@/types';
import { NICHES, VOICE_PRESETS, MUSIC_TRACKS, CURATED_STOCK_IMAGES } from './constants';

const CHANNELS_KEY = 'yt_studio_channels';
const VIDEOS_KEY = 'yt_studio_videos';
const AUTOPILOT_KEY = 'yt_studio_autopilot';
const CREDITS_KEY = 'yt_studio_credits';

// Initial Seed Data to make the platform immediately rich and usable
const SEED_CHANNELS: Channel[] = [
  {
    id: 'chan-1',
    name: 'Mindset & Victoire',
    handle: '@MindsetVictoireIA',
    niche: 'motivation',
    description: 'La chaîne n°1 des discours inspirants et secrets de la discipline stoïcienne. Développez un mental d’acier chaque semaine.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    isConnected: true,
    youtubeChannelId: 'UC_mindset_victoire_official',
    subscribersCount: 24800,
    viewsCount: 1420500,
    videosCount: 32,
    autoPilotEnabled: true,
    createdAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'chan-2',
    name: 'Tech Horizon IA',
    handle: '@TechHorizonIA',
    niche: 'technologie',
    description: 'Décryptage hebdomadaire des révolutions technologiques, IA générative, puces quantiques et innovations du futur.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    isConnected: true,
    youtubeChannelId: 'UC_tech_horizon_ia_official',
    subscribersCount: 68400,
    viewsCount: 3890200,
    videosCount: 54,
    autoPilotEnabled: true,
    createdAt: '2026-09-01T08:30:00Z',
  },
  {
    id: 'chan-3',
    name: 'Football Tactics & Legends',
    handle: '@FootTacticsLegends',
    niche: 'football',
    description: 'L’envers du décor des plus grands matchs, analyses tactiques secrètes et récits immersifs des dieux du ballon rond.',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=300&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    isConnected: false,
    subscribersCount: 12100,
    viewsCount: 620000,
    videosCount: 18,
    autoPilotEnabled: false,
    createdAt: '2026-10-20T14:15:00Z',
  }
];

const SEED_VIDEOS: VideoProject[] = [
  {
    id: 'vid-1',
    title: 'Ce que 99% des gens ignorent sur la discipline mentale',
    description: 'Découvrez la méthode stoïcienne exacte utilisée par les leaders mondiaux pour pulvériser leurs doutes et dominer leur journée.',
    tags: ['motivation', 'discipline', 'stoicisme', 'succes', 'developpement personnel'],
    niche: 'motivation',
    format: 'short',
    targetDurationMinutes: 1,
    scenes: [
      {
        id: 'sc-1',
        order: 1,
        dialogue: 'Vous pensez manquer de motivation ? C’est totalement faux.',
        visualPrompt: 'Un homme déterminé face à un lever de soleil au sommet d’une montagne brumeuse.',
        imageUrl: CURATED_STOCK_IMAGES.motivation[0],
        durationSeconds: 4,
        subtitle: 'Vous pensez manquer de motivation ? C’est totalement faux.'
      },
      {
        id: 'sc-2',
        order: 2,
        dialogue: 'La motivation est une émotion éphémère. Les champions ne comptent que sur un seul pilier : la discipline sans négociation.',
        visualPrompt: 'Gros plan intense sur un athlète s’entraînant sous une pluie battante dans l’obscurité.',
        imageUrl: CURATED_STOCK_IMAGES.motivation[1],
        durationSeconds: 6,
        subtitle: 'La motivation est éphémère. Les champions comptent sur la discipline.'
      },
      {
        id: 'sc-3',
        order: 3,
        dialogue: 'Pendant que les autres attendent d’avoir envie, commencez dès maintenant.',
        visualPrompt: 'Une silhouette victorieuse qui franchit une ligne d’arrivée sous les éclairs de lumière.',
        imageUrl: CURATED_STOCK_IMAGES.motivation[2],
        durationSeconds: 5,
        subtitle: 'Pendant que les autres attendent, commencez dès maintenant.'
      }
    ],
    voiceSettings: VOICE_PRESETS[0],
    musicTrack: MUSIC_TRACKS[0],
    musicVolume: 0.35,
    subtitlesEnabled: true,
    subtitlesColor: '#facc15',
    thumbnail: {
      titleText: 'LE SECRET DU SUCCÈS',
      subText: 'Ne remettez plus à demain',
      badgeText: 'VIRAL',
      bgImageUrl: CURATED_STOCK_IMAGES.motivation[0],
      accentColor: '#f59e0b',
      textColor: '#ffffff',
      layout: 'bold-left'
    },
    status: 'published',
    channelId: 'chan-1',
    publishedAt: '2026-11-01T18:00:00Z',
    youtubeUrl: 'https://youtube.com/shorts/sample123',
    youtubeVideoId: 'sample123',
    createdAt: '2026-11-01T16:30:00Z',
  },
  {
    id: 'vid-2',
    title: 'Top 5 des outils IA qui changent tout en 2026',
    description: 'Analyse complète et démonstration des nouveaux agents autonomes et modèles multimodaux de cette année.',
    tags: ['ia', 'technologie', 'futur', 'intelligence artificielle', 'productivite'],
    niche: 'technologie',
    format: 'long',
    targetDurationMinutes: 8,
    scenes: [
      {
        id: 'sc-21',
        order: 1,
        dialogue: 'L’intelligence artificielle vient de franchir un nouveau point de non-retour.',
        visualPrompt: 'Réseaux de neurones holographiques lumineux ultra détaillés avec reflets cybernétiques.',
        imageUrl: CURATED_STOCK_IMAGES.technologie[0],
        durationSeconds: 5,
        subtitle: 'L’intelligence artificielle vient de franchir un point de non-retour.'
      },
      {
        id: 'sc-22',
        order: 2,
        dialogue: 'Voici les 5 outils concrets qui transforment déjà le travail de milliers de créateurs à travers le monde.',
        visualPrompt: 'Bureau futuriste avec écrans transparents affichant du code et des rendus 3D en temps réel.',
        imageUrl: CURATED_STOCK_IMAGES.technologie[1],
        durationSeconds: 6,
        subtitle: '5 outils concrets qui transforment le travail des créateurs.'
      }
    ],
    voiceSettings: VOICE_PRESETS[2],
    musicTrack: MUSIC_TRACKS[2],
    musicVolume: 0.3,
    subtitlesEnabled: true,
    subtitlesColor: '#a855f7',
    thumbnail: {
      titleText: '5 OUTILS IA RÉVOLUTIONNAIRES',
      subText: 'Spécial 2026',
      badgeText: 'FUTUR',
      bgImageUrl: CURATED_STOCK_IMAGES.technologie[0],
      accentColor: '#8b5cf6',
      textColor: '#ffffff',
      layout: 'center-glow'
    },
    status: 'scheduled',
    channelId: 'chan-2',
    scheduledAt: '2026-11-03T19:30:00Z',
    createdAt: '2026-11-02T10:00:00Z',
  }
];

const SEED_AUTOPILOT: AutopilotConfig[] = [
  {
    id: 'auto-1',
    channelId: 'chan-1',
    niche: 'motivation',
    format: 'short',
    videosPerWeek: 3,
    publishTime: '18:00',
    preferredDays: [1, 3, 5], // Lundi, Mercredi, Vendredi
    autoApprove: true,
    includeShorts: true,
    enabled: true,
    lastGeneratedAt: '2026-11-01T16:30:00Z',
    nextScheduledAt: '2026-11-04T18:00:00Z',
    queue: [
      { topic: 'La psychologie du dépassement de soi sous pression', targetDate: '2026-11-04', status: 'queued' },
      { topic: 'Le piège du perfectionnisme : comment avancer sans faillir', targetDate: '2026-11-06', status: 'queued' },
      { topic: 'Routine nocturne des cerveaux les plus performants', targetDate: '2026-11-09', status: 'queued' }
    ]
  },
  {
    id: 'auto-2',
    channelId: 'chan-2',
    niche: 'technologie',
    format: 'long',
    videosPerWeek: 2,
    publishTime: '19:30',
    preferredDays: [2, 6], // Mardi, Samedi
    autoApprove: false,
    includeShorts: true,
    enabled: true,
    lastGeneratedAt: '2026-11-02T10:00:00Z',
    nextScheduledAt: '2026-11-07T19:30:00Z',
    queue: [
      { topic: 'Les secrets du processeur quantique à température ambiante', targetDate: '2026-11-07', status: 'queued' },
      { topic: 'Robots autonomes : la fin des entrepôts traditionnels ?', targetDate: '2026-11-10', status: 'queued' }
    ]
  }
];

const SEED_CREDITS: UserCredits = {
  balance: 385,
  plan: 'pro',
  monthlyQuota: 500,
  totalGenerated: 28
};

export class StudioStorage {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- CHANNELS ---
  static getChannels(): Channel[] {
    if (!this.isBrowser()) return SEED_CHANNELS;
    const stored = localStorage.getItem(CHANNELS_KEY);
    if (!stored) {
      localStorage.setItem(CHANNELS_KEY, JSON.stringify(SEED_CHANNELS));
      return SEED_CHANNELS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_CHANNELS;
    }
  }

  static saveChannel(channel: Channel): Channel {
    const list = this.getChannels();
    const index = list.findIndex(c => c.id === channel.id);
    if (index >= 0) {
      list[index] = channel;
    } else {
      list.unshift(channel);
    }
    if (this.isBrowser()) {
      localStorage.setItem(CHANNELS_KEY, JSON.stringify(list));
    }
    return channel;
  }

  static deleteChannel(id: string): void {
    const list = this.getChannels().filter(c => c.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(CHANNELS_KEY, JSON.stringify(list));
    }
  }

  // --- VIDEOS ---
  static getVideos(): VideoProject[] {
    if (!this.isBrowser()) return SEED_VIDEOS;
    const stored = localStorage.getItem(VIDEOS_KEY);
    if (!stored) {
      localStorage.setItem(VIDEOS_KEY, JSON.stringify(SEED_VIDEOS));
      return SEED_VIDEOS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_VIDEOS;
    }
  }

  static getVideoById(id: string): VideoProject | undefined {
    return this.getVideos().find(v => v.id === id);
  }

  static saveVideo(video: VideoProject): VideoProject {
    const list = this.getVideos();
    const index = list.findIndex(v => v.id === video.id);
    if (index >= 0) {
      list[index] = video;
    } else {
      list.unshift(video);
    }
    if (this.isBrowser()) {
      localStorage.setItem(VIDEOS_KEY, JSON.stringify(list));
    }
    return video;
  }

  static deleteVideo(id: string): void {
    const list = this.getVideos().filter(v => v.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(VIDEOS_KEY, JSON.stringify(list));
    }
  }

  // --- AUTOPILOT ---
  static getAutopilotConfigs(): AutopilotConfig[] {
    if (!this.isBrowser()) return SEED_AUTOPILOT;
    const stored = localStorage.getItem(AUTOPILOT_KEY);
    if (!stored) {
      localStorage.setItem(AUTOPILOT_KEY, JSON.stringify(SEED_AUTOPILOT));
      return SEED_AUTOPILOT;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_AUTOPILOT;
    }
  }

  static saveAutopilotConfig(config: AutopilotConfig): AutopilotConfig {
    const list = this.getAutopilotConfigs();
    const index = list.findIndex(a => a.channelId === config.channelId);
    if (index >= 0) {
      list[index] = config;
    } else {
      list.push(config);
    }
    if (this.isBrowser()) {
      localStorage.setItem(AUTOPILOT_KEY, JSON.stringify(list));
    }
    return config;
  }

  // --- CREDITS ---
  static getCredits(): UserCredits {
    if (!this.isBrowser()) return SEED_CREDITS;
    const stored = localStorage.getItem(CREDITS_KEY);
    if (!stored) {
      localStorage.setItem(CREDITS_KEY, JSON.stringify(SEED_CREDITS));
      return SEED_CREDITS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_CREDITS;
    }
  }

  static deductCredits(amount: number): boolean {
    const credits = this.getCredits();
    if (credits.balance < amount) return false;
    credits.balance -= amount;
    credits.totalGenerated += 1;
    if (this.isBrowser()) {
      localStorage.setItem(CREDITS_KEY, JSON.stringify(credits));
    }
    return true;
  }

  static addCredits(amount: number): UserCredits {
    const credits = this.getCredits();
    credits.balance += amount;
    if (this.isBrowser()) {
      localStorage.setItem(CREDITS_KEY, JSON.stringify(credits));
    }
    return credits;
  }

  // --- ANALYTICS ---
  static getAnalyticsSummary(): AnalyticsSummary {
    const channels = this.getChannels();
    const videos = this.getVideos();
    const credits = this.getCredits();

    const totalViews = channels.reduce((acc, c) => acc + (c.viewsCount || 0), 0);
    const totalSubscribers = channels.reduce((acc, c) => acc + (c.subscribersCount || 0), 0);
    const totalPublished = videos.filter(v => v.status === 'published').length;

    return {
      totalChannels: channels.length,
      totalVideosCreated: videos.length,
      totalVideosPublished: totalPublished,
      totalViews,
      totalSubscribers,
      avgWatchTimeMinutes: 4.8,
      creditsRemaining: credits.balance
    };
  }
}
