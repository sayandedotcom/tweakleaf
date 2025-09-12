"use client";

// import { Plus } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { LogoSidebar } from "@/components/logo-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarGroup,
  // SidebarGroupLabel,
  SidebarHeader,
  // SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { navigation } from "@/configs/navigation";
// import { useRouter, useSearchParams } from "next/navigation";
import { ModelSwitcher } from "./models-switcher";
// import { AlertDialogComponent } from "./alert-dialog-component";
// import { Button } from "./ui/button";
import { NavFileUploads } from "./nav-file-uploads";
import { NavSavedFiles } from "./nav-saved-files";

export function TweakSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const params = new URLSearchParams(searchParams);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoSidebar />
      </SidebarHeader>
      <SidebarContent>
        {/* <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Start a new application !</SidebarGroupLabel>
          <SidebarMenu>
            <AlertDialogComponent
              title="New Application"
              description="Are you sure you want to create a new application? Old data will be lost."
              onConfirm={() => {
                params.set(
                  navigation.LEFT_PANEL.PARAM,
                  navigation.LEFT_PANEL.JOB,
                );
                params.set(
                  navigation.RIGHT_PANEL.PARAM,
                  navigation.RIGHT_PANEL.RESUME,
                );
                params.set(navigation.FORMAT.PARAM, navigation.FORMAT.PDF);
                router.push(`?${params.toString()}`);
              }}
            >
              <Button>
                <Plus color="black" /> New Application
              </Button>
            </AlertDialogComponent>
          </SidebarMenu>
        </SidebarGroup> */}
        <NavProjects />
        <NavMain />
        <ModelSwitcher />
        <NavSavedFiles />
        <NavFileUploads />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
