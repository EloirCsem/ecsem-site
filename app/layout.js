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
};


export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logo-icon.png" />
        <link rel="apple-touch-icon" href="/logo-icon.png" />
        <meta name="theme-color" content="#1E40AF" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}