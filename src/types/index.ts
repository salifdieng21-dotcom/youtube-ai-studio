export type NicheType = 
  | 'motivation'
  | 'histoire'
  | 'football'
  | 'actualites'
  | 'education'
  | 'divertissement'
  | 'business'
  | 'technologie'
  | 'gaming'
  | 'sante';

export type VideoFormat = 'long' | 'short';

export type VideoEngineId = 
  | 'kling-v15' 
  | 'kling-v2' 
  | 'runway-gen3' 
  | 'luma-dream' 
  | 'sora-turbo' 
  | 'veo-2';

export interface VideoEngine {
  id: VideoEngineId;
  name: string;
  badge: string;
  provider: string;
  description: string;
  realismScore: string;
  cameraControl: boolean;
  maxFps: number;
  qualityTag: string;
}

export interface RealismSettings {
  lighting: 'cinematic' | 'cinematic-volumetric' | 'golden-hour' | 'cyberpunk-neon' | 'dramatic-shadows' | 'hyperreal-studio' | 'natural-daylight';
  cameraMotion: 'smooth-tracking' | 'dolly-zoom' | 'cinematic-pan' | 'drone-orbit' | 'fpv-rush' | 'subtle-push-in' | 'drone-fpv' | 'orbit-360' | 'slow-push-in' | 'handheld-dynamic';
  lensType: 'anamorphic-35mm' | 'macro-85mm' | 'wide-angle-16mm' | 'master-prime-50mm' | 'wide-angle-24mm' | 'telephoto-85mm';
  resolution?: '1080p' | '4k-uhd';
  renderResolution?: '1080p' | '4k';
  frameRate?: number;
  fps?: 30 | 60;
  motionBlur?: boolean;
  depthOfField?: boolean;
  colorGrading?: 'teal-and-orange' | 'cinematic-warm' | 'moody-film' | 'vibrant-clean';
}

export interface Scene {
  id: string;
  order: number;
  dialogue: string;
  visualPrompt: string;
  imageUrl: string;
  videoUrl?: string; // Real animated AI video clip
  durationSeconds: number;
  subtitle: string;
  cameraMovement?: string;
}

export interface VoiceSettings {
  voiceId: string;
  voiceName: string;
  gender: 'male' | 'female';
  speed: number;
  pitch: number;
  emotion: 'energetic' | 'dramatic' | 'calm' | 'professional';
}

export interface MusicTrack {
  id: string;
  name: string;
  category: string;
  url: string;
  bpm: number;
}

export interface ThumbnailData {
  titleText: string;
  subText?: string;
  badgeText?: string;
  bgImageUrl: string;
  accentColor: string;
  textColor: string;
  layout: 'bold-left' | 'center-glow' | 'split-face' | 'minimal-dark';
  generatedDataUrl?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  niche: NicheType;
  format: VideoFormat;
  targetDurationMinutes: number;
  targetDurationSeconds?: number; // 30s to 180s (3 minutes)
  engine?: VideoEngineId;
  realismSettings?: RealismSettings;
  scenes: Scene[];
  voiceSettings: VoiceSettings;
  musicTrack: MusicTrack;
  musicVolume: number;
  subtitlesEnabled: boolean;
  subtitlesColor: string;
  thumbnail: ThumbnailData;
  status: 'draft' | 'generating' | 'ready' | 'scheduled' | 'published';
  progressPercentage?: number;
  generationStep?: string;
  channelId: string;
  scheduledAt?: string;
  publishedAt?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
  handle: string;
  niche: NicheType;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  isConnected: boolean;
  youtubeChannelId?: string;
  subscribersCount: number;
  viewsCount: number;
  videosCount: number;
  autoPilotEnabled: boolean;
  createdAt: string;
}

export interface AutopilotConfig {
  id: string;
  channelId: string;
  niche: NicheType;
  format: VideoFormat;
  videosPerWeek: number;
  publishTime: string;
  preferredDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  autoApprove: boolean;
  includeShorts: boolean;
  enabled: boolean;
  lastGeneratedAt?: string;
  nextScheduledAt?: string;
  queue: {
    topic: string;
    targetDate: string;
    status: 'queued' | 'generated' | 'published';
  }[];
}

export interface UserCredits {
  balance: number;
  plan: 'free' | 'creator' | 'pro' | 'agency';
  monthlyQuota: number;
  totalGenerated: number;
}

export interface AnalyticsSummary {
  totalChannels: number;
  totalVideosCreated: number;
  totalVideosPublished: number;
  totalViews: number;
  totalSubscribers: number;
  avgWatchTimeMinutes: number;
  creditsRemaining: number;
}
