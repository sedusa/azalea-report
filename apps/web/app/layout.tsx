import type { Metadata } from 'next';
import './globals.css';
import { ConvexClientProvider } from '../convex/ConvexClientProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://azaleareport.com'),
  title: {
    default: 'Azalea Report - SGMC Health IM Residency Newsletter',
    template: '%s | Azalea Report',
  },
  description: 'The official newsletter of the SGMC Internal Medicine Residency Program',
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
