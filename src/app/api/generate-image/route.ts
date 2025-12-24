import { NextRequest, NextResponse } from 'next/server';

// Option 1: Using Replicate (original method)
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: {
          prompt: `High quality, realistic photo of ${prompt}, professional photography, 4k`,
          negative_prompt: 'cartoon, anime, drawing, low quality, blurry, distorted',
        },
      }),
    });

    const prediction = await response.json();

    // Poll for result
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 60; // Increased timeout

    while (!imageUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        }
      );

      const status = await statusResponse.json();
      
      if (status.status === 'succeeded') {
        imageUrl = status.output[0];
      } else if (status.status === 'failed') {
        throw new Error('Image generation failed');
      }
      
      attempts++;
    }

    if (!imageUrl) {
      throw new Error('Image generation timed out');
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Option 2: Using Unsplash as fallback (free, no API key needed for basic use)
// Uncomment this if you want to use Unsplash instead
/*
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    // Extract keywords from prompt
    const keywords = prompt.split(' ').slice(0, 3).join(',');
    
    const response = await fetch(
      `https://source.unsplash.com/800x800/?${keywords}`,
      { redirect: 'follow' }
    );

    return NextResponse.json({ imageUrl: response.url });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
*/