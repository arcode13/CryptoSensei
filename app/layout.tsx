import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CryptoSensei - AI Crypto Education Agent",
  description:
    "Meet Sensei, your AI-powered crypto education companion. Learn Bitcoin, DeFi, ETFs, and all things Web3 with an intelligent guide that makes complex concepts simple.",
  keywords: [
    "crypto education",
    "AI crypto",
    "bitcoin learning",
    "DeFi explained",
    "Web3 guide",
    "investment education",
  ],
  openGraph: {
    title: "CryptoSensei - AI Crypto Education Agent",
    description: "Your AI-powered crypto education companion. Learn Web3 with Sensei.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-dark-900 text-white`}>
        {children}
      </body>
    </html>
  );
}
