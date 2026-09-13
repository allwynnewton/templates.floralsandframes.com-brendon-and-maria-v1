import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Pinyon_Script } from 'next/font/google';
import './globals.css';
import { couple, wedding } from '@/lib/site';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

const script = Pinyon_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://templates.floralsandframes.com'),
  title: `${couple.groom} & ${couple.bride} · ${wedding.dateShort}`,
  description: `Together with their families, ${couple.groom} and ${couple.bride} invite you to celebrate their wedding — ${wedding.dateLabel}, ${wedding.city}.`,
  openGraph: {
    title: `${couple.groom} & ${couple.bride}`,
    description: `Together with their families, ${couple.groom} and ${couple.bride} invite you to celebrate their wedding — ${wedding.dateLabel}, ${wedding.city}.`,
    url: 'https://templates.floralsandframes.com',
    siteName: `${couple.groom} & ${couple.bride}`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${couple.groom} & ${couple.bride} · ${wedding.dateShort}`,
    description: `Together with their families, ${couple.groom} and ${couple.bride} invite you to celebrate their wedding — ${wedding.dateLabel}, ${wedding.city}.`,
  },
};

export const viewport: Viewport = {
  themeColor: '#F8F6EF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${script.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
