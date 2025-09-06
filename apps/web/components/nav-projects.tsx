"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigation } from "@/configs/navigation";
import { CommingSoon } from "./comming-soon";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rightPanelCategory = searchParams.get(navigation.RIGHT_PANEL.PARAM);
  const params = new URLSearchParams(searchParams);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Button
                // disabled={item.url !== navigation.RIGHT_PANEL.COVER_LETTER}
                variant="ghost"
                onClick={() => {
                  params.set(navigation.RIGHT_PANEL.PARAM, item.url);
                  router.push(`/tweak?${params.toString()}`);
                }}
                className={cn(
                  "justify-start",
                  rightPanelCategory === item.url && "bg-muted",
                )}
              >
                <item.icon />
                <span>{item.name}</span>
                {/* {item.url !== navigation.RIGHT_PANEL.COVER_LETTER && (
                  <CommingSoon />
                )} */}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

{
  /* <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <SidebarMenuAction showOnHover>
      <MoreHorizontal />
      <span className="sr-only">More</span>
    </SidebarMenuAction>
  </DropdownMenuTrigger>
  <DropdownMenuContent
    className="w-48 rounded-lg"
    side={isMobile ? "bottom" : "right"}
    align={isMobile ? "end" : "start"}
  >
    <DropdownMenuItem>
      <Folder className="text-muted-foreground" />
      <span>View Project</span>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Forward className="text-muted-foreground" />
      <span>Share Project</span>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Trash2 className="text-muted-foreground" />
      <span>Delete Project</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>; */
}
