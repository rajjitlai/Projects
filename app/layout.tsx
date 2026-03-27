import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rajjitlai.github.io/Projects";
const siteTitle = "Rajjit Laishram — Projects";
const siteDescription =
  "A curated showcase of development projects by Rajjit Laishram, covering web development, systems, and open-source work.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Rajjit Laishram",
  },
  description: siteDescription,
  keywords: [
    "Rajjit Laishram",
    "projects",
    "portfolio",
    "web development",
    "Next.js",
    "TypeScript",
    "open source",
  ],
  authors: [{ name: "Rajjit Laishram", url: siteUrl }],
  creator: "Rajjit Laishram",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "Rajjit Laishram — Projects",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@rajjitlai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
