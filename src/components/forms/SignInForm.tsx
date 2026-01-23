"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "@/Schemas/sign-in-schema";
import InputFormField from "@/components/form-fields/InputFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { socialSignIn } from "@/helpers/social-sign-in";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaGoogle, FaSignInAlt } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { toast } from "sonner";


export default function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      setIsLoading(true);
      const url = nextParam ? `/api/sign-in?next=${encodeURIComponent(nextParam)}` : "/api/sign-in";
      const response = await axios.post(url, {
        ...values,
      });
      router.push("/dashboard")
      toast.success("Signed in successfully");
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md bg-card shadow-lg border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-foreground">Create an account</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-4">
          <Button variant="outline" className="w-full py-6 flex items-center justify-center gap-2 border-border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={() => { socialSignIn("google") }}>
            <FaGoogle className="text-2xl" />
            Sign in with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground text-[10px]">Or continue with email</span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <InputFormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="name@example.com"
            />

            <InputFormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="••••••••"
            />

            {/* Forgot password */}
            <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
              Forgot password?
            </Link>

            <Button type="submit" variant="default" className="w-full py-6 font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
              <FaSignInAlt className="text-2xl" />
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-2">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
