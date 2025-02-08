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
                placeholder="Enter extra context here..."
                className="mt-2"
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