"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const awardsSchema = z.object({
  awards: z.array(
    z.object({
      title: z.string().min(1, "Award title is required"),
      organization: z.string().min(1, "Awarding organization is required"),
      date: z.string().optional(),
      category: z
        .enum(["Professional", "Academic", "Creative", "Community", "Other"])
        .optional(),
      description: z.string().optional(),
      url: z.string().url("Invalid URL").optional().or(z.literal("")),
      image: z.string().optional(),
      monetaryValue: z.string().optional(),
    }),
  ),
});

type AwardsForm = z.infer<typeof awardsSchema>;

export default function AwardsPage() {
  const form = useForm<AwardsForm>({
    resolver: zodResolver(awardsSchema),
    defaultValues: {
      awards: [
        {
          title: "",
          organization: "",
          date: "",
          category: "Professional",
          description: "",
          url: "",
          image: "",
          monetaryValue: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "awards",
  });

  const onSubmit = (data: AwardsForm) => {
    console.log("Awards:", data);
    // Here you would typically save to your backend
  };

  const addAward = () => {
    append({
      title: "",
      organization: "",
      date: "",
      category: "Professional",
      description: "",
      url: "",
      image: "",
      monetaryValue: "",
    });
  };

  const removeAward = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Awards</h3>
        <p className="text-sm text-muted-foreground">
          Showcase your awards, honors, and recognitions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Awards & Honors</CardTitle>
          <CardDescription>
            List your awards, honors, and special recognitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Award #{index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAward(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`awards.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Award Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter award title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`awards.${index}.organization`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Awarding Organization *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter organization name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`awards.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Received</FormLabel>
                          <FormControl>
                            <Input type="month" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`awards.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="Professional">Professional</option>
                              <option value="Academic">Academic</option>
                              <option value="Creative">Creative</option>
                              <option value="Community">Community</option>
                              <option value="Other">Other</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`awards.${index}.monetaryValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monetary Value</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., $1000, $5000+"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`awards.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the award, criteria, and significance..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`awards.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate/Article URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/award"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`awards.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addAward}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Award
              </Button>

              <Button type="submit">Save Awards</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
