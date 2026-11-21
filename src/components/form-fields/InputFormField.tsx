import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FieldValues, Control, Path } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  type?: "text" | "email" | "password" | "textarea" | "tel" | "number";
}

const InputFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  wrapperClassName,
  labelClassName,
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={wrapperClassName}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                className={cn("min-h-[300px] resize-none", className)}
              />
            ) : (
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                className={className}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default InputFormField;
