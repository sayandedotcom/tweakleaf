"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigation } from "@/configs/navigation";
import { Loader } from "../loader";
import { useQueryParam } from "@/hooks/use-query-param";
import dynamic from "next/dynamic";

const JobTab = dynamic(() => import("./job-tab"), {
  loading: () => <Loader />,
});

const ContextTab = dynamic(() => import("./context-tabs/context-tab"), {
  loading: () => <Loader />,
});

const AiTab = dynamic(() => import("./ai-tabs/ai-tab"), {
  loading: () => <Loader />,
});

const PromptsTab = dynamic(() => import("./prompt-tabs/prompt-tab"), {
  loading: () => <Loader />,
});

const MemoizedJobTab = React.memo(JobTab);
const MemoizedAiTab = React.memo(AiTab);
const MemoizedContextTab = React.memo(ContextTab);
const MemoizedPromptsTab = React.memo(PromptsTab);
export function LeftPanel() {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const category = searchParams.get(navigation.LEFT_PANEL.PARAM);

  // const params = useMemo(
  //   () => new URLSearchParams(searchParams),
  //   [searchParams],
  // );

  // const handleValueChange = useCallback(
  //   (value: string) => {
  //     params.set(navigation.LEFT_PANEL.PARAM, value);
  //     router.push(`?${params.toString()}`);
  //   },
  //   [params, router],
  // );

  const { value: category, setValue: handleValueChange } = useQueryParam({
    paramName: navigation.LEFT_PANEL.PARAM,
    defaultValue: navigation.LEFT_PANEL.JOB,
  });

  return (
    <Tabs
      defaultValue={category || navigation.LEFT_PANEL.JOB}
      value={category || navigation.LEFT_PANEL.JOB}
      className="flex flex-col h-full"
      onValueChange={handleValueChange}
    >
      <header className="flex gap-2 items-center w-full justify-between px-2 py-0.5 border-b">
        <TabsList className="w-full">
          <TabsTrigger value={navigation.LEFT_PANEL.JOB}>Job</TabsTrigger>
          <TabsTrigger value={navigation.LEFT_PANEL.AI}>AI</TabsTrigger>
          <TabsTrigger value={navigation.LEFT_PANEL.CONTEXTS}>
            Contexts
          </TabsTrigger>
          <TabsTrigger value={navigation.LEFT_PANEL.PROMPTS}>
            Prompts
          </TabsTrigger>
        </TabsList>
      </header>
      <TabsContent value={navigation.LEFT_PANEL.JOB}>
        <MemoizedJobTab />
      </TabsContent>
      <TabsContent value={navigation.LEFT_PANEL.AI}>
        <MemoizedAiTab />
      </TabsContent>
      <TabsContent value={navigation.LEFT_PANEL.CONTEXTS}>
        <MemoizedContextTab />
      </TabsContent>
      <TabsContent value={navigation.LEFT_PANEL.PROMPTS}>
        <MemoizedPromptsTab />
      </TabsContent>
    </Tabs>
  );
}
