"use client";

import { CommingSoon } from "@/components/comming-soon";
import { CoverLetterContextComponent } from "@/components/left-panel/context-tabs/cover-letter-context-tab";
import { MailContextComponent } from "@/components/left-panel/context-tabs/mail-context-tab";
import { ResumeContextComponent } from "@/components/left-panel/context-tabs/resume-context-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigation } from "@/configs/navigation";

import { useRouter, useSearchParams } from "next/navigation";
export function ContextTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get(navigation.RIGHT_PANEL.PARAM);
  const params = new URLSearchParams(searchParams);
  return (
    <Tabs
      defaultValue={category || navigation.RIGHT_PANEL.RESUME}
      value={category || navigation.RIGHT_PANEL.RESUME}
      className="h-full px-2"
      onValueChange={(value) => {
        params.set(navigation.RIGHT_PANEL.PARAM, value);
        router.push(`?${params.toString()}`);
      }}
    >
      <TabsList className="w-full flex gap-2 justify-between px-2 py-0.5 border-b">
        <TabsTrigger value={navigation.RIGHT_PANEL.RESUME}>Resume</TabsTrigger>
        <TabsTrigger value={navigation.RIGHT_PANEL.COVER_LETTER}>
          Cover Letter
        </TabsTrigger>
        <TabsTrigger value={navigation.RIGHT_PANEL.EMAIL}>
          Email / DM
        </TabsTrigger>
      </TabsList>
      <TabsContent value={navigation.RIGHT_PANEL.RESUME}>
        <ResumeContextComponent />
      </TabsContent>
      <TabsContent value={navigation.RIGHT_PANEL.COVER_LETTER}>
        <CoverLetterContextComponent />
      </TabsContent>
      <TabsContent value={navigation.RIGHT_PANEL.EMAIL}>
        <MailContextComponent />
      </TabsContent>
    </Tabs>
  );
}
