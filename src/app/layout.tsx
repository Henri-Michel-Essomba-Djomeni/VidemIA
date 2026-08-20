import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VidemIA",
  description: "Génération automatique de vidéos éducatives par IA — Powered by nOX-00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
