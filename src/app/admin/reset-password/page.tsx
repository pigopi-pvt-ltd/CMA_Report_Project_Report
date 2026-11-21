"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Binary,
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

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qEmail = searchParams.get("email");
    const qToken = searchParams.get("token");
    const qOtp = searchParams.get("otp");

    if (qEmail) setEmail(qEmail);
    if (qToken) setToken(qToken);
    if (qOtp) setOtp(qOtp);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your admin email");
      return;
    }

    if (!token && !otp) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/admin/auth/reset-password", {
        email,
        otp: otp ? otp.trim() : undefined,
        token: token ? token.trim() : undefined,
        password,
      });

      if (res.data?.success) {
        toast.success("Admin password reset successfully! Redirecting...");
        setTimeout(() => {
          router.push("/admin");
        }, 1200);
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Failed to reset password. Please check your verification code.";
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
              Admin Credential Reset
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mt-2">
            Set New Password
          </h1>
          <p className="text-sm text-slate-400 max-w-sm">
            {token
              ? "Your reset link has been verified. Enter your new password below."
              : "Enter the 6-digit code sent to your email and your new password."}
          </p>
        </div>

        {/* Card */}
        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden text-slate-100">
          <CardHeader className="space-y-1 border-b border-slate-800/80 pb-4">
            <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Update Administrator Access
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Password will be encrypted and updated in the system database
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="admin-email"
                  className="text-xs font-semibold text-slate-300"
                >
                  Admin Email
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

              {/* OTP (if not using direct link token) */}
              {!token && (
                <div className="space-y-2">
                  <Label
                    htmlFor="admin-otp"
                    className="text-xs font-semibold text-slate-300"
                  >
                    6-Digit Verification Code
                  </Label>
                  <div className="relative">
                    <Binary className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="admin-otp"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="pl-9 tracking-widest font-mono text-base bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="new-password"
                  className="text-xs font-semibold text-slate-300"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-9 pr-10 bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-xs font-semibold text-slate-300"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
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
                    Updating Password...
                  </>
                ) : (
                  <>
                    Update Admin Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

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

export default function AdminResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
