import { LeftPanel } from "@/components/left-panel/left-panel";
import { Loader } from "@/components/loader";
import { RightPanel } from "@/components/right-panel/right-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SetLocalstorageProvider } from "@/providers/set-localstorage-provider";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function TweakPage() {
  return (
    <section className="flex flex-1 flex-col gap-4 p-2">
      <SetLocalstorageProvider />
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
