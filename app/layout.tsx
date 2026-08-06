import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Housal Agency — Create. Mark. Impact.',
  description: 'Agence de branding & communication basée à Agadir, Maroc.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}