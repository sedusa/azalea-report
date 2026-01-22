import type { Metadata } from 'next';
import './globals.css';
import { ConvexClientProvider } from '../convex/ConvexClientProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'Azalea Report - SGMC Health IM Residency Newsletter',
  description: 'The official newsletter of the SGMC Internal Medicine Residency Program',
  openGraph: {
    title: 'Azalea Report',
    description: 'SGMC Health IM Residency Newsletter',
    url: 'https://azaleareport.com',
    siteName: 'Azalea Report',
    images: [
      {
        url: 'https://azaleareport.com/img/og.jpeg',
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
    images: ['https://azaleareport.com/img/og-twitter.jpeg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <ConvexClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
