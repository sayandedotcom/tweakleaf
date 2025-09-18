import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { LogoSidebar } from "@/components/logo-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ModelSwitcher } from "./models-switcher";
import { NavFileUploads } from "./nav-file-uploads";
import { NavSavedFiles } from "./nav-saved-files";
import { Suspense } from "react";
import { Loader } from "./loader";

export function TweakSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoSidebar />
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<Loader />}>
          <NavProjects />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <NavMain />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <ModelSwitcher />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <NavSavedFiles />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <NavFileUploads />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<Loader />}>
          <NavUser />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
