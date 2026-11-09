import type { Metadata } from 'next';
import './globals.css';
import ClientShell from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'YouTube AI Studio - Création & Publication Automatisée de Vidéos',
  description: "Plateforme SaaS intelligente pour créer des chaînes YouTube, générer des vidéos avec l'IA et automatiser leur publication.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-studio-dark text-zinc-100 antialiased flex flex-col justify-between selection:bg-violet-600 selection:text-white">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}