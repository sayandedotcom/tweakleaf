import { Loader as Spinner } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Spinner className="size-4 animate-spin" />
    </div>
  );
};
