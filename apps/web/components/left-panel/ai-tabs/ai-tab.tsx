"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ResumeTab } from "@/components/left-panel/ai-tabs/resume-ai-tab";
// import { CoverLetterTab } from "@/components/left-panel/ai-tabs/cover-letter-ai-tab";
// import { useRouter, useSearchParams } from "next/navigation";
import { navigation } from "@/configs/navigation";
// import { MailTab } from "@/components/left-panel/ai-tabs/mail-ai-tab";
import { screenToLayoutHeight } from "@/configs/screen-to-layout-height";
import { useQueryParam } from "@/hooks/use-query-param";
import dynamic from "next/dynamic";
import { Loader } from "@/components/loader";

const ResumeTab = dynamic(
  () => import("@/components/left-panel/ai-tabs/resume-ai-tab"),
  {
    loading: () => <Loader />,
  },
);

const CoverLetterTab = dynamic(
  () => import("@/components/left-panel/ai-tabs/cover-letter-ai-tab"),
  {
    loading: () => <Loader />,
  },
);

const MailTab = dynamic(
  () => import("@/components/left-panel/ai-tabs/mail-ai-tab"),
  {
    loading: () => <Loader />,
  },
);

function AiTab() {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const category = searchParams.get(navigation.RIGHT_PANEL.PARAM);
  // const params = new URLSearchParams(searchParams);

  const { value: category, setValue: handleCategoryChange } = useQueryParam({
    paramName: navigation.RIGHT_PANEL.PARAM,
    defaultValue: navigation.RIGHT_PANEL.RESUME,
  });

  return (
    <Tabs
      defaultValue={category || navigation.RIGHT_PANEL.RESUME}
      value={category || navigation.RIGHT_PANEL.RESUME}
      className="flex flex-col px-2"
      style={{ height: screenToLayoutHeight }}
      onValueChange={(value) => {
        // params.set(navigation.RIGHT_PANEL.PARAM, value);
        // router.push(`?${params.toString()}`);
        handleCategoryChange(value);
      }}
    >
      <TabsList className="w-full flex gap-2 justify-between px-2 py-0.5 border-b">
        <TabsTrigger value={navigation.RIGHT_PANEL.RESUME}>Resume</TabsTrigger>
        <TabsTrigger value={navigation.RIGHT_PANEL.COVER_LETTER}>
          Cover Letter
        </TabsTrigger>
        <TabsTrigger value={navigation.RIGHT_PANEL.EMAIL}>
          Cold mail
        </TabsTrigger>
      </TabsList>
      <TabsContent value={navigation.RIGHT_PANEL.RESUME}>
        <ResumeTab />
      </TabsContent>
      <TabsContent
        value={navigation.RIGHT_PANEL.COVER_LETTER}
        className="h-full overflow-hidden"
      >
        <CoverLetterTab />
      </TabsContent>
      <TabsContent value={navigation.RIGHT_PANEL.EMAIL}>
        <MailTab />
      </TabsContent>
    </Tabs>
  );
}

export default AiTab;
