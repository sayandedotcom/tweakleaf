import { site } from "@/configs/site";

export function TypingIndicator() {
  return (
    <div className="justify-left flex space-x-1">
      <div className="rounded-lg bg-muted p-3">
        <div className="flex -space-x-2.5">
          {site.name} is not thinking but AI !
        </div>
      </div>
    </div>
  );
}
