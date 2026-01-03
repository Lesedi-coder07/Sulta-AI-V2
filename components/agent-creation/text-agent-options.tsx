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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles } from "lucide-react";

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
                <FormLabel>Areas of Expertise (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your agent's areas of expertise, e.g.:&#10;- Technical support for SaaS products&#10;- Customer onboarding&#10;- Financial consulting"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe the specific knowledge areas your agent should specialize in
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

          {/* Extended Thinking Toggle */}
          <FormField
            control={form.control}
            name="textConfig.extendedThinking"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
                <div className="space-y-0.5 flex-1">
                  <FormLabel className="text-base flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    Extended Thinking
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  </FormLabel>
                  <FormDescription>
                    Enable deeper reasoning for complex tasks. Uses more tokens and costs more.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}