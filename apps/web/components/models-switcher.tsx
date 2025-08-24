"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Clock, Wrench, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { TooltipComponent } from "./tooltip-component";
import { useRouter, useSearchParams } from "next/navigation";
import { navigation } from "@/configs/navigation";
import { cn } from "@/lib/utils";
import { ModelConfig } from "@/configs/models";

export function ModelSwitcher({
  models: modelsProp,
}: {
  models: ModelConfig[];
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Listen for localStorage changes to refresh configuration status
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tweak_jobs_model_api_keys") {
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === "tweak_jobs_model_api_keys") {
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "localStorageChange",
      handleCustomStorageChange as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localStorageChange",
        handleCustomStorageChange as EventListener,
      );
    };
  }, []);

  // Get current model from URL query parameter
  const currentModelUrl = searchParams.get(navigation.MODEL.PARAM);

  // If no model in URL, try to get from localStorage
  const getInitialModel = () => {
    if (currentModelUrl) {
      return modelsProp.find((model) => model.url === currentModelUrl);
    }

    // Try to get from localStorage
    if (typeof window !== "undefined") {
      const storedModelUrl = localStorage.getItem("modelName");
      if (storedModelUrl) {
        const storedModel = modelsProp.find(
          (model) => model.url === storedModelUrl,
        );
        if (storedModel) {
          return storedModel;
        }
      }
    }

    return modelsProp[0];
  };

  const activeModel = getInitialModel() || {
    name: "",
    logo: null,
    url: "",
    model: "",
    configured: false,
    apiKeyUrl: "",
    isConfigured: () => false,
  };

  const handleModelChange = (model: (typeof modelsProp)[0]) => {
    const params = new URLSearchParams(searchParams);
    params.set(navigation.MODEL.PARAM, model.url);

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("modelName", model.url);

      // Dispatch custom event for same-tab localStorage changes
      window.dispatchEvent(
        new CustomEvent("localStorageChange", {
          detail: { key: "modelName", value: model.url },
        }),
      );
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Models</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center justify-between gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-text text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-xl">
                  {activeModel.logo ? (
                    <activeModel.logo />
                  ) : (
                    <div className="w-6 h-6 bg-muted rounded" />
                  )}
                </div>
                <TooltipComponent content={activeModel?.model}>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {activeModel.name}
                    </span>
                    <span className="truncate text-xs">
                      {activeModel.model}
                    </span>
                  </div>
                </TooltipComponent>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <TooltipComponent content="Configure your model">
              <Button
                onClick={() => {
                  router.push(`/settings/models`);
                }}
                variant="outline"
                size="icon"
                className="h-full"
              >
                <Wrench />
              </Button>
            </TooltipComponent>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Models
              </DropdownMenuLabel>
              {modelsProp.map((model) => (
                <DropdownMenuItem
                  key={model.name}
                  onClick={() => handleModelChange(model)}
                  className={cn(
                    "gap-2 p-2",
                    activeModel.url === model.url &&
                      "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <div className="bg-text flex size-6 items-center justify-center rounded-md border">
                    <model.logo />
                  </div>
                  {model.name}
                  <TooltipComponent
                    content={
                      model.isConfigured()
                        ? "Configured"
                        : "Not configured, please add your API key"
                    }
                  >
                    <DropdownMenuShortcut>
                      {model.isConfigured() ? <Check /> : <X />}
                    </DropdownMenuShortcut>
                  </TooltipComponent>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Clock className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  More models coming soon !
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
