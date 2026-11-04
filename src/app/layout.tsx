import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ecos da Era dos Heróis',
  description: 'Um RPG de fantasia sobre os ecos que a história deixa para trás.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
