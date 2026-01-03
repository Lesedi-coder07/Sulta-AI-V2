"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Shield, AlertTriangle } from "lucide-react";

interface GuardrailsConfigProps {
  form: any;
  className?: string;
}

export function GuardrailsConfig({ form, className }: GuardrailsConfigProps) {
  return (
    <div className={className}>
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold">Guardrails & Restrictions</h3>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Define what your agent should NOT do. These restrictions help keep your agent secure and focused.
        </p>

        <FormField
          control={form.control}
          name="guardrails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Restrictions
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Example:&#10;- Never share personal customer data&#10;- Do not discuss competitors&#10;- Avoid making promises about pricing&#10;- Don't provide legal or medical advice"
                  className="min-h-[150px] font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                List behaviors, topics, or actions the agent should avoid. Be specific to prevent unwanted responses.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default GuardrailsConfig;
