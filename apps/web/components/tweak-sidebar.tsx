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
import { Button } from "./ui/button";
import Link from "next/link";
import { Phone } from "lucide-react";

export function TweakSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Suspense fallback={<Loader />}>
          <LogoSidebar />
        </Suspense>
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
          <Button variant="ghost" className="w-full px-3">
            <Link
              href="https://x.com/sayandedotcom"
              target="_blank"
              className="flex items-start justify-start gap-2"
            >
              <Phone />
              Help / Feedback
            </Link>
          </Button>
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
