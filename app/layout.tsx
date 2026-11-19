import './globals.css';
import type { ReactNode } from 'react';
import IntroReveal from '@/components/IntroReveal';
import HoloEffects from '@/components/HoloEffects';

export const metadata = {
  title: 'Housal Studio — Create. Mark. Impact.',
  description: 'Housal Studio — studio de branding, création de contenu et sites web à Agadir, Maroc.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <IntroReveal />
        <HoloEffects />
        {children}
      </body>
    </html>
  );
}