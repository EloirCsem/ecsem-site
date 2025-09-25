import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "C-SEM",
  description: "Site oficial da C-SEM",
  icons: {
    icon: "/logo-icon.png",   // favicon
    apple: "/logo-icon.png",  // ícone para Apple devices
  },
};

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