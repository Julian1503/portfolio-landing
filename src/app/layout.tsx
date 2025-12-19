import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import {SmoothScroll} from "@/components/SmoothScroll";
import {CustomCursor} from "@/components/CustomCursor";
import {SITE_METADATA} from "@/lib/config/siteMetadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
    weight: ['400', '500', '600', '700'],
    variable: '--font-montserrat',
    subsets: ['latin'],
});

export const metadata: Metadata = SITE_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${montserrat.variable} ${geistMono.variable} antialiased`}
      >
      <CustomCursor/>
      <SmoothScroll/>
        {children}
      </body>
    </html>
  );
}
