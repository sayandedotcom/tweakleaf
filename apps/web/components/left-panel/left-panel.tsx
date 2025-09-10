"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { navigation } from "@/configs/navigation";
import { Loader } from "../loader";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";

const JobTab = dynamic(() => import("./job-tab"), {
  ssr: false,
  loading: () => <Loader />,
});
const ContextTab = dynamic(() => import("./context-tabs/context-tab"), {
  ssr: false,
  loading: () => <Loader />,
});
const AiTab = dynamic(() => import("./ai-tab/ai-tab"), {
  ssr: false,
  loading: () => <Loader />,
});

export function LeftPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get(navigation.LEFT_PANEL.PARAM);

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const handleValueChange = useCallback(
    (value: string) => {
      params.set(navigation.LEFT_PANEL.PARAM, value);
      router.push(`?${params.toString()}`);
    },
    [params, router],
  );

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
    </Tabs>
  );
}
