"use client";

import {
  AudioWaveform,
  BookOpen,
  BriefcaseBusiness,
  Command,
  FileText,
  GalleryVerticalEnd,
  Mail,
  MailPlus,
  Plus,
  Save,
  Settings2,
  SquareTerminal,
  Store,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { LogoSidebar } from "@/components/logo-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navigation } from "@/configs/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { ModelSwitcher } from "./models-switcher";
import { AlertDialogComponent } from "./alert-dialog-component";
import { Button } from "./ui/button";
import { NavFileUploads } from "./nav-file-uploads";
import { models } from "@/configs/models";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    // {
    //   title: "Saved",
    //   url: "#",
    //   icon: Save,
    //   items: [
    //     {
    //       title: "Google-Resume.tex",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Contexts",
      url: navigation.LEFT_PANEL.CONTEXTS,
      icon: SquareTerminal,
      isActive: false,
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
          title: "Email / DMs Context",
          url: navigation.RIGHT_PANEL.EMAIL,
        },
        {
          title: "Cold Email Context",
          url: navigation.RIGHT_PANEL.EMAIL,
        },
      ],
    },
    // {
    //   title: "Templates",
    //   url: navigation.LEFT_PANEL.TEMPLATES,
    //   icon: FileText,
    //   items: [
    //     {
    //       title: "Resume Template",
    //       url: navigation.RIGHT_PANEL.RESUME,
    //     },
    //     {
    //       title: "Cover Letter Template",
    //       url: navigation.RIGHT_PANEL.COVER_LETTER,
    //     },
    //     {
    //       title: "Email / DMs Template",
    //       url: navigation.RIGHT_PANEL.EMAIL,
    //     },
    //     {
    //       title: "Cold Email Template",
    //       url: navigation.RIGHT_PANEL.EMAIL,
    //     },
    //   ],
    // },
    // {
    //   title: "Store",
    //   url: navigation.LEFT_PANEL.STORE,
    //   icon: Store,
    //   items: [
    //     {
    //       title: "Resums",
    //       url: navigation.RIGHT_PANEL.RESUME,
    //       icon: BriefcaseBusiness,
    //     },
    //     {
    //       title: "Cover Letter",
    //       url: navigation.RIGHT_PANEL.COVER_LETTER,
    //       icon: MailPlus,
    //     },
    //     {
    //       title: "Email / DMs",
    //       url: navigation.RIGHT_PANEL.EMAIL,
    //       icon: Mail,
    //     },
    //     {
    //       title: "Cold Email",
    //       url: navigation.RIGHT_PANEL.EMAIL,
    //       icon: Mail,
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  models: models,
  projects: [
    {
      name: "Resume",
      url: navigation.RIGHT_PANEL.RESUME,
      icon: BriefcaseBusiness,
    },
    {
      name: "Cover Letter",
      url: navigation.RIGHT_PANEL.COVER_LETTER,
      icon: MailPlus,
    },
    {
      name: "Email / DMs",
      url: navigation.RIGHT_PANEL.EMAIL,
      icon: Mail,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoSidebar />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
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
        </SidebarGroup>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
        <ModelSwitcher models={data.models} />
        <NavFileUploads />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
