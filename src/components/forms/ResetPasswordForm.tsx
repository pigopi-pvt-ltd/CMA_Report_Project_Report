"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  resetPasswordWithOTPSchema,
  resetPasswordWithTokenSchema,
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
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isTokenFlow = Boolean(token);
  const isOtpFlow = Boolean(email && otp);
  const hasValidParams = isTokenFlow || isOtpFlow;

  // Form for token-based reset
  const tokenForm = useForm<z.infer<typeof resetPasswordWithTokenSchema>>({
    resolver: zodResolver(resetPasswordWithTokenSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Form for OTP-based reset
  const otpForm = useForm<z.infer<typeof resetPasswordWithOTPSchema>>({
    resolver: zodResolver(resetPasswordWithOTPSchema),
    defaultValues: {
      email: email || "",
      otp: otp || "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (token) {
      tokenForm.setValue("token", token);
    }
    if (email) {
      otpForm.setValue("email", email);
    }
    if (otp) {
      otpForm.setValue("otp", otp);
    }
  }, [token, email, otp, tokenForm, otpForm]);

  async function onTokenSubmit(values: z.infer<typeof resetPasswordWithTokenSchema>) {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/reset-password", {
        token: values.token,
        password: values.password,
      });

      setIsSuccess(true);
      toast.success(res.data?.message || "Password reset successfully!");

      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const data = err?.response?.data;
      const errorMessage =
        data?.message ||
        data?.error ||
        "Failed to reset password. The reset link may be invalid or expired.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function onOtpSubmit(values: z.infer<typeof resetPasswordWithOTPSchema>) {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/reset-password", {
        email: values.email,
        otp: values.otp,
        password: values.password,
      });

      setIsSuccess(true);
      toast.success(res.data?.message || "Password reset successfully!");

      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const data = err?.response?.data;
      const errorMessage =
        data?.message ||
        data?.error ||
        "Failed to reset password. The code may be invalid or expired.";
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
            Password Changed!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your password has been updated. Redirecting to sign in...
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Go to Sign In
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (!hasValidParams) {
    return (
      <Card className="w-full max-w-md bg-card shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 dark:bg-amber-950/50 p-3 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Reset Link Missing or Invalid
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            It looks like this password reset link is invalid or incomplete. Please request a new password reset link or code.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3 justify-center pb-6">
          <Button
            asChild
            className="w-full py-6 font-semibold bg-primary text-primary-foreground hover:opacity-90"
          >
            <Link href="/forgot-password">Request New Reset Code</Link>
          </Button>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-card shadow-lg border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          Reset Your Password
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {email ? (
            <>Resetting password for <strong className="text-foreground">{email}</strong></>
          ) : (
            "Enter your new password below"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isTokenFlow ? (
          <Form {...tokenForm}>
            <form
              onSubmit={tokenForm.handleSubmit(onTokenSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={tokenForm.control}
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

              <FormField
                control={tokenForm.control}
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
                    Updating password...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              className="grid gap-4"
            >
              {/* If OTP wasn't prefilled or user needs to edit it */}
              <FormField
                control={otpForm.control}
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

              <FormField
                control={otpForm.control}
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

              <FormField
                control={otpForm.control}
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
                    Updating password...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" />
                    Reset Password
                  </>
                )}
              </Button>
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
