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

const volunteeringSchema = z.object({
  volunteering: z.array(
    z.object({
      organization: z.string().min(1, "Organization name is required"),
      role: z.string().min(1, "Role is required"),
      cause: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      hoursPerWeek: z.string().optional(),
      description: z.string().optional(),
      url: z.string().url("Invalid URL").optional().or(z.literal("")),
      location: z.string().optional(),
    }),
  ),
});

type VolunteeringForm = z.infer<typeof volunteeringSchema>;

export default function VolunteeringPage() {
  const form = useForm<VolunteeringForm>({
    resolver: zodResolver(volunteeringSchema),
    defaultValues: {
      volunteering: [
        {
          organization: "",
          role: "",
          cause: "",
          startDate: "",
          endDate: "",
          hoursPerWeek: "",
          description: "",
          url: "",
          location: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "volunteering",
  });

  const onSubmit = (data: VolunteeringForm) => {
    console.log("Volunteering:", data);
    // Here you would typically save to your backend
  };

  const addVolunteering = () => {
    append({
      organization: "",
      role: "",
      cause: "",
      startDate: "",
      endDate: "",
      hoursPerWeek: "",
      description: "",
      url: "",
      location: "",
    });
  };

  const removeVolunteering = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Volunteering</h3>
        <p className="text-sm text-muted-foreground">
          Share your community service and volunteer work.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Community Service & Volunteering</CardTitle>
          <CardDescription>
            List your volunteer work, community service, and charitable
            contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Volunteer Work #{index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVolunteering(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`volunteering.${index}.organization`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization *</FormLabel>
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
                    <FormField
                      control={form.control}
                      name={`volunteering.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Volunteer Coordinator, Mentor"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`volunteering.${index}.cause`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cause/Issue</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Education, Environment, Healthcare"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`volunteering.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="City, Country or Remote"
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
                      name={`volunteering.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="month" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`volunteering.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="month" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`volunteering.${index}.hoursPerWeek`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours per Week</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 5, 10+" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`volunteering.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your role, responsibilities, and impact..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`volunteering.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Website</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://organization.org"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addVolunteering}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Volunteer Position
              </Button>

              <Button type="submit">Save Volunteering</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
