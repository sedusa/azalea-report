import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ConvexClientProvider } from '../convex/ConvexClientProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Azalea Report Admin',
  description: 'Content Management System for the Azalea Report',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ConvexClientProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
