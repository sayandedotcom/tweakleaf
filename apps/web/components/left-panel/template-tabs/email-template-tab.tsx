"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const FormSchema = z.object({
  emailContext: z
    .string()
    .min(10, {
      message: "Email context must be at least 10 characters.",
    })
    .max(160, {
      message: "Email context must not be longer than 30 characters.",
    }),
});

export function EmailTemplateComponent() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
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
          name="emailContext"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about the email."
                  className="resize-none h-[22rem]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                We have out own way to generate email but if you provide your
                own detailed email context. This will help us generate the best
                email according to your needs.
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
