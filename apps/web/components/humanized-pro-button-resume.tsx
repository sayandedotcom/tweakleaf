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
            {/* <Switch
              id="humanize-pro"
              className="cursor-pointer"
              checked={humanizePro}
            /> */}
            <div className="relative inline-grid h-8 grid-cols-[1fr_1fr] items-center text-sm font-medium">
              <Switch
                checked={humanizePro}
                className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto rounded-md [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-8.75 [&_span]:data-[state=checked]:rtl:-translate-x-8.75"
                aria-label="Square switch with permanent text indicators"
              />
              <span className="pointer-events-none relative ml-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
                <span className="text-[10px] font-medium uppercase">OFF</span>
              </span>
              <span className="peer-data-[state=checked]:text-background pointer-events-none relative mr-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
                <span className="text-[10px] font-medium uppercase">ON</span>
              </span>
            </div>
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
