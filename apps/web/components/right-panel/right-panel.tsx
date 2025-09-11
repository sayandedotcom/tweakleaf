"use client";

import { useSearchParams } from "next/navigation";
import { navigation } from "@/configs/navigation";
import { ResumeCoverLetterTabs } from "@/components/right-panel/resume-coverletter-tabs";
import { Loader } from "@/components/loader";

import dynamic from "next/dynamic";

const MailTab = dynamic(() => import("@/components/right-panel/mail-tab"), {
  ssr: false,
  loading: () => <Loader />,
});

export function RightPanel() {
  const searchParams = useSearchParams();
  const rightPanelCategory = searchParams.get(navigation.RIGHT_PANEL.PARAM);

  return (
    <>
      {rightPanelCategory === navigation.RIGHT_PANEL.EMAIL ? (
        <MailTab />
      ) : (
        <ResumeCoverLetterTabs />
      )}
    </>
  );
}
