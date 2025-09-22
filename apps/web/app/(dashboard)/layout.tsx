import { Loader } from "@/components/loader";
import { TweakSidebar } from "@/components/tweak-sidebar";
// import { TweakHeader } from "@/components/tweak-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<Loader />}>
        <TweakSidebar />
      </Suspense>
      <SidebarInset>
        {/* <TweakHeader /> */}
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
