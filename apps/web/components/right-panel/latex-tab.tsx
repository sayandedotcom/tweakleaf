import { ReactNode } from "react";

export function LatexTab({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex items-center justify-center">{children}</div>
  );
}
