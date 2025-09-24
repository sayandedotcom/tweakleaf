import { ReactNode } from "react";
import "./scrollbar.css";

export function LatexTab({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex items-center justify-center latex-editor-scrollbar">
      {children}
    </div>
  );
}
