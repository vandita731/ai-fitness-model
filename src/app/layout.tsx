import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import ThemeToggle from '@/components/ThemeToggle';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitCoach AI - Your Personal Fitness Assistant",
  description: "Get AI-powered personalized fitness and nutrition plans tailored to your goals",
  keywords: ["fitness", "AI", "workout", "nutrition", "health", "diet plan"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldBeDark = theme === 'dark' || (!theme && systemPrefersDark);
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                  
                  document.documentElement.style.colorScheme = shouldBeDark ? 'dark' : 'light';
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="custom-scrollbar">
        <Header />
        <ThemeToggle />
        {children}
        <Toaster 
          position="bottom-right" 
          richColors 
          closeButton
          toastOptions={{
            className: 'card-elevated',
          }}
        />
      </body>
    </html>
  );
}