import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laboratório 01 — Leitor de Prints",
  description:
    "Aplicação para extrair conteúdo de capturas de tela e organizar os dados em formato estruturado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
