"use client";

import { JobTab } from "./job-tab";
import { ContextTab } from "./context-tabs/context-tab";
// import { TemplatesTab } from "./template-tabs/templates-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiTab } from "./ai-tab/ai-tab";
import { useRouter, useSearchParams } from "next/navigation";
import { navigation } from "@/configs/navigation";
import { CommingSoon } from "@/components/comming-soon";

export function LeftPanelComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get(navigation.LEFT_PANEL.PARAM);
  const params = new URLSearchParams(searchParams);

  return (
    <Tabs
      defaultValue={category || navigation.LEFT_PANEL.JOB}
      value={category || navigation.LEFT_PANEL.JOB}
      className="flex flex-col h-full"
      onValueChange={(value) => {
        params.set(navigation.LEFT_PANEL.PARAM, value);
        router.push(`?${params.toString()}`);
      }}
    >
      <header className="flex gap-2 items-center w-full justify-between px-2 py-0.5 border-b">
        <TabsList className="w-full">
          <TabsTrigger value={navigation.LEFT_PANEL.JOB}>Job</TabsTrigger>
          <TabsTrigger value={navigation.LEFT_PANEL.AI}>AI</TabsTrigger>
          <TabsTrigger value={navigation.LEFT_PANEL.CONTEXTS}>
            Contexts
          </TabsTrigger>
          <TabsTrigger disabled value={navigation.LEFT_PANEL.TEMPLATES}>
            Templates <CommingSoon />
          </TabsTrigger>
        </TabsList>
      </header>
      <TabsContent value={navigation.LEFT_PANEL.JOB}>
        <JobTab />
      </TabsContent>
      <TabsContent value={navigation.LEFT_PANEL.AI}>
        <AiTab />
      </TabsContent>
      <TabsContent value={navigation.LEFT_PANEL.CONTEXTS}>
        <ContextTab />
      </TabsContent>
      {/* <TabsContent value={navigation.LEFT_PANEL.TEMPLATES}>
        <TemplatesTab />
      </TabsContent> */}
    </Tabs>
  );
}
