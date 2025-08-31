"use client";

import Navbar from "@/components/navbar";
import { showNabarRoutes } from "@/configs/show-nabar-routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
// import { ThemeProvider } from "./theme-provider";
import { Notifications } from "@/components/natofications";
import { Suspense } from "react";
import { Loader } from "@/components/loader";

export function RootProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const pathname = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      > */}
      {showNabarRoutes.includes(pathname) && (
        <>
          <Notifications />
          <Navbar />
        </>
      )}
      <Suspense fallback={<Loader />}>{children}</Suspense>
      {showNabarRoutes.includes(pathname) && <Footer />}
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
