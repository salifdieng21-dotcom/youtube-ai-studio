import { NextResponse } from 'next/server';
import { NicheType, VideoFormat } from '@/types';

export async function POST(req: Request) {
  try {
    const { topic, niche, format } = await req.json();

    if (!topic || !niche) {
      return NextResponse.json({ error: 'Topic and niche are required' }, { status: 400 });
    }

    const title = format === 'short' 
      ? `${topic} ⚡ (Le secret révélé)` 
      : `Ce que personne ne vous dit sur : ${topic}`;

    return NextResponse.json({
      success: true,
      title,
      description: `Découvrez tout ce qu'il faut savoir sur ${topic}.\n\n#${niche} #youtube #ia`,
      tags: [niche, 'youtube ai', 'short', topic.slice(0, 20)],
      scenesCount: format === 'short' ? 4 : 5
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}
