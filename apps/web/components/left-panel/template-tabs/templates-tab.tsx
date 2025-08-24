"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeTemplateComponent } from "@/components/left-panel/template-tabs/resume-template.tab";
import { CoverLetterTemplateComponent } from "@/components/left-panel/template-tabs/cover-letter-template-tab";
import { EmailTemplateComponent } from "@/components/left-panel/template-tabs/email-template-tab";
import { navigation } from "@/configs/navigation";
import { useRouter, useSearchParams } from "next/navigation";

export function TemplatesTab() {
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
        <ResumeTemplateComponent />
      </TabsContent>
      <TabsContent value={navigation.RIGHT_PANEL.COVER_LETTER}>
        <CoverLetterTemplateComponent />
      </TabsContent>
      <TabsContent value={navigation.RIGHT_PANEL.EMAIL}>
        <EmailTemplateComponent />
      </TabsContent>
    </Tabs>
  );
}
