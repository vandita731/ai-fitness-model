import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ imageUrl: null }, { status: 400 });
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.error('Missing UNSPLASH_ACCESS_KEY');
      return NextResponse.json({ imageUrl: null }, { status: 500 });
    }

    // 🔥 IMPORTANT: make query Unsplash-friendly
    const query = encodeURIComponent(prompt.split(',')[0].trim());

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=squarish`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
          'User-Agent': 'ai-fitness-coach-vercel',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('Unsplash error:', res.status, text);
      return NextResponse.json({ imageUrl: null }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json({
      imageUrl: data?.results?.[0]?.urls?.regular ?? null,
    });
  } catch (error) {
    console.error('Generate image error:', error);
    return NextResponse.json({ imageUrl: null }, { status: 500 });
  }
}
