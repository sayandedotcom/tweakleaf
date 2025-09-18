"use client";

import { Loader } from "@/components/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigation } from "@/configs/navigation";
import dynamic from "next/dynamic";

const CoverLetterContextComponent = dynamic(
  () => import("@/components/left-panel/context-tabs/cover-letter-context-tab"),
  {
    loading: () => <Loader />,
  },
);

const ResumeContextComponent = dynamic(
  () => import("@/components/left-panel/context-tabs/resume-context-tab"),
  {
    loading: () => <Loader />,
  },
);

const MailContextComponent = dynamic(
  () => import("@/components/left-panel/context-tabs/mail-context-tab"),
  {
    loading: () => <Loader />,
  },
);

import { useQueryParam } from "@/hooks/use-query-param";

function ContextTab() {
  // const router = useRouter();
  // const searchParams = useSearchParams();
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
      className="h-full px-2"
      onValueChange={(value) => {
        handleCategoryChange(value);
        // params.set(navigation.RIGHT_PANEL.PARAM, value);
        // router.push(`?${params.toString()}`);
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

export default ContextTab;
