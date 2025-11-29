import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StreamPay - Real-time Payment Streaming',
  description: 'True per-second money flows on Somnia blockchain with real-time updates',
  keywords: 'blockchain, streaming, payments, somnia, defi, real-time',
  authors: [{ name: 'StreamPay Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
