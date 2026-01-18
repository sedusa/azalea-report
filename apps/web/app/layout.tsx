import type { Metadata } from 'next';
import './globals.css';
import { ConvexClientProvider } from '../convex/ConvexClientProvider';

export const metadata: Metadata = {
  title: 'Azalea Report',
  description: 'The official newsletter of the SGMC Internal Medicine Residency Program',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
