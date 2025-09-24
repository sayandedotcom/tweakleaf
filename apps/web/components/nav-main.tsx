"use client";

import {
  ChevronRight,
  BookPlus,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { navigation } from "@/configs/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const items: {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  baseUrl: string;
  items: {
    title: string;
    url: string;
  }[];
}[] = [
  {
    title: "Contexts",
    url: navigation.LEFT_PANEL.CONTEXTS,
    icon: BookPlus,
    isActive: false,
    baseUrl: "tweak",
    items: [
      {
        title: "Resume Context",
        url: navigation.RIGHT_PANEL.RESUME,
      },
      {
        title: "Cover Letter Context",
        url: navigation.RIGHT_PANEL.COVER_LETTER,
      },
      {
        title: "Cold Email Context",
        url: navigation.RIGHT_PANEL.EMAIL,
      },
    ],
  },
  // {
  //   title: "Prompts",
  //   url: navigation.LEFT_PANEL.PROMPTS,
  //   icon: SquareTerminal,
  //   isActive: false,
  //   baseUrl: "tweak",
  //   items: [
  //     {
  //       title: "Resume Prompt",
  //       url: navigation.RIGHT_PANEL.RESUME,
  //     },
  //     {
  //       title: "Cover Letter Prompt",
  //       url: navigation.RIGHT_PANEL.COVER_LETTER,
  //     },
  //     {
  //       title: "Cold Email Prompt",
  //       url: navigation.RIGHT_PANEL.EMAIL,
  //     },
  //   ],
  // },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings2,
  //   baseUrl: "settings",
  //   items: settingsTabs.map((tab) => ({
  //     title: tab.title,
  //     url: tab.href,
  //   })),
  //   isActive: false,
  // },
];

export function NavMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const rightPanelCategory = searchParams.get(navigation.RIGHT_PANEL.PARAM);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Configure</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild className="flex">
                        <Button
                          variant="ghost"
                          className={cn(
                            "justify-start w-full",
                            rightPanelCategory === subItem.url && "bg-muted",
                          )}
                          onClick={() => {
                            params.set(navigation.LEFT_PANEL.PARAM, item.url);
                            params.set(
                              navigation.RIGHT_PANEL.PARAM,
                              subItem.url,
                            );
                            router.push(`/tweak?${params.toString()}`);
                          }}
                        >
                          <span>{subItem.title}</span>
                        </Button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
