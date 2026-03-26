"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supportSchema } from "@/Schemas/support-schema";
import InputFormField from "@/components/form-fields/InputFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";


export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof supportSchema>>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof supportSchema>) {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/support", {
        ...values,
      });
      toast.success(response.data.message)
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-1 mb-24 lg:mb-20 bg-card shadow-md border border-border/50 rounded-2xl overflow-hidden">      
      <CardHeader className="space-y-2 pt-10 pb-8 border-b border-border/30 bg-muted/5">
        <CardTitle className="text-3xl font-extrabold text-center text-foreground tracking-tight">
          CONTACT US
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7 mb-2"
          >
            <InputFormField
              wrapperClassName="col-span-1 md:col-span-2"
              className="h-12 px-4 rounded-xl bg-muted/10 border-border/50 focus-visible:bg-background transition-colors text-base"
              labelClassName="text-sm font-semibold text-foreground/80 tracking-wide mb-1"
              control={form.control}
              name="name"
              label="FULL NAME"
              placeholder="Your full name"
            />

            <InputFormField
              control={form.control}
              className="h-12 px-4 rounded-xl bg-muted/10 border-border/50 focus-visible:bg-background transition-colors text-base"
              labelClassName="text-sm font-semibold text-foreground/80 tracking-wide mb-1"
              name="email"
              label="EMAIL"
              placeholder="name@example.com"
            />

            <InputFormField
              control={form.control}
              className="h-12 px-4 rounded-xl bg-muted/10 border-border/50 focus-visible:bg-background transition-colors text-base"
              labelClassName="text-sm font-semibold text-foreground/80 tracking-wide mb-1"
              name="phoneNumber"
              label="PHONE NUMBER"
              placeholder="8329493953"
            />

            <InputFormField
              wrapperClassName="col-span-1 md:col-span-2"
              className="min-h-[120px] p-4 rounded-xl bg-muted/10 border-border/50 focus-visible:bg-background transition-colors text-base resize-y"
              labelClassName="text-sm font-semibold text-foreground/80 tracking-wide mb-1"
              control={form.control}
              name="message"
              label="MESSAGE"
              placeholder="Enter your message here...."
              type="textarea"
            />

            <Button
              type="submit"
              variant="default"
              className="col-span-1 md:col-span-2 w-full h-12 rounded-xl font-bold text-base bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all cursor-pointer mt-2"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Send Message
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
