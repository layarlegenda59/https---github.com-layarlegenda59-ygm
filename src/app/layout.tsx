import type { Metadata } from 'next';
import './globals.css';
import { ToasterProvider } from '@/components/providers/toaster-provider';

export const metadata: Metadata = {
  title: 'YGM',
  description: 'Sistem Manajemen dan Notifikasi Debitur',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
