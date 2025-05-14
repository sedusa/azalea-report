import './globals.css'

export const metadata = {
  title: 'Calendar Upload',
  description: 'Upload and view monthly calendars',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
} 