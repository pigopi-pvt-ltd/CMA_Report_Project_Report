"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import {
  ShieldAlert,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please provide your admin email address");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/admin/auth/forgot-password", { email });
      if (res.data?.success) {
        setSubmitted(true);
        toast.success("Verification code sent to your email!");
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Failed to send reset instructions. Verify your email.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-slate-100">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400 flex items-center gap-2 shadow-lg shadow-indigo-500/5">
            <KeyRound className="w-6 h-6 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Admin Credential Recovery
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mt-2">
            Reset Admin Password
          </h1>
          <p className="text-sm text-slate-400 max-w-sm">
            Enter your administrative email to receive a 6-digit verification code and reset link.
          </p>
        </div>

        {/* Card */}
        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden text-slate-100">
          <CardHeader className="space-y-1 border-b border-slate-800/80 pb-4">
            <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              Administrative Verification
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              A secure OTP will be dispatched to your registered email address
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {submitted ? (
              <div className="space-y-5 text-center">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Check Your Inbox</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    We sent a verification code to{" "}
                    <span className="text-indigo-300 font-medium">{email}</span>.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() =>
                      router.push(
                        `/admin/reset-password?email=${encodeURIComponent(email)}`
                      )
                    }
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Enter Verification Code
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setSubmitted(false)}
                    className="w-full text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs"
                  >
                    Didn&apos;t receive it? Try again
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="admin-email"
                    className="text-xs font-semibold text-slate-300"
                  >
                    Admin Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@cma.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9 bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 rounded-xl"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Verification Code...
                    </>
                  ) : (
                    <>
                      Send Reset Instructions
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Admin Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
