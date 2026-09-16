import type { Metadata } from "next";
import { Geist_Mono, Kanit } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kanit = Kanit({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "Valorant Daily Store Checker",
  description: "Daily Store For {Name} Remaining - Live Valorant store rotation checker by @peerap0nn_",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Valorant Store",
  },
  icons: {
    apple: "/logo.jpg",
  },
};

export const viewport: import('next').Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#080c10',
};

import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${kanit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080c10] text-[#ece8e1] font-bold">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
