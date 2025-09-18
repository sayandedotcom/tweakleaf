import { Loader } from "@/components/loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense } from "react";
import { LeftPanel } from "@/components/left-panel/left-panel";
import { RightPanel } from "@/components/right-panel/right-panel";

export default function TweakPage() {
  return (
    <section className="flex flex-1 flex-col gap-4 p-2">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <Suspense fallback={<Loader />}>
            <LeftPanel />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <Suspense fallback={<Loader />}>
            <RightPanel />
          </Suspense>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}
