import './globals.css';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Witellikerstrasse 20 - Modern Student Living in Zurich',
  description: 'Experience the vibrant student life at Witellikerstrasse 20, featuring real-time transport information from Balgrist station and daily stories from our community.',
  keywords: 'student housing, Zurich, Balgrist, Witellikerstrasse, WG, student life',
  openGraph: {
    title: 'Witellikerstrasse 20 - Modern Student Living in Zurich',
    description: 'Experience the vibrant student life at Witellikerstrasse 20',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-gray-900">
        {children}
      </body>
    </html>
  );
}
