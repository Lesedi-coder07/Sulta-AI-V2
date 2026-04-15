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

interface GuardrailsConfigProps {
  form: any;
  className?: string;
}

export function GuardrailsConfig({ form, className }: GuardrailsConfigProps) {
  return (
    <div className={className}>
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">Guardrails & Restrictions</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Define what your agent should NOT do. These restrictions help keep your agent secure and focused.
        </p>

        <FormField
          control={form.control}
          name="guardrails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restrictions</FormLabel>
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
