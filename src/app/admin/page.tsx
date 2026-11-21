"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if admin is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("/api/admin/auth/me");
        if (res.data?.authenticated) {
          router.replace("/admin/dashboard");
          return;
        }
      } catch {
        // Not authenticated, stay on login page
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/admin/auth/login", { email, password });
      if (res.data?.success) {
        toast.success("Welcome back, Administrator!");
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Invalid admin credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-3 font-medium">
          Verifying security authorization...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-slate-100">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Security Alert Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 flex items-center gap-2 shadow-lg shadow-red-500/5">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-300">
              Restricted Area • Admin Portal
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mt-2">
            Admin Management Console
          </h1>
          <p className="text-sm text-slate-400 max-w-sm">
            Sign in with authorized administrative credentials to manage users, plans, and reports.
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden text-slate-100">
          <CardHeader className="space-y-1 border-b border-slate-800/80 pb-4">
            <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Administrator Authentication
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Credentials are encrypted and protected by session cookies
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-xs font-semibold text-slate-300">
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-password" className="text-xs font-semibold text-slate-300">
                    Password
                  </Label>
                  <Link
                    href="/admin/forgot-password"
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    Access Admin Console
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Discreet Notice */}
        <p className="text-center text-xs text-slate-500">
          Unauthorized access attempts are monitored and recorded.
        </p>
      </div>
    </div>
  );
}
