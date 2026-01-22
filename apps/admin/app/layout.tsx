import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ConvexClientProvider } from '../convex/ConvexClientProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Azalea Report Admin - CMS',
  description: 'Content Management System for the Azalea Report',
  openGraph: {
    title: 'Azalea Report Admin',
    description: 'Content Management System for the SGMC Health IM Residency Newsletter',
    url: 'https://admin.azaleareport.com',
    siteName: 'Azalea Report Admin',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
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
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">{children}</div>
              <footer
                className="py-3 text-center text-xs border-t"
                style={{
                  backgroundColor: 'rgb(var(--bg-secondary))',
                  borderColor: 'rgb(var(--border-primary))',
                  color: 'rgb(var(--text-tertiary))',
                }}
              >
                Maintained by Samuel Edusa, MD
              </footer>
            </div>
            <Toaster position="bottom-right" richColors />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
