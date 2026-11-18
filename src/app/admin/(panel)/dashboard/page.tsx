"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Users,
  CreditCard,
  TrendingUp,
  Sparkles,
  IndianRupee,
  FileText,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#64748b"];

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const res = await axios.get("/api/admin/stats");
      if (res.data?.success) {
        setData(res.data);
        if (isManual) toast.success("Dashboard metrics updated!");
      }
    } catch (error: any) {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-slate-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
          <div className="h-80 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalPurchasedUsers: 0,
    activeSubscriptionsCount: 0,
    lifetimeCount: 0,
    freeAdminGrantsCount: 0,
    totalRevenue: 0,
    totalReports: 0,
    totalProjectReports: 0,
    totalCmaReports: 0,
  };

  const charts = data?.charts || {
    monthlyStats: [],
    planDistribution: [],
    statusBreakdown: [],
  };

  const recent = data?.recent || {
    users: [],
    subscriptions: [],
  };

  const purchaseRate = stats.totalUsers > 0
    ? Math.round((stats.totalPurchasedUsers / stats.totalUsers) * 100)
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Admin Overview & Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time breakdown of user accounts, purchases, and system usage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            variant="outline"
            className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl h-10 px-4 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>

          <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-4 cursor-pointer">
            <Link href="/admin/users" className="flex items-center gap-1.5 font-semibold">
              Manage Users
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Users */}
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Users
            </CardTitle>
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Registered customer accounts</span>
            </p>
          </CardContent>
        </Card>

        {/* Purchased Users */}
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Purchased Users
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalPurchasedUsers}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{purchaseRate}% conversion rate</span>
            </p>
          </CardContent>
        </Card>

        {/* Lifetime & Free Subscriptions */}
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lifetime Grants
            </CardTitle>
            <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.lifetimeCount}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1.5 flex items-center gap-1.5 font-medium">
              <span>{stats.activeSubscriptionsCount} total active subs</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
              <span>{stats.totalReports} total reports generated</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Primary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registrations vs Purchases Monthly Growth */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  User Signups & Purchases Trend
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Monthly breakdown of new user registrations vs subscription activations
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 text-xs">
                Last 6 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={charts.monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Bar
                    dataKey="users"
                    name="Registered Users"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                  <Line
                    type="monotone"
                    dataKey="purchases"
                    name="Purchases / Activations"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution Donut Chart */}
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Plan Distribution
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Active plan breakdown across all users
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.planDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {charts.planDistribution.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend tags */}
            <div className="mt-3 space-y-2 text-xs">
              {charts.planDistribution.map((entry: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-300">{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts: Revenue Trend & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Monthly Revenue (₹)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Revenue collected from subscriptions over time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.monthlyStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status Counts */}
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Subscription Status Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current subscription states and admin grants
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {charts.statusBreakdown.map((item: any, i: number) => {
              const pct = stats.totalUsers > 0
                ? Math.round((item.count / stats.totalUsers) * 100)
                : 0;

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.count} <span className="text-slate-500 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(item.count > 0 ? 5 : 0, pct)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity: Users & Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Users */}
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Recent Registrations</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Latest users who created an account
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
              <Link href="/admin/users">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {recent.users?.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No users found.</p>
              ) : (
                recent.users.map((u: any) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                        {u.name?.slice(0, 2) || "US"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Latest Subscriptions */}
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Recent Subscription Events</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Purchases and admin subscription grants
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
              <Link href="/admin/users">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {recent.subscriptions?.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No subscriptions recorded yet.</p>
              ) : (
                recent.subscriptions.map((s: any) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{s.planName}</p>
                        {s.isLifetime && (
                          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20 text-[10px] py-0">
                            Lifetime
                          </Badge>
                        )}
                        {s.isFreeAdminGrant && (
                          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20 text-[10px] py-0">
                            Admin Free
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Amount: {s.amount > 0 ? `₹${s.amount}` : "Free Grant"}
                      </p>
                    </div>
                    <Badge
                      className={`text-[10px] capitalize ${
                        s.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {s.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
