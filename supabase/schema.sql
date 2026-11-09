-- =========================================================
-- YOUTUBE AI STUDIO - SUPABASE PRODUCTION DATABASE SCHEMA
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS & CREDITS PROFILE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text default 'creator' check (plan in ('free', 'creator', 'pro', 'agency')),
  credits_balance integer default 500,
  monthly_quota integer default 500,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. YOUTUBE CHANNELS
create table if not exists public.channels (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  handle text not null,
  niche text not null,
  description text,
  avatar_url text,
  banner_url text,
  is_connected boolean default false,
  youtube_channel_id text,
  google_refresh_token text,
  google_access_token text,
  token_expires_at timestamp with time zone,
  subscribers_count integer default 0,
  views_count integer default 0,
  videos_count integer default 0,
  autopilot_enabled boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. VIDEO PROJECTS
create table if not exists public.videos (
  id uuid default uuid_generate_v4() primary key,
  channel_id uuid references public.channels(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  tags text[] default '{}',
  niche text not null,
  format text default 'long' check (format in ('long', 'short')),
  target_duration_minutes integer default 2,
  voice_settings jsonb default '{}'::jsonb,
  music_settings jsonb default '{}'::jsonb,
  subtitles_enabled boolean default true,
  thumbnail_data jsonb default '{}'::jsonb,
  video_url text,
  thumbnail_url text,
  status text default 'draft' check (status in ('draft', 'generating', 'ready', 'scheduled', 'published')),
  youtube_video_id text,
  youtube_url text,
  scheduled_at timestamp with time zone,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. VIDEO SCENES
create table if not exists public.scenes (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references public.videos(id) on delete cascade not null,
  order_index integer not null,
  dialogue text not null,
  visual_prompt text not null,
  image_url text,
  duration_seconds integer default 5,
  subtitle text
);

-- 5. AUTOPILOT CONFIGURATIONS
create table if not exists public.autopilot_configs (
  id uuid default uuid_generate_v4() primary key,
  channel_id uuid references public.channels(id) on delete cascade unique not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  niche text not null,
  format text default 'short' check (format in ('long', 'short')),
  videos_per_week integer default 3,
  publish_time text default '18:00',
  preferred_days integer[] default '{1,3,5}',
  auto_approve boolean default true,
  include_shorts boolean default true,
  enabled boolean default false,
  last_generated_at timestamp with time zone,
  next_scheduled_at timestamp with time zone,
  topics_queue jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. CREDITS TRANSACTIONS (Stripe & Generations)
create table if not exists public.credits_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount integer not null,
  action text not null,
  stripe_session_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.videos enable row level security;
alter table public.scenes enable row level security;
alter table public.autopilot_configs enable row level security;
alter table public.credits_transactions enable row level security;

-- Policies for Authenticated Users
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can manage own channels" on public.channels for all using (auth.uid() = user_id);
create policy "Users can manage own videos" on public.videos for all using (auth.uid() = user_id);
create policy "Users can manage scenes" on public.scenes for all using (
  exists (select 1 from public.videos where videos.id = scenes.video_id and videos.user_id = auth.uid())
);
create policy "Users can manage autopilot" on public.autopilot_configs for all using (auth.uid() = user_id);
