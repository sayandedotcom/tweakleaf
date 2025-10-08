"use client";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { navigation } from "@/configs/navigation";
import { useQueryParam } from "@/hooks/use-query-param";

export function EmptyComponent() {
  const { value: category, setValue: handleValueChange } = useQueryParam({
    paramName: navigation.LEFT_PANEL.PARAM,
    defaultValue: navigation.LEFT_PANEL.JOB,
  });

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert />
        </EmptyMedia>
        <EmptyTitle>Oops ! </EmptyTitle>
        <EmptyDescription>
          No job description or company bio found. Please fill a job description
          and company bio to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={() => handleValueChange(navigation.LEFT_PANEL.JOB)}>
            Fill Job Description and Company Bio
          </Button>
          {/* <Button variant="outline">Import Project</Button> */}
        </div>
      </EmptyContent>
      {/* <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button> */}
    </Empty>
  );
}
