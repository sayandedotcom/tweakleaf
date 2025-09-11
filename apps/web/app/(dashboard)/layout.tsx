"use client";

import { TweakSidebar } from "@/components/tweak-sidebar";
import { TweakHeader } from "@/components/tweak-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TweakSidebar />
      <SidebarInset>
        {/* <TweakHeader /> */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
