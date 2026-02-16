"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ExtraContextFieldProps {
  form: UseFormReturn<any>;
  className?: string;
}

export function ExtraContextField({ form, className }: ExtraContextFieldProps) {
  return (
    <div className={className}>
      <FormField
        control={form.control}
        name="extraContext"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Extra Context</FormLabel>
            <FormDescription>
              Add your business info and other relevant data the agent should know.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder={`Add detailed background the agent should use, for example:

- Company or project facts
- Key policies and constraints
- Preferred response style
- Domain-specific terminology`}
                rows={8}
                className="mt-2 min-h-[220px] resize-y"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export default ExtraContextField;
