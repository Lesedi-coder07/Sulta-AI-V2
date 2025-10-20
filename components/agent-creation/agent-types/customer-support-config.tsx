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

export function CustomerSupportConfig({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h3 className="text-lg font-semibold">Customer Support Configuration</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Configure your customer support agent with company-specific information
        </p>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerSupportConfig.companyName"
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
              name="customerSupportConfig.serviceType"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Service/Product Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cloud Hosting, SaaS Platform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="customerSupportConfig.keyFeatures"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Key Features/Benefits</FormLabel>
                <FormControl>
                  <Textarea placeholder="Comma-separated list of key features" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerSupportConfig.companyWebsite"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerSupportConfig.otherSupportChannels"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Other Support Channels</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., support@example.com, 1-800-..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="customerSupportConfig.operatingHours"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Support Operating Hours</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 9 AM - 5 PM EST, Mon-Fri" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerSupportConfig.tone"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Agent Tone / Brand Voice</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., empathetic, professional" {...field} />
                </FormControl>
                <FormDescription>
                  Describe the tone and voice your agent should use
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Optional fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerSupportConfig.accountPageLink"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Account Page Link (Optional)</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://app.example.com/account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerSupportConfig.specializedTeamContact"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Specialized Team Contact (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., billing@example.com for billing issues" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="customerSupportConfig.commonRequests"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Common Requests AI Can Handle (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., password resets, basic feature questions" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerSupportConfig.refundPolicySummary"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Refund Policy Summary (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Briefly summarize your refund policy..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerSupportConfig.privacyPolicySummary"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Privacy Policy Summary (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Briefly summarize your privacy policy..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerSupportConfig.tosSummary"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Terms of Service Summary (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Briefly summarize your ToS..." {...field} />
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
