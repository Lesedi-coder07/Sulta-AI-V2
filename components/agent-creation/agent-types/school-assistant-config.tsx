"use client";

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

export function SchoolAssistantConfig({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h3 className="text-lg font-semibold">School Assistant Configuration</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Configure your school assistant agent with institution-specific information
        </p>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="schoolAssistantConfig.schoolName"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Maplewood High School" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolAssistantConfig.userTypes"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>User Types Served</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., students, teachers, staff" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="schoolAssistantConfig.tone"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Agent Tone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., encouraging, patient, formal" {...field} />
                </FormControl>
                <FormDescription>
                  Describe the tone your agent should use when interacting with users
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolAssistantConfig.keyPlatforms"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Key Platforms/Tools (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Google Classroom, PowerSchool, library.school.edu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolAssistantConfig.supportContacts"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Key Support Contacts (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., IT: it@school.edu, Guidance: guidance@school.edu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolAssistantConfig.academicIntegrityPolicy"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Academic Integrity Policy Summary (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Summarize the school's policy and AI's role..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolAssistantConfig.privacyPolicy"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Privacy Policy Summary (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Summarize privacy guidelines for the AI..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
