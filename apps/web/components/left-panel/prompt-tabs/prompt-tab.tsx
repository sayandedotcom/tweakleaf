"use client";

import { CoverLetterPromptComponent } from "@/components/left-panel/prompt-tabs/coverletter-prompt-tab";
import { ResumePromptComponent } from "@/components/left-panel/prompt-tabs/resume-prompt-tab";
import { MailPromptComponent } from "@/components/left-panel/prompt-tabs/mail-prompt-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigation } from "@/configs/navigation";

import { useRouter, useSearchParams } from "next/navigation";
function PromptTab() {
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
          Cold Email
        </TabsTrigger>
      </TabsList>
      <div className="text-sm text-muted-foreground border bg-accent p-0.5 text-center">
        Prompts are instructions that guide the AI on how to generate the
        resume.
      </div>
      <TabsContent value={navigation.RIGHT_PANEL.RESUME}>
        <ResumePromptComponent />
      </TabsContent>
      <TabsContent value={navigation.RIGHT_PANEL.COVER_LETTER}>
        <CoverLetterPromptComponent />
      </TabsContent>
      <TabsContent value={navigation.RIGHT_PANEL.EMAIL}>
        <MailPromptComponent />
      </TabsContent>
    </Tabs>
  );
}

export default PromptTab;
