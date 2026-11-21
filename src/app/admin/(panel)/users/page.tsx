"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Users,
  Search,
  Sparkles,
  Gift,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  FileText,
  AlertCircle,
  Loader2,
  Calendar,
  Filter,
  Check,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string | null;
  emailVerified: boolean;
  createdAt: string;
  subscription: {
    id: string;
    planId: "project_plan" | "combo_plan";
    planName: string;
    status: string;
    isActive: boolean;
    isLifetime: boolean;
    isFreeAdminGrant: boolean;
    amount: number;
    startDate: string;
    endDate: string;
    daysRemaining: number;
    notes?: string;
  } | null;
  reportsCount: {
    project: number;
    cma: number;
    total: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Modal State
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [grantPlanId, setGrantPlanId] = useState<"combo_plan" | "project_plan">("combo_plan");
  const [grantDuration, setGrantDuration] = useState<string>("lifetime");
  const [grantNotes, setGrantNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const res = await axios.get(`/api/admin/users?filter=${activeFilter}`);
      if (res.data?.success) {
        setUsers(res.data.users);
        if (isManual) toast.success("User directory updated");
      }
    } catch (error: any) {
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeFilter]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.mobileNumber?.toLowerCase().includes(q) ||
        u.subscription?.planName?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleOpenGrantModal = (user: UserRecord) => {
    setSelectedUser(user);
    setGrantPlanId("combo_plan");
    setGrantDuration("lifetime"); // Default to lifetime as requested!
    setGrantNotes("Free Lifetime Access granted by Administrator");
    setModalOpen(true);
  };

  const handleGrantSubscription = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(true);
      const res = await axios.post("/api/admin/subscriptions/grant", {
        userId: selectedUser.id,
        planId: grantPlanId,
        duration: grantDuration,
        notes: grantNotes,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Subscription granted successfully!");
        setModalOpen(false);
        fetchUsers();
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to grant subscription";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeSubscription = async () => {
    if (!selectedUser) return;
    if (!confirm(`Are you sure you want to revoke the active subscription for ${selectedUser.name}?`)) {
      return;
    }
    try {
      setActionLoading(true);
      const res = await axios.post("/api/admin/subscriptions/revoke", {
        userId: selectedUser.id,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Subscription revoked successfully");
        setModalOpen(false);
        fetchUsers();
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to revoke subscription";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            User Management & Subscriptions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View all registered users and grant lifetime or complimentary subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            variant="outline"
            className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl h-10 px-4 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-900 dark:text-slate-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <Input
              type="text"
              placeholder="Search by user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:border-indigo-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: "all", label: "All Users" },
              { id: "lifetime", label: "Lifetime Free" },
              { id: "active", label: "Paid Active" },
              { id: "expired", label: "Expired" },
              { id: "none", label: "No Plan" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeFilter === f.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users Table Card */}
      <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-900 dark:text-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Active Plan</th>
                <th className="py-3.5 px-4">Duration / Expiry</th>
                <th className="py-3.5 px-4 text-center">Reports</th>
                <th className="py-3.5 px-5 text-right">Subscription Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                    Loading user directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const sub = user.subscription;
                  const isActive = sub?.isActive;
                  const isLifetime = sub?.isLifetime;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* User Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {user.name ? user.name.slice(0, 2) : "US"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                              {user.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                                {user.email}
                              </span>
                              {user.emailVerified ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9px] px-1 py-0 font-medium">
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 text-[9px] px-1 py-0">
                                  Unverified
                                </Badge>
                              )}
                            </div>
                            {user.mobileNumber && (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                                {user.mobileNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                        {user.createdAt ? (
                          new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        ) : (
                          "N/A"
                        )}
                      </td>

                      {/* Active Plan */}
                      <td className="py-4 px-4">
                        {!sub || !isActive ? (
                          <Badge variant="outline" className="text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 text-xs">
                            No Active Plan
                          </Badge>
                        ) : isLifetime ? (
                          <Badge className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/40 text-xs font-bold gap-1 px-2.5 py-1 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            {sub.planId === "combo_plan" ? "Combo (Lifetime)" : "Project (Lifetime)"}
                          </Badge>
                        ) : sub.planId === "combo_plan" ? (
                          <Badge className="bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold px-2.5 py-0.5">
                            Combo Plan
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 text-xs font-semibold px-2.5 py-0.5">
                            Project Plan
                          </Badge>
                        )}
                      </td>

                      {/* Expiry / Lifetime */}
                      <td className="py-4 px-4 text-xs">
                        {!sub || !isActive ? (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        ) : isLifetime ? (
                          <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Never (Lifetime)
                          </span>
                        ) : (
                          <div>
                            <span className="text-slate-800 dark:text-slate-200 font-medium">
                              {new Date(sub.endDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {sub.daysRemaining} days left
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Reports Generated */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300" title="Project Reports">
                            P: {user.reportsCount?.project || 0}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300" title="CMA Reports">
                            C: {user.reportsCount?.cma || 0}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        <Button
                          onClick={() => handleOpenGrantModal(user)}
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold gap-1.5 h-8.5 px-3.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5 text-indigo-200" />
                          {isActive ? "Manage Plan" : "Enable Free"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Grant Subscription Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Enable Subscription for User
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Grant complimentary or lifetime subscription access to this user.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-5 pt-3">
              {/* Target User Info Header */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm uppercase">
                  {selectedUser.name?.slice(0, 2) || "US"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{selectedUser.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{selectedUser.email}</p>
                </div>
                {selectedUser.subscription?.isActive && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                    Current: {selectedUser.subscription.isLifetime ? "Lifetime" : selectedUser.subscription.planName}
                  </Badge>
                )}
              </div>

              {/* Step 1: Select Plan */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Subscription Plan
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setGrantPlanId("combo_plan")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      grantPlanId === "combo_plan"
                        ? "bg-indigo-600/10 dark:bg-indigo-600/15 border-indigo-600 text-indigo-950 dark:text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Combo Plan</span>
                      {grantPlanId === "combo_plan" && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Project Report + CMA Report (Full Access)
                    </p>
                  </div>

                  <div
                    onClick={() => setGrantPlanId("project_plan")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      grantPlanId === "project_plan"
                        ? "bg-indigo-600/10 dark:bg-indigo-600/15 border-indigo-600 text-indigo-950 dark:text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Project Plan</span>
                      {grantPlanId === "project_plan" && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Project Reports Only
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Select Duration */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Access Duration
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "lifetime", label: "Lifetime", badge: "Permanent" },
                    { id: "365d", label: "1 Year", badge: "365 days" },
                    { id: "180d", label: "6 Months", badge: "180 days" },
                    { id: "30d", label: "1 Month", badge: "30 days" },
                  ].map((dur) => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => setGrantDuration(dur.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        grantDuration === dur.id
                          ? "bg-gradient-to-b from-indigo-600 to-indigo-700 border-indigo-400 text-white font-bold shadow-md shadow-indigo-600/20"
                          : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-center gap-1">
                        {dur.id === "lifetime" && <Sparkles className="w-3 h-3 text-amber-300" />}
                        {dur.label}
                      </div>
                      <span className="text-[10px] opacity-75">{dur.badge}</span>
                    </button>
                  ))}
                </div>
                {grantDuration === "lifetime" && (
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 p-2 rounded-lg border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-1.5 mt-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    User will receive permanent unlimited access and will never need to purchase again.
                  </p>
                )}
              </div>

              {/* Step 3: Admin Reason/Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="admin-notes" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Grant Notes / Reason (Optional)
                </Label>
                <Input
                  id="admin-notes"
                  value={grantNotes}
                  onChange={(e) => setGrantNotes(e.target.value)}
                  placeholder="e.g. Lifetime access granted by administrator"
                  className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-xs"
                />
              </div>

              {/* If user currently has active plan, allow revoking too */}
              {selectedUser.subscription?.isActive && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Revoke Existing Subscription</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Immediately cancel user&apos;s active subscription</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRevokeSubscription}
                    disabled={actionLoading}
                    className="border-rose-300 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-xs cursor-pointer"
                  >
                    Revoke Plan
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleGrantSubscription}
              disabled={actionLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs px-5 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Applying Grant...
                </>
              ) : (
                <>
                  <Gift className="w-3.5 h-3.5 mr-1.5" />
                  Grant Free Subscription
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
