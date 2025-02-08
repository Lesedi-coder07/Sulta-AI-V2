"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

const expertiseOptions = [
  "General Knowledge",
  "Technical Writing",
  "Creative Writing",
  "Business",
  "Science",
  "Marketing",
  "Education",
  "Healthcare",
  "Legal",
  "Finance",
];

export function TextAgentOptions({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h3 className="text-lg font-semibold">Personality & Behavior</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Configure how your text AI agent interacts and communicates
        </p>

        <div className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="textConfig.personality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personality Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select personality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Defines the agent's communication style
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

         

          <FormField
            control={form.control}
            name="textConfig.tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Communication Tone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Sets the overall tone of responses
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="textConfig.expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Areas of Expertise</FormLabel>
                <ScrollArea className="h-[120px] rounded-md border p-4">
                  <div className="space-x-2">
                    {expertiseOptions.map((expertise) => (
                      <Badge
                        key={expertise}
                        variant={
                          field.value?.includes(expertise)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          const newValue = field.value?.includes(expertise)
                            ? field.value.filter((e: string) => e !== expertise)
                            : [...(field.value || []), expertise];
                          field.onChange(newValue);
                        }}
                      >
                        {expertise}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
                <FormDescription>
                  Select relevant areas of expertise
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="textConfig.contextMemory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Context Memory (in messages)</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="py-4"
                  />
                </FormControl>
                <FormDescription>
                  Number of previous messages to remember: {field.value}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}