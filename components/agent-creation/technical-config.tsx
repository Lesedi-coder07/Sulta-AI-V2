"use client";

import { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Settings2, ChevronDown, Wrench, Code, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TechnicalConfigProps {
  form: any;
  className?: string;
}

const AVAILABLE_MODELS = [
  { value: "gemini-3-pro-preview", label: "Gemini 3 Pro Preview", description: "Most capable" },
  { value: "gemini-3-flash", label: "Gemini 3 Flash", description: "Fast & powerful" },
  { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", description: "Super fast" },
];

export function TechnicalConfig({ form, className }: TechnicalConfigProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <div className="flex items-center gap-3">
                <Settings2 className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Technical Configuration</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                    Advanced LLM settings, custom API tools, and system prompts
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="p-6 pt-0 space-y-8">
              {/* LLM Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <h4 className="font-medium">LLM Configuration</h4>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="llmConfig.model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || "gemini-3-flash"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AVAILABLE_MODELS.map((model) => (
                              <SelectItem key={model.value} value={model.value}>
                                <div className="flex items-center gap-2">
                                  <span>{model.label}</span>
                                  <span className="text-xs text-neutral-500">
                                    {model.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="llmConfig.maxTokens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Tokens</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="8192"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 8192)}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Maximum response length
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="llmConfig.temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Temperature: {field.value?.toFixed(1) || "0.7"}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={2}
                          step={0.1}
                          value={[field.value || 0.7]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="py-4"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Lower = more focused & deterministic. Higher = more creative & varied.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Custom API Tool */}
              <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">Custom API Tool</h4>
                  <Badge variant="outline" className="text-xs">Experimental</Badge>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Allow your agent to call an external API as a tool. The agent will use this when appropriate.
                </p>

                <FormField
                  control={form.control}
                  name="customApiTool.url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Endpoint URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://api.example.com/endpoint"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customApiTool.parameters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Parameters</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{\n  "query": "string - the search query",\n  "limit": "number - max results (optional)"\n}'
                          className="font-mono text-sm min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Describe the parameters your API expects (JSON format)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customApiTool.responseSchema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Response Schema</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{\n  "results": "array of results",\n  "total": "number - total count"\n}'
                          className="font-mono text-sm min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Describe the expected API response format (JSON format)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Custom System Prompt */}
              <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium">Custom System Prompt</h4>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Override the auto-generated system prompt with your own. Use this for advanced customization.
                </p>

                <FormField
                  control={form.control}
                  name="customSystemPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="You are a helpful assistant that specializes in..."
                          className="min-h-[200px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Leave empty to use the auto-generated prompt based on your configuration above.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

export default TechnicalConfig;
