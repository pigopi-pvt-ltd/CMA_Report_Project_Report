"use client";

import { MailIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { cn } from "@/lib/utils";
import React from "react";

export interface EmailInputProps
 extends Omit<React.ComponentProps<"input">, "type"> { }

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
 ({ className, ...props }, ref) => {
  return (
   <InputGroup>
    <InputGroupInput
     type="email"
     ref={ref}
     className={cn(className)}
     {...props}
    />
    <InputGroupAddon>
     <MailIcon />
    </InputGroupAddon>
   </InputGroup>
  );
 }
);

EmailInput.displayName = "EmailInput";

export { EmailInput };