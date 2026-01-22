import type { Metadata } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@convex/_generated/api';
import HomePageClient from './HomePageClient';

// Create a Convex HTTP client for server-side fetching
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Default OG image fallback
const DEFAULT_OG_IMAGE = 'https://azaleareport.com/img/og.jpeg';

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch the latest published issue server-side
    const latestIssue = await convex.query(api.issues.getLatestPublished);

    // Use banner image if available, otherwise use default
    const ogImage = (latestIssue as any)?.bannerImageUrl || DEFAULT_OG_IMAGE;

    // Dynamic title with edition info
    const title = latestIssue
      ? `Azalea Report - Edition ${latestIssue.edition}`
      : 'Azalea Report - SGMC Health IM Residency Newsletter';

    const description = latestIssue?.bannerTitle
      ? `${latestIssue.bannerTitle} - SGMC Health IM Residency Newsletter`
      : 'The official newsletter of the SGMC Internal Medicine Residency Program';

    return {
      title,
      description,
      openGraph: {
        title: latestIssue?.bannerTitle || 'Azalea Report',
        description: 'SGMC Health IM Residency Newsletter',
        url: 'https://azaleareport.com',
        siteName: 'Azalea Report',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: latestIssue?.bannerTitle || 'Azalea Report',
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: latestIssue?.bannerTitle || 'Azalea Report',
        description: 'SGMC Health IM Residency Newsletter',
        images: [ogImage],
      },
    };
  } catch (error) {
    // Fallback metadata if fetching fails
    console.error('Error fetching metadata:', error);
    return {
      title: 'Azalea Report - SGMC Health IM Residency Newsletter',
      description: 'The official newsletter of the SGMC Internal Medicine Residency Program',
      openGraph: {
        title: 'Azalea Report',
        description: 'SGMC Health IM Residency Newsletter',
        url: 'https://azaleareport.com',
        siteName: 'Azalea Report',
        images: [
          {
            url: DEFAULT_OG_IMAGE,
            width: 1200,
            height: 630,
            alt: 'Azalea Report',
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Azalea Report',
        description: 'SGMC Health IM Residency Newsletter',
        images: [DEFAULT_OG_IMAGE],
      },
    };
  }
}

export default function HomePage() {
  return <HomePageClient />;
}
