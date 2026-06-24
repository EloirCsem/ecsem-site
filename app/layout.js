import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";


export const metadata = {
  title: "C-SEM Gestão | Sistema de Gestão de Ordens de Serviço e Manutenção",
  description: "Plataforma profissional para assistência técnica e manutenção. Centralize ordens de serviço, equipes técnicas, relatórios e indicadores em tempo real.",
  keywords: [
    "gestão de ordens de serviço", 
    "gestão de manutenção", 
    "sistema para assistência técnica", 
    "controle de técnicos", 
    "software de manutenção preditiva",
    "c-sem gestão"
  ],
  openGraph: {
    title: "C-SEM Gestão | Gestão de Ordens de Serviço",
    description: "Centralize sua operação, acompanhe equipes em campo e tenha indicadores em tempo real.",
    url: "https://ecsem.com.br",
    siteName: "C-SEM Gestão",
    images: [
      {
        url: "/logo.png", // Imagem que aparece quando compartilha no WhatsApp
        width: 800,
        height: 600,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Vercel Analytics para monitorar visitas */}
        <Analytics />
      </body>
    </html>
  );
}