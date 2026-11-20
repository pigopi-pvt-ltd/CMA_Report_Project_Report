"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  forgotPasswordSchema,
  resetPasswordWithOTPSchema,
} from "@/Schemas/forgot-password-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get("email") || "";
  const queryOtp = searchParams.get("otp") || "";

  const [step, setStep] = useState<"request" | "reset">(
    queryOtp ? "reset" : "request"
  );
  const [activeEmail, setActiveEmail] = useState<string>(queryEmail || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form for Step 1: Request OTP
  const requestForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: queryEmail,
    },
    mode: "onBlur",
  });

  // Form for Step 2: Reset Password with OTP
  const resetForm = useForm<z.infer<typeof resetPasswordWithOTPSchema>>({
    resolver: zodResolver(resetPasswordWithOTPSchema),
    defaultValues: {
      email: queryEmail,
      otp: queryOtp,
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Cooldown timer for resending OTP
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Step 1 Submission: Request OTP
  async function onRequestSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/forgot-password", {
        email: values.email,
      });

      setActiveEmail(values.email);
      resetForm.setValue("email", values.email);
      setStep("reset");
      setCooldown(60);
      toast.success(
        res.data?.message || "Verification code sent to your email"
      );
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string; errors?: Array<{ message: string }> } };
        message?: string;
      };
      const data = err?.response?.data;
      const errorMessage =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) && data.errors[0]?.message) ||
        err?.message ||
        "Failed to send verification code. Please try again.";

      if (
        typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("email")
      ) {
        requestForm.setError("email", {
          type: "manual",
          message: errorMessage,
        });
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Resend OTP
  async function handleResendOTP() {
    if (cooldown > 0 || !activeEmail) return;
    try {
      setIsResending(true);
      const res = await axios.post("/api/forgot-password", {
        email: activeEmail,
      });
      setCooldown(60);
      toast.success(
        res.data?.message || "A new verification code has been sent to your email"
      );
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const data = err?.response?.data;
      const errorMessage =
        data?.message ||
        data?.error ||
        err?.message ||
        "Failed to resend verification code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  }

  // Handle Step 2 Submission: Reset Password
  async function onResetSubmit(values: z.infer<typeof resetPasswordWithOTPSchema>) {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/reset-password", {
        email: values.email,
        otp: values.otp,
        password: values.password,
      });

      setIsSuccess(true);
      toast.success(
        res.data?.message || "Password reset successfully!"
      );

      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string; errors?: Array<{ message: string }> } };
        message?: string;
      };
      const data = err?.response?.data;
      const errorMessage =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) && data.errors[0]?.message) ||
        err?.message ||
        "Failed to reset password. Please check your code and try again.";

      if (
        typeof errorMessage === "string" &&
        (errorMessage.toLowerCase().includes("otp") ||
          errorMessage.toLowerCase().includes("code") ||
          errorMessage.toLowerCase().includes("invalid"))
      ) {
        resetForm.setError("otp", {
          type: "manual",
          message: errorMessage,
        });
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md bg-card shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-950/50 p-3 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Password Reset Complete
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your password has been reset successfully. Redirecting you to the sign in page...
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Go to Sign In now
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-card shadow-lg border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          {step === "request" ? "Forgot your password?" : "Set new password"}
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {step === "request"
            ? "Enter your email address and we'll send you a 6-digit verification code and reset link."
            : `Enter the 6-digit code sent to ${activeEmail || "your email"} and choose a new password.`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === "request" ? (
          <Form {...requestForm}>
            <form
              onSubmit={requestForm.handleSubmit(onRequestSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={requestForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit(onResetSubmit)}
              className="grid gap-4"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1">
                <span>
                  Code sent to: <strong className="text-foreground">{activeEmail}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  Change email
                </button>
              </div>

              {/* OTP Field */}
              <FormField
                control={resetForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code (OTP)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="6-digit code (e.g. 123456)"
                          maxLength={8}
                          className="pl-10 font-mono tracking-widest text-base"
                        />
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Confirm New Password */}
              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" />
                    Reset Password
                  </>
                )}
              </Button>

              {/* Resend OTP button */}
              <div className="text-center pt-2">
                {cooldown > 0 ? (
                  <span className="text-xs text-muted-foreground">
                    Resend code in <span className="font-semibold">{cooldown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isResending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Didn&apos;t get the code? Resend
                  </button>
                )}
              </div>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center pb-6">
        <Link
          href="/sign-in"
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
