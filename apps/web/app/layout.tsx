import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@/providers/clerk-provider";
import { Space_Mono } from "next/font/google";
import { RootProvider } from "@/providers/root-provider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

import "../styles/globals.css";
import { site } from "@/configs/site";

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={spaceMono.className}>
          <RootProvider>{children}</RootProvider>
          <Toaster position="bottom-left" />
          <GoogleAnalytics gaId="G-PP6B6F1C3D" />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
