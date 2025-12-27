import './globals.css'

export const metadata = {
  title: 'Calendar Upload',
  description: 'Upload and view monthly calendars',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script defer data-domain="azaleareport.com" src="https://plausible.io/js/script.js"></script>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
} 