import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Venkatesh Pamudurti | Full Stack Developer',
  description: 'Futuristic developer portfolio showcasing full-stack expertise and AI passion.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${outfit.variable} scroll-smooth`}>
      <body className="bg-[#050505] text-white antialiased selection:bg-neon-blue/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
