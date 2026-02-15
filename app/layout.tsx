import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Raphael José Giampietro Fiuza Pequeno | Advocacia São Paulo",
    template: "%s | R. Giampietro Fiuza Pequeno Advocacia",
  },
  description:
    "Advocacia de excelência em São Paulo. Áreas: JEC, Consumidor e Criminal. Conteúdo meramente informativo (OAB).",
  keywords: ["advogado", "São Paulo", "JEC", "consumidor", "criminal", "OAB"],
  authors: [{ name: "Raphael José Giampietro Fiuza Pequeno" }],
  openGraph: { type: "website" },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
