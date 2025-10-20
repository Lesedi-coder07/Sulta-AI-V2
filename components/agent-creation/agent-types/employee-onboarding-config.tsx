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

export function EmployeeOnboardingConfig({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h3 className="text-lg font-semibold">Employee Onboarding Configuration</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Configure your employee onboarding agent with company-specific information
        </p>

        <div className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="employeeOnboardingConfig.companyName"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Company Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeOnboardingConfig.tone"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Agent Tone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., welcoming, informative, professional" {...field} />
                </FormControl>
                <FormDescription>
                  Describe the tone your agent should use when helping new employees
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeOnboardingConfig.companyCultureSummary"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Company Culture Summary (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Briefly describe the company culture..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="employeeOnboardingConfig.keyPolicies"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Key Policies Info (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Link to Code of Conduct, IT Policy location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeOnboardingConfig.benefitsOverview"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Benefits Overview Info (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Link to Benefits Portal, enrollment deadline" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="employeeOnboardingConfig.requiredTools"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Required Tools (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Slack, Jira, Google Workspace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeOnboardingConfig.firstWeekTasks"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Typical First Week Tasks (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Setup accounts, meet team, training" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="employeeOnboardingConfig.keyContacts"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Key Contacts Info (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Your manager, buddy, HR rep" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="employeeOnboardingConfig.hrHelpdeskContact"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>HR Helpdesk Contact Info (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., hr@example.com or HR Portal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeOnboardingConfig.itHelpdeskContact"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>IT Helpdesk Contact Info (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., it@example.com or Ticketing System" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
