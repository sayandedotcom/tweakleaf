"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeTab } from "@/components/left-panel/ai-tab/resume-ai-tab";
import { CoverLetterTab } from "@/components/left-panel/ai-tab/cover-letter-ai-tab";
import { MailTab } from "@/components/left-panel/ai-tab/mail-ai-tab";
import { useRouter, useSearchParams } from "next/navigation";
import { navigation } from "@/configs/navigation";
import { CommingSoon } from "@/components/comming-soon";

export function AiTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get(navigation.RIGHT_PANEL.PARAM);
  const params = new URLSearchParams(searchParams);

  return (
    <Tabs
      defaultValue={category || navigation.RIGHT_PANEL.RESUME}
      value={category || navigation.RIGHT_PANEL.RESUME}
      className="flex flex-col px-2"
      style={{ height: "calc(100vh - 110px)" }}
      onValueChange={(value) => {
        params.set(navigation.RIGHT_PANEL.PARAM, value);
        router.push(`?${params.toString()}`);
      }}
    >
      <TabsList className="w-full flex gap-2 justify-between px-2 py-0.5 border-b">
        <TabsTrigger disabled value={navigation.RIGHT_PANEL.RESUME}>
          Resume <CommingSoon />
        </TabsTrigger>
        <TabsTrigger value={navigation.RIGHT_PANEL.COVER_LETTER}>
          Cover Letter
        </TabsTrigger>
        <TabsTrigger disabled value={navigation.RIGHT_PANEL.EMAIL}>
          Email / DM <CommingSoon />
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
