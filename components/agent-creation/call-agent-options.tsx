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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useState } from "react";


const voiceOptions = ["nat", "james", "sarah", "emily"];
const languageOptions = ["en", "es", "fr", "de"];

export function CallAgentOptions({ form }: { form: any }) {
  const [testNumber, setTestNumber] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const handleTestCall = async () => {
    setIsTesting(true);
    try {
      const data = {
        phone_number: testNumber,
        task: form.getValues("description"),
        model: "enhanced",
        language: form.getValues("callConfig.language") || "en",
        voice: form.getValues("callConfig.voice") || "nat",
        max_duration: 12,
      };
      const apiKey = 'sk-31t4vqtrz09ed6adbmivdc905iuey5qrn89nspym3tzhapnnm8ma6umyitac1dbw69';
      if (!apiKey) {
        throw new Error('Bland AI API key is not configured');
      }

      await fetch('https://api.bland.ai/v1/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey
        },
        body: JSON.stringify(data)
      });

      // Show success message
    } catch (error) {
      console.error('Error making test call:', error);
      // Show error message
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h3 className="text-lg font-semibold">Voice Configuration</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Configure how your voice AI agent speaks and behaves
        </p>

        <div className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="callConfig.voice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voice Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {voiceOptions.map((voice) => (
                      <SelectItem key={voice} value={voice}>
                        {voice.charAt(0).toUpperCase() + voice.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose the voice for your AI agent</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="callConfig.language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the speaking language</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h3 className="text-lg font-semibold">Test Your Agent</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Try out your voice AI agent with a test call
        </p>

        <div className="flex flex-col gap-1 space-y-4">
          <Input
            placeholder="Enter phone number"
            value={testNumber}
            onChange={(e) => setTestNumber(e.target.value)}
            className="max-w-xs"
          />
          <Button 
            onClick={() => handleTestCall()} 
            disabled={isTesting || !testNumber}
            className="space-x-2"
          >
            <Phone className="h-4 w-4" />
            <span>{isTesting ? "Calling..." : "Make Test Call"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}