import { NicheType, VoiceSettings, MusicTrack, VideoEngine } from '@/types';

export const NICHES: {
  id: NicheType;
  label: string;
  emoji: string;
  description: string;
  color: string;
  suggestedTopics: string[];
}[] = [
  {
    id: 'motivation',
    label: 'Motivation & Mindset',
    emoji: '🔥',
    description: 'Discours inspirants, discipline, succès et psychologie de la réussite.',
    color: 'from-amber-500 to-orange-600',
    suggestedTopics: [
      'La règle des 5 secondes pour stopper la procrastination',
      'Pourquoi 99% des gens abandonnent trop tôt',
      'Le secret des moines stoïciens pour une paix totale',
      'Réveillez le lion en vous : 10 minutes pour changer d’état d’esprit',
    ]
  },
  {
    id: 'histoire',
    label: 'Histoire & Mystères',
    emoji: '🏛️',
    description: 'Grandes batailles, civilisations disparues et énigmes du passé.',
    color: 'from-amber-700 to-yellow-600',
    suggestedTopics: [
      'Ce que les archéologues ont vraiment découvert sous le Sphinx',
      'L’empire romain face à sa plus terrifiante embuscade',
      'La cité engloutie que la science commence à peine à comprendre',
      'Les armes secrètes oubliées de l’Antiquité',
    ]
  },
  {
    id: 'football',
    label: 'Football & Sports',
    emoji: '⚽',
    description: 'Analyses de matchs, destins de légendes et histoires méconnues du sport.',
    color: 'from-emerald-500 to-green-700',
    suggestedTopics: [
      'L’ascension fulgurante de la nouvelle pépite mondiale',
      'Le match où un joueur a changé l’histoire de la Ligue des Champions',
      'Comment cette tactique secrète a terrassé les géants d’Europe',
      'Le sacrifice ultime pour remporter le Ballon d’Or',
    ]
  },
  {
    id: 'actualites',
    label: 'Actualités & Géopolitique',
    emoji: '🌍',
    description: 'Décryptage clair des enjeux géopolitiques et tendances mondiales.',
    color: 'from-blue-600 to-indigo-800',
    suggestedTopics: [
      'La course mondiale pour le contrôle des puces d’IA',
      'Nouvelle route commerciale : le séisme économique mondial',
      'Pourquoi ce détroit maritime peut paralyser l’économie en 24h',
      'Les grandes puissances et la guerre invisible de l’espace',
    ]
  },
  {
    id: 'education',
    label: 'Éducation & Science',
    emoji: '🧬',
    description: 'Sciences vulgarisées, astronomie, biologie et découvertes fascinantes.',
    color: 'from-cyan-500 to-blue-600',
    suggestedTopics: [
      'Que se passerait-il si la Terre s’arrêtait de tourner pendant 1 seconde ?',
      'Le télescope James Webb vient de bousculer la physique moderne',
      'L’incroyable pouvoir secret du cerveau humain pendant le sommeil',
      'Comment fonctionne la fusion nucléaire : l’énergie infinie ?',
    ]
  },
  {
    id: 'divertissement',
    label: 'Divertissement & Faits Insolites',
    emoji: '🎭',
    description: 'Faits surprenants, records fous et tops viraux captivants.',
    color: 'from-fuchsia-500 to-purple-600',
    suggestedTopics: [
      '10 objets ordinaires qui valent désormais une fortune',
      'Les coïncidences les plus étranges et terrifiantes de l’histoire',
      'Les animaux aux super-pouvoirs qui défient l’imagination',
      'Ces erreurs monumentales qui ont fait gagner des milliards',
    ]
  },
  {
    id: 'business',
    label: 'Business & Finance',
    emoji: '💼',
    description: 'Entrepreneuriat, investissements, stratégies de richesse et analyses de marques.',
    color: 'from-emerald-600 to-teal-700',
    suggestedTopics: [
      'Comment cette entreprise a détruit son concurrent en 3 mois',
      '5 sources de revenus passifs automatisés avec l’intelligence artificielle',
      'La stratégie psychologique cachée derrière le pricing de luxe',
      'Pourquoi les millionnaires ne gardent jamais leur argent en banque',
    ]
  },
  {
    id: 'technologie',
    label: 'Technologie & IA',
    emoji: '🤖',
    description: 'Nouvelles technologies, modèles d’IA de pointe, gadgets et robotique.',
    color: 'from-purple-500 to-indigo-600',
    suggestedTopics: [
      'Les nouveaux agents IA autonomes qui remplacent des départements entiers',
      'L’ordinateur quantique vient de franchir un cap historique',
      'Top 7 des outils d’IA révolutionnaires que vous devez tester cette semaine',
      'L’impact du futur robot humanoïde sur la vie quotidienne',
    ]
  },
  {
    id: 'gaming',
    label: 'Gaming & Esports',
    emoji: '🎮',
    description: 'Lore de jeux vidéo, easter eggs, sorties majeures et records esports.',
    color: 'from-red-500 to-rose-700',
    suggestedTopics: [
      'L’histoire secrète et tragique derrière la création de ce chef-d’œuvre',
      'Le boss le plus difficile de l’histoire du jeu vidéo et comment il fut battu',
      'Ce mystère caché dans la map pendant 10 ans sans être trouvé',
      'L’évolution graphique hallucinante des jeux ces 20 dernières années',
    ]
  },
  {
    id: 'sante',
    label: 'Santé & Bien-être',
    emoji: '🥗',
    description: 'Biohacking, longévité, nutrition saine et sommeil réparateur.',
    color: 'from-teal-400 to-emerald-600',
    suggestedTopics: [
      'Ce qui arrive à votre corps après 14 jours de jeûne intermittent',
      'Le rituel du matin des sportifs d’élite pour doubler son énergie',
      '3 aliments courants qui détruisent votre concentration sans que vous le sachiez',
      'La technique de respiration validée par les neuroscientifiques contre le stress',
    ]
  }
];

export const VOICE_PRESETS: VoiceSettings[] = [
  {
    voiceId: 'fr-FR-Neural-Marc',
    voiceName: 'Marc - Voix virale captivante',
    gender: 'male',
    speed: 1.05,
    pitch: 0.95,
    emotion: 'energetic'
  },
  {
    voiceId: 'fr-FR-Neural-Sarah',
    voiceName: 'Sarah - Narratrice immersive',
    gender: 'female',
    speed: 1.0,
    pitch: 1.0,
    emotion: 'dramatic'
  },
  {
    voiceId: 'fr-FR-Neural-Alex',
    voiceName: 'Alex - Dynamique & moderne',
    gender: 'male',
    speed: 1.1,
    pitch: 1.05,
    emotion: 'energetic'
  },
  {
    voiceId: 'fr-FR-Neural-Elena',
    voiceName: 'Elena - Éducation & Savoir',
    gender: 'female',
    speed: 0.98,
    pitch: 1.0,
    emotion: 'calm'
  }
];

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'track-epic-motivation',
    name: 'Rising Titan (Épique & Puissant)',
    category: 'Cinématique',
    url: 'https://cdn.freesound.org/previews/518/518305_5674468-lq.mp3',
    bpm: 128
  },
  {
    id: 'track-lofi-beats',
    name: 'Midnight Study (Lofi Chill)',
    category: 'Relax',
    url: 'https://cdn.freesound.org/previews/568/568856_11861866-lq.mp3',
    bpm: 85
  },
  {
    id: 'track-cyber-pulse',
    name: 'Neon Horizon (Synthwave & Tech)',
    category: 'High-Tech',
    url: 'https://cdn.freesound.org/previews/612/612081_11861866-lq.mp3',
    bpm: 130
  },
  {
    id: 'track-dark-mystery',
    name: 'Shadows of History (Mystère & Tension)',
    category: 'Enquête',
    url: 'https://cdn.freesound.org/previews/495/495005_10743230-lq.mp3',
    bpm: 90
  }
];

export const CURATED_STOCK_IMAGES: Record<NicheType, string[]> = {
  motivation: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
  ],
  histoire: [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
  ],
  football: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1200&auto=format&fit=crop',
  ],
  actualites: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop',
  ],
  education: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1200&auto=format&fit=crop',
  ],
  divertissement: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
  ],
  business: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop',
  ],
  technologie: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
  ],
  gaming: [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
  ],
  sante: [
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
  ]
};

export const AI_VIDEO_ENGINES: VideoEngine[] = [
  {
    id: 'kling-v15',
    name: 'Kling AI v1.5 Pro',
    badge: 'LE PLUS RÉALISTE',
    provider: 'Kuaishou Kling',
    description: 'Moteur phare pour un photoréalisme bluffant, physique humaine exacte et fluidité cinématographique.',
    realismScore: '9.9 / 10',
    cameraControl: true,
    maxFps: 60,
    qualityTag: '4K Ultra-HDR'
  },
  {
    id: 'kling-v2',
    name: 'Kling AI 2.0 Turbo',
    badge: 'PROCHAINE GÉNÉRATION',
    provider: 'Kuaishou Kling',
    description: 'Génération instantanée en haute définition, gestion parfaite des éclairages et des reflets.',
    realismScore: '9.8 / 10',
    cameraControl: true,
    maxFps: 60,
    qualityTag: 'Cinema 35mm'
  },
  {
    id: 'runway-gen3',
    name: 'Runway Gen-3 Alpha',
    badge: 'STANDARD HOLLYWOOD',
    provider: 'RunwayML',
    description: 'Moteur de référence pour les travelling caméra, plans de drone et dynamisme cinématique.',
    realismScore: '9.7 / 10',
    cameraControl: true,
    maxFps: 60,
    qualityTag: 'Hollywood 4K'
  },
  {
    id: 'luma-dream',
    name: 'Luma Dream Machine 1.5',
    badge: 'HYPER-DYNAMIQUE',
    provider: 'Luma AI',
    description: 'Spécialisé dans l’action rapide, le morphing fluide et les transitions dimensionnelles immersives.',
    realismScore: '9.6 / 10',
    cameraControl: true,
    maxFps: 60,
    qualityTag: 'Action 60fps'
  },
  {
    id: 'sora-turbo',
    name: 'OpenAI Sora Turbo',
    badge: 'PHYSIQUE RÉELLE',
    provider: 'OpenAI',
    description: 'Compréhension du monde physique réel, cohérence des objets et des personnages sur de longues durées.',
    realismScore: '9.9 / 10',
    cameraControl: true,
    maxFps: 60,
    qualityTag: 'Physique Réelle'
  },
  {
    id: 'veo-2',
    name: 'Google Veo 2',
    badge: 'DEEPMIND CINEMA',
    provider: 'Google DeepMind',
    description: 'Modèle de pointe de Google pour la cohérence visuelle, le respect des prompts et la profondeur de champ.',
    realismScore: '9.8 / 10',
    cameraControl: true,
    maxFps: 60,
    qualityTag: 'DeepMind 4K'
  }
];

export const DURATION_OPTIONS = [
  { seconds: 30, label: '30 sec', description: 'Accroche virale ultra-rapide', scenesCount: 3 },
  { seconds: 60, label: '1 minute (60s)', description: 'Format Shorts Standard', scenesCount: 5 },
  { seconds: 90, label: '1 min 30 (90s)', description: 'Nouveau format YouTube Shorts étendu', scenesCount: 7 },
  { seconds: 120, label: '2 minutes (120s)', description: 'Récit immersif & narration approfondie', scenesCount: 9 },
  { seconds: 180, label: '3 minutes (180s)', description: 'Durée Maximale Shorts & Vidéo Longue', scenesCount: 12 },
];

export const CURATED_STOCK_VIDEOS: Record<NicheType, string[]> = {
  motivation: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  ],
  histoire: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  ],
  football: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  ],
  actualites: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  ],
  education: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  ],
  divertissement: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  ],
  business: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  ],
  technologie: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  ],
  gaming: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  ],
  sante: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  ]
};
