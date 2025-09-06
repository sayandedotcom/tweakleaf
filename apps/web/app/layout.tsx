import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@/providers/clerk-provider";
import { Space_Mono } from "next/font/google";
import { RootProvider } from "@/providers/root-provider";
import { Toaster } from "@/components/ui/sonner";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Tweak",
  description: "Tweak is a platform for creating and sharing videos.",
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
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
