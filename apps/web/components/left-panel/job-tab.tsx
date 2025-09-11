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
import { Plus, RefreshCcw } from "lucide-react";
import { AlertDialogComponent } from "../alert-dialog-component";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";

const FormSchema = z.object({
  companyBio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
  jobDescription: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
});

function JobTab() {
  const [companyBio, setCompanyBio] = useLocalStorage(
    LOCAL_STORAGE_KEYS.COMPANY_BIO,
    "",
  );
  const [jobDescription, setJobDescription] = useLocalStorage(
    LOCAL_STORAGE_KEYS.JOB_DESCRIPTION,
    "",
  );
  const [storedThreadId, setStoredThreadId] = useLocalStorage(
    LOCAL_STORAGE_KEYS.COVER_LETTER_THREAD_ID,
    "",
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      companyBio: "",
      jobDescription: "",
    },
  });

  // Update form values when localStorage values change
  useEffect(() => {
    form.setValue("companyBio", companyBio);
    form.setValue("jobDescription", jobDescription);
  }, [companyBio, jobDescription, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Save to local storage
    setCompanyBio(data.companyBio);
    setJobDescription(data.jobDescription);

    toast("Job information updated successfully!", {
      description: "Your company bio and job description have been saved.",
    });
  }

  return (
    <div className="p-5 flex flex-col gap-5">
      <AlertDialogComponent
        title="New Application"
        description="Are you sure you want to create a new application? Old data will be lost."
        onConfirm={() => {
          setCompanyBio("");
          setJobDescription("");
          setStoredThreadId("");
          form.reset();
        }}
      >
        <Button disabled={!companyBio || !jobDescription} className="w-60">
          <Plus color="black" /> New Application
        </Button>
      </AlertDialogComponent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-3 h-full"
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
              Update the job information{" "}
              <RefreshCcw color="black" className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default JobTab;
