"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useLocalStorage from "use-local-storage";

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
import { PartyPopper, Plus, RefreshCcw } from "lucide-react";
import { AlertDialogComponent } from "../alert-dialog-component";

const FormSchema = z.object({
  companyBio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    }),
  jobDescription: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
});

function JobTab() {
  const [companyBio, setCompanyBio] = useLocalStorage("companyBio", "");
  const [jobDescription, setJobDescription] = useLocalStorage(
    "jobDescription",
    "",
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      companyBio: companyBio,
      jobDescription: jobDescription,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Save to local storage
    setCompanyBio(data.companyBio);
    setJobDescription(data.jobDescription);

    toast("Job information updated successfully!", {
      description: "Your company bio and job description have been saved.",
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
          name="companyBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about the company."
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tip - Go to the company&apos;s Linkedin and copy the overview
                from about section
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about the job"
                  className="resize-none h-[22rem]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed job description. This will help us generate
                the best documents for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex items-center gap-2">
            Update <RefreshCcw color="black" className="w-4 h-4" />
          </Button>
          {/* <AlertDialogComponent
            title="New Application"
            description="Are you sure you want to create a new application? Old data will be lost."
            onConfirm={() => {
              console.log("New Application");
            }}
          >
            <Button className="flex items-center gap-2">
              Create New ! <Plus color="black" className="w-4 h-4" />
            </Button>
          </AlertDialogComponent> */}
        </div>
      </form>
    </Form>
  );
}

export default JobTab;
