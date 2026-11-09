import { NicheType, VideoFormat, VideoEngineId, Scene, ThumbnailData, VoiceSettings, RealismSettings } from '@/types';
import { NICHES, CURATED_STOCK_IMAGES, CURATED_STOCK_VIDEOS, VOICE_PRESETS, MUSIC_TRACKS, AI_VIDEO_ENGINES } from './constants';

export interface ChannelGenerationResult {
  names: string[];
  selectedName: string;
  handle: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  targetAudience: string;
  keywords: string[];
}

export class AIGeneratorService {
  // 1. GENERATE CHANNEL PROFILE
  static async generateChannelProfile(niche: NicheType): Promise<ChannelGenerationResult> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const nicheData = NICHES.find(n => n.id === niche) || NICHES[0];
    const stockImages = CURATED_STOCK_IMAGES[niche] || CURATED_STOCK_IMAGES.motivation;

    const namesMap: Record<NicheType, string[]> = {
      motivation: ['Mindset Titan', 'Discipline & Destin', 'Le Réveil des Héros', 'Ascension Stoïque'],
      histoire: ['Chroniques Secrètes', 'L’Ombre du Passé', 'Mystères d’Empire', 'Archéo Frissons'],
      football: ['Tactique Royale', 'L’Œil du Ballon', 'Légendes du Terrain', 'Le Onze Décisif'],
      actualites: ['Géopolitique 360', 'L’Échiquier Mondial', 'Le Radar Actu', 'Décryptage Global'],
      education: ['Science Expliquée', 'Cosmos & Neurones', 'Le Savoir Minute', 'Eurêka Studio'],
      divertissement: ['Faits Incroyables', 'Le Détecteur de Fous', 'Records & Mystères', 'Top Viral'],
      business: ['L’Empire Moderne', 'Stratégie & Cashflow', 'Mastery Business', 'Investisseur Alpha'],
      technologie: ['Horizon IA', 'Future Tech Lab', 'Singularité 2026', 'Code & Silicium'],
      gaming: ['Lore Masters', 'L’Arène du Boss', 'Game Quest FR', 'Pixel & Gloire'],
      sante: ['Biohacking France', 'Vitalité & Longévité', 'Le Corps Intelligent', 'Énergie Pure'],
    };

    const names = namesMap[niche] || ['Studio Pro', 'Canal Alpha', 'Next Vision'];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const handle = `@${selectedName.replace(/[\s&’']/g, '')}Officiel`;

    const description = `Bienvenue sur ${selectedName} ! 🚀\nChaque semaine, nous explorons les meilleures idées en ${nicheData.label}.\n` +
      `Analyses percutantes, narrations immersives et vidéos hyper-réalistes générées avec Kling AI & Runway pour vous captiver.\n\n` +
      `🔔 Abonnez-vous et activez la cloche pour ne rien manquer !`;

    const avatarUrl = stockImages[0];
    const bannerUrl = stockImages[1] || stockImages[0];

    return {
      names,
      selectedName,
      handle,
      description,
      avatarUrl,
      bannerUrl,
      targetAudience: `Passionnés de ${nicheData.label}, curieux de 18-45 ans, francophones en quête de contenu de haute valeur.`,
      keywords: [selectedName, niche, 'intelligence artificielle', 'video youtube', 'shorts viral', 'kling ai']
    };
  }

  // 2. GENERATE FULL REALISTIC VIDEO SCRIPT (UP TO 3 MINUTES / 180s)
  static async generateScript(
    topic: string,
    niche: NicheType,
    format: VideoFormat,
    targetSeconds: number = 60,
    engineId: VideoEngineId = 'kling-v15',
    realism?: RealismSettings
  ): Promise<{
    title: string;
    description: string;
    tags: string[];
    scenes: Scene[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const stockImages = CURATED_STOCK_IMAGES[niche] || CURATED_STOCK_IMAGES.motivation;
    const stockVideos = CURATED_STOCK_VIDEOS[niche] || CURATED_STOCK_VIDEOS.motivation;
    const engine = AI_VIDEO_ENGINES.find(e => e.id === engineId) || AI_VIDEO_ENGINES[0];

    const hookTitles: Record<NicheType, string> = {
      motivation: `La vérité brutale que 99% des gens refusent d'entendre sur : ${topic}`,
      histoire: `L'énigme historique que personne n'a osé raconter : ${topic}`,
      football: `Comment ce secret a changé l'histoire du foot : ${topic}`,
      actualites: `Ce qui va secouer le monde dans les prochains mois : ${topic}`,
      education: `Ce que la science vient de révéler sur : ${topic}`,
      divertissement: `Top des faits les plus hallucinants sur : ${topic}`,
      business: `La stratégie exacte à 1 000 000 € cachée derrière : ${topic}`,
      technologie: `La révolution que personne n'a vue venir : ${topic}`,
      gaming: `Le secret le plus terrifiant caché dans : ${topic}`,
      sante: `Ce qui arrive à votre corps si vous appliquez : ${topic}`,
    };

    const isShort = format === 'short';
    const title = isShort
      ? `${topic} ⚡ (${engine.badge} - 4K)`
      : (hookTitles[niche] || topic);

    // Number of scenes based on target duration (from 30s up to 180s)
    let scenesCount = 4;
    let avgSceneDuration = 15;

    if (targetSeconds <= 30) {
      scenesCount = 3;
      avgSceneDuration = 10;
    } else if (targetSeconds <= 60) {
      scenesCount = 4;
      avgSceneDuration = 15;
    } else if (targetSeconds <= 90) {
      scenesCount = 6;
      avgSceneDuration = 15;
    } else if (targetSeconds <= 120) {
      scenesCount = 8;
      avgSceneDuration = 15;
    } else {
      // 180s = 3 minutes!
      scenesCount = 12;
      avgSceneDuration = 15;
    }

    const narrativeTemplates = [
      {
        part: 'Hook / Accroche',
        text: `Arrêtez tout. Ce que vous allez découvrir sur ${topic} bouleverse tout ce que l'on croyait savoir.`,
        cam: 'Dolly zoom rapide vers le sujet, éclairage néon dramatique, texture photoréaliste 4K.'
      },
      {
        part: 'Contexte choc',
        text: `Pendant des décennies, une erreur majeure a été répétée sans que personne ne s'en aperçoive.`,
        cam: 'Travelling latéral cinématique, 35mm anamorphique, flou d\'arrière-plan ultra-doux (bokeh).'
      },
      {
        part: 'Preuve et Révélation',
        text: `Regardez attentivement ce qui s'est passé lorsque cette règle fondamentale a été appliquée.`,
        cam: 'Plan aérien par drone en plongée lente avec reflets photoréalistes et particules volumétriques.'
      },
      {
        part: 'Démonstration détaillée',
        text: `Ceux qui maîtrisent ce principe obtiennent des résultats 10 fois supérieurs à la moyenne.`,
        cam: 'Gros plan macro avec lentille 85mm, expression humaine ultra-réaliste générée par Kling AI.'
      },
      {
        part: 'Tournant dramatique',
        text: `Mais attention : si vous négligez ce détail précis, tout votre travail s'effondre en quelques secondes.`,
        cam: 'Mouvement de caméra dynamique avec éclairage volumétrique et contraste cinéma.'
      },
      {
        part: 'Cas concret et secrets',
        text: `Voici l'exemple réel qui prouve que rien n'a été laissé au hasard par les experts.`,
        cam: 'Plan séquence fluide en 60fps, physique des matières et des mouvements ultra-naturelle.'
      },
      {
        part: 'Analyse approfondie',
        text: `Les données actuelles confirment un basculement historique vers ce nouveau modèle.`,
        cam: 'Panoramique 4K UHD avec textures hyper-détaillées et éclairage doré cinématique.'
      },
      {
        part: 'Stratégie pratique',
        text: `Pour appliquer cela dès aujourd'hui, vous devez suivre ces 3 étapes sans dévier d'un millimètre.`,
        cam: 'Zoom progressif immersif, atmosphère sombre avec néons violets et reflets réalistes.'
      },
      {
        part: 'Erreur à éviter',
        text: `La plupart abandonnent au moment précis où le résultat est à portée de main.`,
        cam: 'Caméra portée stabilisée style cinéma d\'action, réalisme saisissant des visages et décors.'
      },
      {
        part: 'Accélération finale',
        text: `C'est en comprenant ce mécanisme profond que vous prendrez une longueur d'avance définitive.`,
        cam: 'Mouvement circulaire à 360 degrés avec effet de vitesse et perspective hyper-dynamique.'
      },
      {
        part: 'Climax & Synthèse',
        text: `Retenez bien cette leçon : le succès appartient à ceux qui exécutent avec une discipline absolue.`,
        cam: 'Plan large héroïque au coucher de soleil, lumière naturelle volumétrique et netteté 4K.'
      },
      {
        part: 'Appel à l\'action',
        text: `Abonnez-vous à la chaîne pour recevoir les prochaines vidéos exclusives générées par l'IA !`,
        cam: 'Logo vibrant en relief holographique avec boutons d\'abonnement néon étincelants.'
      }
    ];

    const scenes: Scene[] = [];
    let elapsed = 0;

    for (let i = 0; i < scenesCount; i++) {
      const template = narrativeTemplates[i % narrativeTemplates.length];
      const isLast = i === scenesCount - 1;
      const duration = isLast ? (targetSeconds - elapsed) : avgSceneDuration;
      elapsed += duration;

      const imgIndex = i % stockImages.length;
      const vidIndex = i % stockVideos.length;

      // Realistic Kling/Runway AI visual prompt
      const visualPrompt = `[${engine.name}] ${template.cam} Scène : ${template.part} sur "${topic}". Photoréalisme 4K, 60fps, éclairage cinématique, rendu hyper-réaliste sans artefact.`;

      scenes.push({
        id: `sc-${Date.now()}-${i}`,
        order: i + 1,
        dialogue: template.text,
        visualPrompt,
        imageUrl: stockImages[imgIndex],
        videoUrl: stockVideos[vidIndex],
        durationSeconds: Math.max(duration, 5),
        subtitle: template.text,
        cameraMovement: template.cam
      });
    }

    const description = `🎥 Vidéo générée par IA avec le moteur ${engine.name} (${engine.qualityTag}) !\n\n` +
      `Sujet : ${topic}\n` +
      `⏱️ Durée : ${Math.floor(targetSeconds / 60)}m ${targetSeconds % 60}s\n\n` +
      `👉 Abonnez-vous pour ne rien rater des futures analyses !\n` +
      `#${niche} #youtube #klingai #runway #ia #viral`;

    const tags = [niche, engine.name.toLowerCase(), 'kling ai', 'runway gen 3', 'youtube ai studio', 'shorts viral', topic.slice(0, 20)];

    return {
      title,
      description,
      tags,
      scenes
    };
  }

  // 3. THUMBNAIL CONFIG
  static generateThumbnailConfig(title: string, niche: NicheType): ThumbnailData {
    const stockImages = CURATED_STOCK_IMAGES[niche] || CURATED_STOCK_IMAGES.motivation;
    const cleanTitle = title.split(':')[0].toUpperCase().slice(0, 32);

    const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    const accent = colors[Math.floor(Math.random() * colors.length)];

    return {
      titleText: cleanTitle,
      subText: '100% RÉALISTE • KLING AI',
      badgeText: '4K VIRAL',
      bgImageUrl: stockImages[0],
      accentColor: accent,
      textColor: '#ffffff',
      layout: 'bold-left'
    };
  }

  // 4. SPEECH SYNTHESIS (Browser Web Speech API)
  static speakScene(text: string, voiceSettings: VoiceSettings): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = voiceSettings.speed || 1.0;
      utterance.pitch = voiceSettings.pitch || 1.0;

      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find(v => v.lang.startsWith('fr') && (voiceSettings.gender === 'female' ? v.name.includes('female') || v.name.includes('Hortense') || v.name.includes('Julie') : true)) 
        || voices.find(v => v.lang.startsWith('fr'));

      if (frVoice) {
        utterance.voice = frVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  static stopSpeech(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}
