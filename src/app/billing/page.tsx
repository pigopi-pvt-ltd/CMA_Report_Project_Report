"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function BillingContent() {
  const [subData, setSubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      toast.success("Subscription activated successfully!");
    } else if (payment === "failed") {
      toast.error("Payment failed or was cancelled.");
    }

    const fetchSub = async () => {
      try {
        const res = await axios.get("/api/user/subscription");
        if (res.data.success) {
          setSubData(res.data.subscription);
        }
      } catch (err) {
        console.error("Failed to load subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSub();
  }, [searchParams]);

  return (
    <div className="flex-1 w-full min-h-screen bg-muted/5 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">Billing & Subscriptions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your PayU subscription, active plan, and report generation limits.
          </p>
        </div>

        {/* Current Subscription Card */}
        <Card className="rounded-2xl border bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Current Subscription Status</CardTitle>
                <CardDescription>Details regarding your active billing cycle</CardDescription>
              </div>
              {subData?.hasActiveSubscription ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 text-sm font-semibold">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground px-3 py-1 text-sm">
                  No Active Plan
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading subscription information...</p>
            ) : subData?.hasActiveSubscription ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Subscribed Plan</span>
                    <span className="font-bold text-base text-foreground">{subData.planName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Days Remaining</span>
                    <span className="font-semibold text-primary">
                      {subData.isLifetime ? "Lifetime Access" : `${subData.daysRemaining} days`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Renews / Expires on</span>
                    <span className="text-sm font-medium text-foreground">
                      {subData.isLifetime
                        ? "Lifetime (Never Expires)"
                        : new Date(subData.endDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-bold">Project Reports</p>
                      <p className="text-xs text-muted-foreground">Enabled (Unlimited)</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
                    {subData.canCreateCMAReport ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                    <div>
                      <p className="text-sm font-bold">CMA Reports</p>
                      <p className="text-xs text-muted-foreground">
                        {subData.canCreateCMAReport ? "Enabled (Unlimited)" : "Requires ₹999 Plan"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href="/pricing" className="flex items-center gap-1.5">
                      Upgrade / Change Plan
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-lg">You do not have an active subscription</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Subscribe to start creating and downloading bank-ready Project Reports and CMA Reports.
                  </p>
                </div>
                <Button asChild className="rounded-xl font-bold">
                  <Link href="/pricing">View Plans & Subscribe</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-muted-foreground">Loading billing...</div>}>
      <BillingContent />
    </Suspense>
  );
}
