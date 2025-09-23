"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Sparkles } from "lucide-react";
import { TooltipComponent } from "./tooltip-component";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";
import useLocalStorage from "use-local-storage";
import { useState } from "react";

export function HumanizedProButtonResume() {
  const [humanizePro, setHumanizePro] = useLocalStorage(
    LOCAL_STORAGE_KEYS.HUMANIZE_PRO_FOR_RESUME,
    false,
  );

  const handleEnable = () => {
    setHumanizePro(!humanizePro);
  };

  return (
    <div className="flex items-center space-x-2 border border-background rounded-md mr-auto">
      <AlertDialog>
        <TooltipComponent
          content={humanizePro ? "Disable Humanize Pro" : "Enable Humanize Pro"}
        >
          <AlertDialogTrigger
            className={humanizePro ? "bg-foreground" : "bg-secondary"}
            asChild
          >
            <Switch
              id="humanize-pro"
              className="cursor-pointer rounded-none"
              checked={humanizePro}
            />
          </AlertDialogTrigger>
        </TooltipComponent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              Humanize Pro <Sparkles className="w-4 h-4" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              Currently our humanization for Resume is efficient but quite
              unpredictable (some times it gives a good percentage of AI
              generated content).
              <br />
              <br /> If you enable Humanize Pro, it will ensure high quality
              humanized context but will use more tokens / your money to
              generate a Resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEnable}>
              {humanizePro ? "Disable" : "Enable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className="w-56">
          <>
            <p className="text-center"> Humanize Pro </p>
            <br />
            <p>
              Currently our humanized Resume is efficient but quite
              unpredictable (some times it gives a good percentage of AI
              generated content).
              <br />
              <br /> If you enable Humanize Pro, it will ensure high quality
              humanized context but will use more tokens to generate a Resume.
            </p>
          </>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
