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

const interestsSchema = z.object({
  interests: z.array(
    z.object({
      name: z.string().min(1, "Interest name is required"),
      category: z
        .enum(["Hobby", "Sport", "Creative", "Technology", "Travel", "Other"])
        .optional(),
      description: z.string().optional(),
      level: z
        .enum(["Beginner", "Intermediate", "Advanced", "Expert"])
        .optional(),
      yearsOfExperience: z.string().optional(),
    }),
  ),
});

type InterestsForm = z.infer<typeof interestsSchema>;

export default function InterestsPage() {
  const form = useForm<InterestsForm>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      interests: [
        {
          name: "",
          category: "Hobby",
          description: "",
          level: "Beginner",
          yearsOfExperience: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "interests",
  });

  const onSubmit = (data: InterestsForm) => {
    console.log("Interests:", data);
    // Here you would typically save to your backend
  };

  const addInterest = () => {
    append({
      name: "",
      category: "Hobby",
      description: "",
      level: "Beginner",
      yearsOfExperience: "",
    });
  };

  const removeInterest = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Interests</h3>
        <p className="text-sm text-muted-foreground">
          Share your personal interests, hobbies, and activities.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Interests & Hobbies</CardTitle>
          <CardDescription>
            List your interests, hobbies, and activities outside of work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Interest #{index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeInterest(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`interests.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Photography, Rock Climbing, Cooking"
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
                      name={`interests.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="Hobby">Hobby</option>
                              <option value="Sport">Sport</option>
                              <option value="Creative">Creative</option>
                              <option value="Technology">Technology</option>
                              <option value="Travel">Travel</option>
                              <option value="Other">Other</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`interests.${index}.level`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skill Level</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
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
                      name={`interests.${index}.yearsOfExperience`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2, 5+" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`interests.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your interest, what you enjoy about it, and any notable experiences..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addInterest}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Interest
              </Button>

              <Button type="submit">Save Interests</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
