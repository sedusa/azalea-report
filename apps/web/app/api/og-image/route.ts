import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const DEFAULT_OG_IMAGE = 'https://azaleareport.com/img/og.jpeg';

export async function GET() {
  try {
    const latestIssue = await convex.query(api.issues.getLatestPublished);
    const imageUrl = (latestIssue as any)?.bannerImageUrl || DEFAULT_OG_IMAGE;

    // Fetch the image from the source
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'AzaleaReport-OGProxy/1.0',
      },
    });

    if (!imageResponse.ok) {
      // Fallback to default OG image
      const fallbackResponse = await fetch(DEFAULT_OG_IMAGE);
      const fallbackBuffer = await fallbackResponse.arrayBuffer();
      return new NextResponse(fallbackBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await imageResponse.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    // On any error, redirect to static fallback
    return NextResponse.redirect(DEFAULT_OG_IMAGE, 302);
  }
}
