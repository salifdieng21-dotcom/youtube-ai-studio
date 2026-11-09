'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Smartphone,
  Monitor,
  Sparkles,
  Cpu,
  Layers
} from 'lucide-react';
import { VideoProject, Scene } from '@/types';
import { AIGeneratorService } from '@/lib/ai-generator';
import { AI_VIDEO_ENGINES } from '@/lib/constants';

interface VideoPlayerProps {
  project: VideoProject;
  onSceneChange?: (sceneIndex: number) => void;
}

export default function VideoPlayer({ project, onSceneChange }: VideoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [format, setFormat] = useState<'long' | 'short'>(project.format || 'short');

  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Compute total duration
  useEffect(() => {
    const total = project.scenes.reduce((acc, s) => acc + (s.durationSeconds || 5), 0);
    setTotalDuration(total);
  }, [project.scenes]);

  // Preload scene images
  useEffect(() => {
    loadedImagesRef.current = [];
    project.scenes.forEach((scene) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = scene.imageUrl;
      loadedImagesRef.current.push(img);
    });
  }, [project.scenes]);

  const activeEngine = AI_VIDEO_ENGINES.find(e => e.id === project.engine) || AI_VIDEO_ENGINES[0];
  const activeScene = project.scenes[currentSceneIndex];

  // Update background video element source when scene changes
  useEffect(() => {
    if (activeScene?.videoUrl && videoElementRef.current) {
      videoElementRef.current.src = activeScene.videoUrl;
      videoElementRef.current.currentTime = 0;
      if (isPlaying) {
        videoElementRef.current.play().catch(() => {});
      }
    }
  }, [currentSceneIndex, activeScene?.videoUrl]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isShort = format === 'short';
    const width = isShort ? 1080 : 1920;
    const height = isShort ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    let sceneElapsed = 0;
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      const currentScene = project.scenes[currentSceneIndex];

      if (isPlaying) {
        sceneElapsed += delta;
        const sceneDuration = currentScene?.durationSeconds || 5;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= totalDuration && totalDuration > 0) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });

        if (sceneElapsed >= sceneDuration) {
          sceneElapsed = 0;
          setCurrentSceneIndex((prev) => {
            const nextIndex = (prev + 1) % project.scenes.length;
            if (onSceneChange) onSceneChange(nextIndex);
            
            // Speak voiceover for the new scene
            const nextScene = project.scenes[nextIndex];
            if (nextScene && !isMuted) {
              AIGeneratorService.speakScene(nextScene.dialogue, project.voiceSettings);
            }
            return nextIndex;
          });
        }
      }

      // 1. Draw Background: Video Frame if available, otherwise Image with Ken Burns
      const currentImage = loadedImagesRef.current[currentSceneIndex];
      const videoEl = videoElementRef.current;
      const hasLiveVideo = !!(currentScene?.videoUrl && videoEl && videoEl.readyState >= 2);

      ctx.fillStyle = '#0a0a10';
      ctx.fillRect(0, 0, width, height);

      if (hasLiveVideo) {
        // Draw video frame smoothly scaled to cover
        ctx.save();
        const vRatio = videoEl.videoWidth / (videoEl.videoHeight || 1);
        const canvasRatio = width / height;
        let drawW = width;
        let drawH = height;
        let offX = 0;
        let offY = 0;

        if (vRatio > canvasRatio) {
          drawW = height * vRatio;
          offX = (width - drawW) / 2;
        } else {
          drawH = width / vRatio;
          offY = (height - drawH) / 2;
        }
        ctx.drawImage(videoEl, offX, offY, drawW, drawH);
        ctx.restore();
      } else if (currentImage && currentImage.complete) {
        ctx.save();
        // Camera dynamic zoom / pan
        const zoom = 1.0 + (sceneElapsed / 10) * 0.12;
        const panX = Math.sin(sceneElapsed * 0.5) * 20;

        ctx.translate(width / 2 + panX, height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-width / 2, -height / 2);

        const imgRatio = currentImage.width / (currentImage.height || 1);
        const canvasRatio = width / height;
        let drawW = width;
        let drawH = height;
        let offX = 0;
        let offY = 0;

        if (imgRatio > canvasRatio) {
          drawW = height * imgRatio;
          offX = (width - drawW) / 2;
        } else {
          drawH = width / imgRatio;
          offY = (height - drawH) / 2;
        }

        ctx.drawImage(currentImage, offX, offY, drawW, drawH);
        ctx.restore();
      }

      // 2. Cinematic Vignette
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.2,
        width / 2, height / 2, width * 0.75
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Bottom shadow for subtitles readability
      const bottomGradient = ctx.createLinearGradient(0, height - 380, 0, height);
      bottomGradient.addColorStop(0, 'rgba(0,0,0,0)');
      bottomGradient.addColorStop(1, 'rgba(0,0,0,0.92)');
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(0, height - 380, width, 380);

      // 3. Render Subtitles (Cinematic Styled)
      const thisScene = project.scenes[currentSceneIndex];
      if (project.subtitlesEnabled && thisScene?.subtitle) {
        ctx.save();
        const fontSize = isShort ? 54 : 58;
        ctx.font = `900 ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';

        const subY = isShort ? height * 0.74 : height * 0.84;
        const text = thisScene.subtitle;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(text, width / 2, subY, width * 0.86);

        ctx.fillStyle = project.subtitlesColor || '#facc15';
        ctx.fillText(text, width / 2, subY, width * 0.86);
        ctx.restore();
      }

      // 4. Branding & AI Engine Watermark
      ctx.save();
      ctx.font = '600 22px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText('⚡ YouTube AI Studio', 40, isShort ? 70 : 60);

      // Engine badge top right in canvas
      ctx.font = '700 18px Inter, sans-serif';
      ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
      const engineText = `AI: ${activeEngine.name}`;
      const textWidth = ctx.measureText(engineText).width;
      ctx.fillText(engineText, width - textWidth - 40, isShort ? 70 : 60);
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentSceneIndex, format, project, totalDuration, isMuted, activeEngine]);

  // Audio and Speech control
  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(() => {});
      }
      if (videoElementRef.current) {
        videoElementRef.current.play().catch(() => {});
      }
      const thisScene = project.scenes[currentSceneIndex];
      if (thisScene && !isMuted) {
        AIGeneratorService.speakScene(thisScene.dialogue, project.voiceSettings);
      }
    } else {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (videoElementRef.current) videoElementRef.current.pause();
      AIGeneratorService.stopSpeech();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSceneIndex(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoElementRef.current) {
      videoElementRef.current.pause();
      videoElementRef.current.currentTime = 0;
    }
    AIGeneratorService.stopSpeech();
  };

  // Export Video (MediaRecorder WebM)
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportProgress(10);
    handleReset();

    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title.replace(/[\s\W]+/g, '_')}_${format}.webm`;
        a.click();
        setIsExporting(false);
        setExportProgress(100);
      };

      recorder.start();
      setIsPlaying(true);

      const durationMs = (totalDuration || 15) * 1000;
      const interval = setInterval(() => {
        setExportProgress((prev) => Math.min(prev + 10, 95));
      }, durationMs / 10);

      setTimeout(() => {
        clearInterval(interval);
        recorder.stop();
        setIsPlaying(false);
      }, durationMs);

    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      
      {/* Hidden background HTML video element for high-res video scene textures */}
      <video
        ref={videoElementRef}
        crossOrigin="anonymous"
        playsInline
        muted
        loop
        className="hidden"
      />

      {/* Format & Engine Information Bar */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-2xl px-2 gap-2">
        <div className="flex items-center gap-2 bg-studio-surface p-1 rounded-xl border border-studio-border">
          <button
            onClick={() => setFormat('short')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              format === 'short' 
                ? 'bg-violet-600 text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Shorts (9:16)
          </button>
          <button
            onClick={() => setFormat('long')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              format === 'long' 
                ? 'bg-violet-600 text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Vidéo Longue (16:9)
          </button>
        </div>

        {/* Engine Badge Info */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600/20 border border-violet-500/40 text-[11px] font-bold text-violet-300">
            <Cpu className="w-3 h-3 text-violet-400" />
            {activeEngine.name}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            Scène {currentSceneIndex + 1} / {project.scenes.length}
          </span>
        </div>
      </div>

      {/* Canvas Viewport Frame */}
      <div className={`relative overflow-hidden rounded-2xl bg-black border-2 border-violet-500/20 shadow-2xl flex items-center justify-center transition-all ${
        format === 'short' ? 'w-[320px] h-[568px] sm:w-[360px] sm:h-[640px]' : 'w-full max-w-3xl aspect-video'
      }`}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
        />

        {/* Center Play Overlay Icon when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-violet-600/85 hover:bg-violet-600 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Play className="w-8 h-8 fill-white translate-x-0.5" />
          </button>
        )}

        {/* Scene Badge Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-violet-300">
          <Layers className="w-3 h-3" />
          Scène #{project.scenes[currentSceneIndex]?.order || 1} ({project.scenes[currentSceneIndex]?.durationSeconds || 5}s)
        </div>
      </div>

      {/* Audio Element for Royalty-free Music */}
      {project.musicTrack && (
        <audio
          ref={audioRef}
          src={project.musicTrack.url}
          loop
          onPlay={() => {
            if (audioRef.current) audioRef.current.volume = project.musicVolume || 0.3;
          }}
        />
      )}

      {/* Video Control Bar */}
      <div className="w-full max-w-2xl bg-studio-card border border-studio-border p-4 rounded-2xl space-y-3">
        {/* Progress Scrubber */}
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-150"
              style={{ width: `${(currentTime / (totalDuration || 1)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
            <span>{formatSeconds(currentTime)}</span>
            <span>{formatSeconds(totalDuration)} ({project.scenes.length} scènes)</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-md shadow-violet-600/25"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
            </button>
            <button
              onClick={handleReset}
              className="w-9 h-9 rounded-xl bg-studio-surface hover:bg-white/10 text-zinc-300 flex items-center justify-center transition-colors"
              title="Recommencer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (audioRef.current) audioRef.current.muted = !isMuted;
                if (!isMuted) AIGeneratorService.stopSpeech();
              }}
              className="w-9 h-9 rounded-xl bg-studio-surface hover:bg-white/10 text-zinc-300 flex items-center justify-center transition-colors"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Scene Selector Pills */}
          <div className="hidden sm:flex items-center gap-1.5 max-w-[260px] overflow-x-auto py-1">
            {project.scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  setCurrentSceneIndex(idx);
                  if (onSceneChange) onSceneChange(idx);
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                  currentSceneIndex === idx
                    ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                    : 'bg-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                #{idx + 1}
              </button>
            ))}
          </div>

          {/* Download WebM Video */}
          <button
            onClick={handleExportVideo}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-studio-surface hover:bg-white/10 border border-studio-border hover:border-violet-500/40 text-xs font-semibold text-zinc-200 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-violet-400" />
            {isExporting ? `Export (${exportProgress}%)...` : 'Exporter MP4'}
          </button>
        </div>
      </div>
    </div>
  );
}