"use client";
import { AlertDialogComponent } from "@/components/alert-dialog-component";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { navigation } from "@/configs/navigation";
import { Bot, UserRoundCog } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function TweakHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rightCategory = searchParams.get(navigation.RIGHT_PANEL.PARAM);

  return (
    <header className="flex h-10 shrink-0 px-4 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink>Building Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {rightCategory === navigation.RIGHT_PANEL.RESUME ? (
                  "Resume"
                ) : rightCategory === navigation.RIGHT_PANEL.COVER_LETTER ? (
                  <>
                    Cover Letter{" "}
                    <Badge className="bg-yellow-200 text-amber-800">
                      Upload your signature in File management with
                      &quot;signature&quot; name
                    </Badge>
                  </>
                ) : (
                  "Email / DMs"
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <AlertDialogComponent
          title="Configure Models"
          description="Are you sure you want to configure the models?"
          onConfirm={() => {
            router.push("/settings/models");
          }}
        >
          <Button className="h-8 text-xs">
            <Bot color="black" className="w-4 h-4" />
            Configure Models
          </Button>
        </AlertDialogComponent>
        {/* <AlertDialogComponent
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
              <Button className="h-8 text-xs">
                <Plus color="black" className="w-4 h-4" /> New Application
              </Button>
            </AlertDialogComponent> */}
        <AlertDialogComponent
          title="Update Profile"
          description="Are you sure you want to update your profile?"
          onConfirm={() => {
            router.push("/profile/basic-info");
          }}
        >
          <Button className="h-8 text-xs">
            <UserRoundCog color="black" className="w-4 h-4" /> Update Profile
          </Button>
        </AlertDialogComponent>
      </div>
    </header>
  );
}
