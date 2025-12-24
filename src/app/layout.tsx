import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import ThemeToggle from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FitCoach AI - Your Personal Fitness Assistant',
  description: 'Get personalized workout and nutrition plans powered by artificial intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="min-h-screen bg-background antialiased">
        <Header />
        <ThemeToggle />
        {children}
        <Toaster />
      </body>
    </html>
  );
}