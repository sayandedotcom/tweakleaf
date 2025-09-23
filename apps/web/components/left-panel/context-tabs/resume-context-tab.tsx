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
import { resumeContextPlaceholders } from "@/configs/context-placeholders";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";

const FormSchema = z.object({
  resumeContext: z.string(),
});

export default function ResumeContextComponent() {
  const [resumeContext, setResumeContext] = useLocalStorage(
    LOCAL_STORAGE_KEYS.RESUME_CONTEXT,
    "",
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      resumeContext: "",
    },
  });

  // Update form values when localStorage values change
  useEffect(() => {
    form.setValue("resumeContext", resumeContext);
  }, [resumeContext, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setResumeContext(data.resumeContext);
    toast("Resume context saved!", {
      description: "Your resume context has been saved successfully.",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full h-full p-5"
      >
        <FormField
          control={form.control}
          name="resumeContext"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={resumeContextPlaceholders}
                  className="resize-none h-[30rem]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide your professional information like email, social links,
                phone number, your preferences about how the resume should be
                written eg:- your way of writing experience descriptions.
              </FormDescription>
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
