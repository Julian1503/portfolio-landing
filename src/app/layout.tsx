import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import {SmoothScroll} from "@/components/SmoothScroll";
import {CustomCursor} from "@/components/CustomCursor";
import {SITE_METADATA} from "@/lib/config/siteMetadata";
import { getTheme } from "@/lib/theme/public";
import { generateThemeCSS } from "@/lib/theme/utils";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch theme tokens server-side to avoid flash
  const theme = await getTheme();
  const themeCSS = generateThemeCSS(theme);

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
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
