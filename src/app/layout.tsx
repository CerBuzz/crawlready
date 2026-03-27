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
  title: "CrawlReady — Is Your Website Ready for AI Agents?",
  description:
    "Free AI Readiness Scanner. Check if your website is optimized for AI crawlers, LLM citations, and agentic commerce. Get your score in 30 seconds.",
  openGraph: {
    title: "CrawlReady — Is Your Website Ready for AI Agents?",
    description:
      "Free AI Readiness Scanner. Check if your website is optimized for AI crawlers, LLM citations, and agentic commerce.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
