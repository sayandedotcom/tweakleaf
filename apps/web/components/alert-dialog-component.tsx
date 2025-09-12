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
import { TooltipComponent } from "./tooltip-component";

export function AlertDialogComponent({
  children,
  title,
  description,
  onConfirm,
  onCancel,
  tooltipContent,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  tooltipContent?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <AlertDialog>
      <TooltipComponent content={tooltipContent || ""}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      </TooltipComponent>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
