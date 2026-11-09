import { createClient } from '@supabase/supabase-js';
import { Channel, VideoProject, AutopilotConfig, UserCredits } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 1. Initialisation du client officiel Supabase
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('votre-projet'));
};

// 2. Services de synchronisation Supabase PostgreSQL

export class SupabaseService {
  
  // --- CHANNELS ---
  static async fetchChannels(userId: string): Promise<Channel[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetchChannels error:', error);
      return null;
    }
    return data as Channel[];
  }

  static async upsertChannel(channel: Channel, userId: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
      .from('channels')
      .upsert({
        id: channel.id.startsWith('chan-') ? undefined : channel.id,
        user_id: userId,
        name: channel.name,
        handle: channel.handle,
        niche: channel.niche,
        description: channel.description,
        avatar_url: channel.avatarUrl,
        banner_url: channel.bannerUrl,
        is_connected: channel.isConnected,
        youtube_channel_id: channel.youtubeChannelId,
        subscribers_count: channel.subscribersCount,
        views_count: channel.viewsCount,
        videos_count: channel.videosCount,
        autopilot_enabled: channel.autoPilotEnabled,
      });

    if (error) {
      console.error('Supabase upsertChannel error:', error);
      return false;
    }
    return true;
  }

  // --- VIDEOS ---
  static async fetchVideos(userId: string): Promise<VideoProject[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('videos')
      .select('*, scenes(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetchVideos error:', error);
      return null;
    }
    return data as VideoProject[];
  }

  static async saveVideo(video: VideoProject, userId: string): Promise<boolean> {
    if (!supabase) return false;
    const { data, error } = await supabase
      .from('videos')
      .upsert({
        id: video.id.startsWith('vid-') ? undefined : video.id,
        user_id: userId,
        channel_id: video.channelId,
        title: video.title,
        description: video.description,
        tags: video.tags,
        niche: video.niche,
        format: video.format,
        target_duration_minutes: video.targetDurationMinutes,
        voice_settings: video.voiceSettings,
        music_settings: { track: video.musicTrack, volume: video.musicVolume },
        subtitles_enabled: video.subtitlesEnabled,
        thumbnail_data: video.thumbnail,
        status: video.status,
        scheduled_at: video.scheduledAt,
        published_at: video.publishedAt,
        youtube_url: video.youtubeUrl,
        youtube_video_id: video.youtubeVideoId,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveVideo error:', error);
      return false;
    }

    // Save individual scenes
    if (data?.id && video.scenes?.length > 0) {
      const scenesToInsert = video.scenes.map((s, idx) => ({
        video_id: data.id,
        order_index: idx + 1,
        dialogue: s.dialogue,
        visual_prompt: s.visualPrompt,
        image_url: s.imageUrl,
        duration_seconds: s.durationSeconds,
        subtitle: s.subtitle
      }));

      await supabase.from('scenes').delete().eq('video_id', data.id);
      await supabase.from('scenes').insert(scenesToInsert);
    }

    return true;
  }

  // --- AUTOPILOT ---
  static async saveAutopilotConfig(config: AutopilotConfig, userId: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
      .from('autopilot_configs')
      .upsert({
        channel_id: config.channelId,
        user_id: userId,
        niche: config.niche,
        format: config.format,
        videos_per_week: config.videosPerWeek,
        publish_time: config.publishTime,
        preferred_days: config.preferredDays,
        auto_approve: config.autoApprove,
        include_shorts: config.includeShorts,
        enabled: config.enabled,
        topics_queue: config.queue,
      });

    if (error) {
      console.error('Supabase saveAutopilotConfig error:', error);
      return false;
    }
    return true;
  }

  // --- CREDITS ---
  static async getCredits(userId: string): Promise<UserCredits | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('credits_balance, plan, monthly_quota')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Supabase getCredits error:', error);
      return null;
    }

    return {
      balance: data.credits_balance,
      plan: data.plan,
      monthlyQuota: data.monthly_quota,
      totalGenerated: 0
    };
  }
}
