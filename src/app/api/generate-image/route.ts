import { NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const query = encodeURIComponent(prompt);

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=squarish`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Unsplash API failed');
    }

    const data = await res.json();

    const imageUrl =
      data.results?.[0]?.urls?.regular ||
      null;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Unsplash image error:', error);
    return NextResponse.json(
      { imageUrl: null },
      { status: 500 }
    );
  }
}
