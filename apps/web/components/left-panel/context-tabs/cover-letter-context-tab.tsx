"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useLocalStorage from "use-local-storage";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PartyPopper } from "lucide-react";
import {
  coverletterContextPlaceholders,
  coverletterContextDescription,
} from "@/configs/context-placeholders";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";

const FormSchema = z.object({
  coverLetterContext: z.string(),
});

export default function CoverLetterContextComponent() {
  const [coverLetterContext, setCoverLetterContext] = useLocalStorage(
    LOCAL_STORAGE_KEYS.COVER_LETTER_CONTEXT,
    "",
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      coverLetterContext: "",
    },
  });

  // Update form values when localStorage values change
  useEffect(() => {
    form.setValue("coverLetterContext", coverLetterContext);
  }, [coverLetterContext, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setCoverLetterContext(data.coverLetterContext);
    toast("Cover letter context saved!", {
      description: "Your cover letter context has been saved successfully.",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full h-full p-5"
      >
        <div className="space-y-2 text-sm">
          <span className="text-muted-foreground">
            Before filling the cover letter context, make sure you have make
            necessary changes in the cover letter LaTeX file from LaTeX tab.
          </span>
        </div>
        <FormField
          control={form.control}
          name="coverLetterContext"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={coverletterContextPlaceholders}
                  className="resize-none h-[30rem]"
                  {...field}
                />
              </FormControl>
              <FormDescription>{coverletterContextDescription}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex items-center gap-2">
          Let&apos;s go ! <PartyPopper color="black" className="w-4 h-4" />
        </Button>
      </form>
    </Form>
  );
}
