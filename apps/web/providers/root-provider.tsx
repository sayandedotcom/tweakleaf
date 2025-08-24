"use client";

import Navbar from "@/components/navbar";
import { showNabarRoutes } from "@/configs/show-nabar-routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
// import { ThemeProvider } from "./theme-provider";
import { Notifications } from "@/components/natofications";

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
      {children}
      {showNabarRoutes.includes(pathname) && <Footer />}
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
