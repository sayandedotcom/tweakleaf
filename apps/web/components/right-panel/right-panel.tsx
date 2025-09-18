"use client";

import { navigation } from "@/configs/navigation";
import { Loader } from "@/components/loader";
import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { useQueryParam } from "@/hooks/use-query-param";

// Pre-load components to prevent recompilation on navigation
const MailTab = dynamic(() => import("@/components/right-panel/mail-tab"), {
  loading: () => <Loader />,
  ssr: false, // Disable SSR to prevent hydration issues
});

const ResumeCoverLetterTabs = dynamic(
  () => import("@/components/right-panel/resume-coverletter-tabs"),
  {
    loading: () => <Loader />,
    ssr: false, // Disable SSR to prevent hydration issues
  },
);

export function RightPanel() {
  const { value: rightPanelCategory } = useQueryParam({
    paramName: navigation.RIGHT_PANEL.PARAM,
    defaultValue: navigation.RIGHT_PANEL.RESUME,
  });

  // Memoize the component to prevent unnecessary re-renders
  const content = useMemo(() => {
    if (rightPanelCategory === navigation.RIGHT_PANEL.EMAIL) {
      return (
        <Suspense fallback={<Loader />}>
          <MailTab />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<Loader />}>
        <ResumeCoverLetterTabs />
      </Suspense>
    );
  }, [rightPanelCategory]);

  return <>{content}</>;
}
