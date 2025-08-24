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

const achievementsSchema = z.object({
  achievements: z.array(
    z.object({
      title: z.string().min(1, "Achievement title is required"),
      description: z.string().min(1, "Achievement description is required"),
      date: z.string().optional(),
      organization: z.string().optional(),
      category: z
        .enum(["Academic", "Professional", "Personal", "Community", "Other"])
        .optional(),
      url: z.string().url("Invalid URL").optional().or(z.literal("")),
      image: z.string().optional(),
    }),
  ),
});

type AchievementsForm = z.infer<typeof achievementsSchema>;

export default function AchievementsPage() {
  const form = useForm<AchievementsForm>({
    resolver: zodResolver(achievementsSchema),
    defaultValues: {
      achievements: [
        {
          title: "",
          description: "",
          date: "",
          organization: "",
          category: "Professional",
          url: "",
          image: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  const onSubmit = (data: AchievementsForm) => {
    console.log("Achievements:", data);
    // Here you would typically save to your backend
  };

  const addAchievement = () => {
    append({
      title: "",
      description: "",
      date: "",
      organization: "",
      category: "Professional",
      url: "",
      image: "",
    });
  };

  const removeAchievement = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Achievements</h3>
        <p className="text-sm text-muted-foreground">
          Highlight your accomplishments, awards, and recognitions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements & Awards</CardTitle>
          <CardDescription>
            List your notable achievements, awards, and recognitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Achievement #{index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`achievements.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievement Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter achievement title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`achievements.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the achievement, what it means, and why it's significant..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="month" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.organization`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Company, University, Community"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.category`}
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
                              <option value="Personal">Personal</option>
                              <option value="Community">Community</option>
                              <option value="Other">Other</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate/Article URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/certificate"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.image`}
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

              <Button type="button" variant="outline" onClick={addAchievement}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Achievement
              </Button>

              <Button type="submit">Save Achievements</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
