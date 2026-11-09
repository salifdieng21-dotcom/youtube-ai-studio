'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Download, Sparkles, Image as ImageIcon, Palette, Type, RefreshCw } from 'lucide-react';
import { ThumbnailData, NicheType } from '@/types';
import { CURATED_STOCK_IMAGES } from '@/lib/constants';

interface ThumbnailEditorProps {
  initialData: ThumbnailData;
  niche: NicheType;
  onSave?: (data: ThumbnailData) => void;
}

export default function ThumbnailEditor({ initialData, niche, onSave }: ThumbnailEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [titleText, setTitleText] = useState(initialData.titleText || 'LE SECRET DÉVOILÉ');
  const [subText, setSubText] = useState(initialData.subText || 'Ne faites plus cette erreur');
  const [badgeText, setBadgeText] = useState(initialData.badgeText || 'VIRAL');
  const [accentColor, setAccentColor] = useState(initialData.accentColor || '#8b5cf6');
  const [layout, setLayout] = useState<ThumbnailData['layout']>(initialData.layout || 'bold-left');
  const [bgImageUrl, setBgImageUrl] = useState(initialData.bgImageUrl || CURATED_STOCK_IMAGES[niche][0]);

  // Redraw Canvas on any state change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard YouTube 1280x720 HD resolution
    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = bgImageUrl;

    const draw = () => {
      // 1. Draw Background Image
      if (img.complete && img.naturalWidth > 0) {
        const imgRatio = img.width / img.height;
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

        ctx.drawImage(img, offX, offY, drawW, drawH);
      } else {
        ctx.fillStyle = '#0f0f18';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Dynamic Dark Overlays & Dramatic Contrast Gradients
      if (layout === 'bold-left') {
        const grad = ctx.createLinearGradient(0, 0, width * 0.75, 0);
        grad.addColorStop(0, 'rgba(0,0,0,0.92)');
        grad.addColorStop(0.5, 'rgba(0,0,0,0.7)');
        grad.addColorStop(1, 'rgba(0,0,0,0.1)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (layout === 'center-glow') {
        const radial = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.6);
        radial.addColorStop(0, 'rgba(139, 92, 246, 0.45)');
        radial.addColorStop(0.5, 'rgba(0,0,0,0.75)');
        radial.addColorStop(1, 'rgba(0,0,0,0.95)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      } else {
        const grad = ctx.createLinearGradient(0, height * 0.4, 0, height);
        grad.addColorStop(0, 'rgba(0,0,0,0.2)');
        grad.addColorStop(1, 'rgba(0,0,0,0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Draw Badge (ex: "VIRAL", "FUTUR", "TOP")
      if (badgeText) {
        ctx.save();
        const badgeX = layout === 'center-glow' ? width / 2 - 100 : 80;
        const badgeY = 90;
        const badgeW = 200;
        const badgeH = 50;

        ctx.fillStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`⚡ ${badgeText.toUpperCase()}`, badgeX + badgeW / 2, badgeY + 34);
        ctx.restore();
      }

      // 4. Draw Main Headline
      ctx.save();
      ctx.font = '900 78px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 25;
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#000000';

      const words = titleText.split(' ');
      let line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      let line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

      if (layout === 'center-glow') {
        ctx.textAlign = 'center';
        ctx.strokeText(line1, width / 2, 330);
        ctx.fillText(line1, width / 2, 330);
        if (line2) {
          ctx.fillStyle = accentColor;
          ctx.strokeText(line2, width / 2, 430);
          ctx.fillText(line2, width / 2, 430);
        }
      } else {
        ctx.textAlign = 'left';
        ctx.strokeText(line1, 80, 260);
        ctx.fillText(line1, 80, 260);
        if (line2) {
          ctx.fillStyle = accentColor;
          ctx.strokeText(line2, 80, 360);
          ctx.fillText(line2, 80, 360);
        }
      }
      ctx.restore();

      // 5. Draw Subtext Pill
      if (subText) {
        ctx.save();
        ctx.font = '700 36px Inter, sans-serif';
        ctx.fillStyle = '#f4f4f5';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 12;

        if (layout === 'center-glow') {
          ctx.textAlign = 'center';
          ctx.fillText(subText, width / 2, 540);
        } else {
          ctx.textAlign = 'left';
          ctx.fillText(`👉 ${subText}`, 85, 470);
        }
        ctx.restore();
      }

      // 6. Accent Border Glow
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, width - 8, height - 8);
      ctx.restore();
    };

    img.onload = draw;
    draw();

  }, [titleText, subText, badgeText, accentColor, layout, bgImageUrl]);

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `miniature_${titleText.replace(/[\s\W]+/g, '_')}.png`;
    a.click();
  };

  const cycleBackground = () => {
    const images = CURATED_STOCK_IMAGES[niche] || CURATED_STOCK_IMAGES.motivation;
    const currentIndex = images.indexOf(bgImageUrl);
    const nextIndex = (currentIndex + 1) % images.length;
    setBgImageUrl(images[nextIndex]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-5xl">
      
      {/* Thumbnail Canvas Preview (16:9) */}
      <div className="lg:col-span-7 flex flex-col items-center space-y-3">
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border-2 border-violet-500/30 shadow-2xl shadow-violet-950/40">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-between w-full px-2">
          <span className="text-xs text-zinc-400">Format YouTube : 1280 × 720 (16:9 HD)</span>
          <button
            onClick={handleDownloadPNG}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition-all hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger Miniature HD
          </button>
        </div>
      </div>

      {/* Customizer Controls Panel */}
      <div className="lg:col-span-5 bg-studio-card border border-studio-border p-5 rounded-2xl space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          Personnaliser la Miniature IA
        </h4>

        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            Titre percutant (Accroche)
          </label>
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-sm text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Subtext */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Sous-titre explicatif</label>
          <input
            type="text"
            value={subText}
            onChange={(e) => setSubText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-sm text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Badge & Color Picker */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Badge Viral</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-studio-border text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              Couleur Accent
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'].map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    accentColor === color ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Layout Style */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Style de composition</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'bold-left', label: 'Texte Gauche (Viral)' },
              { id: 'center-glow', label: 'Halo Central (Choc)' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setLayout(style.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                  layout === style.id
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'bg-studio-surface border-studio-border text-zinc-400 hover:text-white'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Switch Image Background */}
        <div className="pt-2">
          <button
            onClick={cycleBackground}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
            Changer l’image d’arrière-plan IA
          </button>
        </div>

      </div>
    </div>
  );
}
