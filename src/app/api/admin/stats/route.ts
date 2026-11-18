import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { requireAdminAuth } from "@/lib/adminAuth";
import UserModel from "@/db/models/userModel";
import Subscription from "@/db/models/subscriptionModel";
import ProjectReportModel from "@/db/models/projectReportModel";
import CmaReport from "@/db/models/cmaReportModel";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function GET(request: Request) {
  try {
    await requireAdminAuth(request);
    await dbConnect();

    const now = new Date();

    // 1. Total Registered Users
    let totalUsers = await UserModel.countDocuments();
    if (totalUsers === 0 && (UserModel.db as any)?.collection) {
      try {
        totalUsers = await UserModel.db.collection("user").countDocuments();
      } catch (e) {
        // ignore
      }
    }

    // 2. Subscriptions metrics
    // Users who have purchased (paid subscriptions with amount > 0 or not free grant)
    const paidUserIds = await Subscription.distinct("userId", {
      $or: [{ amount: { $gt: 0 } }, { paymentId: { $exists: true, $ne: "ADMIN_FREE_GRANT" } }],
      status: { $in: ["active", "expired"] },
    });
    const totalPurchasedUsers = paidUserIds.length;

    // Active subscriptions
    const activeSubscriptionsCount = await Subscription.countDocuments({
      status: "active",
      $or: [{ endDate: { $gt: now } }, { isLifetime: true }],
    });

    // Lifetime subscriptions
    const lifetimeCount = await Subscription.countDocuments({
      status: "active",
      isLifetime: true,
    });

    // Admin Free Grants
    const freeAdminGrantsCount = await Subscription.countDocuments({
      status: "active",
      isFreeAdminGrant: true,
    });

    // Revenue calculation (total paid)
    const revenueAgg = await Subscription.aggregate([
      {
        $match: {
          status: { $in: ["active", "expired"] },
          amount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Reports counts
    const totalProjectReports = await ProjectReportModel.countDocuments();
    const totalCmaReports = await CmaReport.countDocuments();

    // 3. Monthly Trends (Last 6 months)
    const monthlyStats: Array<{
      month: string;
      users: number;
      purchases: number;
      revenue: number;
    }> = [];

    const currentYear = now.getFullYear();
    const currentMonthIdx = now.getMonth();

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonthIdx - i, 1);
      const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
      const monthLabel = MONTH_NAMES[targetDate.getMonth()];

      // Users joined in this month
      const usersInMonth = await UserModel.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });

      // Subscriptions in this month
      const subsInMonth = await Subscription.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        status: { $in: ["active", "expired"] },
      });

      // Revenue in this month
      const revMonthAgg = await Subscription.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            status: { $in: ["active", "expired"] },
            amount: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: "$amount" },
          },
        },
      ]);
      const revInMonth = revMonthAgg[0]?.sum || 0;

      monthlyStats.push({
        month: monthLabel,
        users: usersInMonth,
        purchases: subsInMonth,
        revenue: revInMonth,
      });
    }

    // 4. Plan Distribution
    const activeCombo = await Subscription.countDocuments({
      status: "active",
      planId: "combo_plan",
      $or: [{ endDate: { $gt: now } }, { isLifetime: true }],
    });

    const activeProject = await Subscription.countDocuments({
      status: "active",
      planId: "project_plan",
      $or: [{ endDate: { $gt: now } }, { isLifetime: true }],
    });

    const noActivePlanUsers = Math.max(0, totalUsers - (activeCombo + activeProject));

    const planDistribution = [
      { name: "Combo Plan (All Access)", value: activeCombo, color: "#8b5cf6" },
      { name: "Project Plan", value: activeProject, color: "#3b82f6" },
      { name: "No Active Plan", value: noActivePlanUsers, color: "#9ca3af" },
    ];

    // 5. Subscription Status Breakdown
    const paidActiveCount = Math.max(0, activeSubscriptionsCount - freeAdminGrantsCount);
    const expiredCount = await Subscription.countDocuments({
      status: "expired",
    });

    const statusBreakdown = [
      { name: "Paid Active", count: paidActiveCount, color: "#10b981" },
      { name: "Lifetime / Free Grant", count: freeAdminGrantsCount, color: "#6366f1" },
      { name: "Expired Subscriptions", count: expiredCount, color: "#f59e0b" },
      { name: "Users Without Plan", count: noActivePlanUsers, color: "#6b7280" },
    ];

    // 6. Recent Registrations & Subscriptions
    const recentUsersRaw = await UserModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentSubscriptionsRaw = await Subscription.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalPurchasedUsers,
        activeSubscriptionsCount,
        lifetimeCount,
        freeAdminGrantsCount,
        totalRevenue,
        totalReports: totalProjectReports + totalCmaReports,
        totalProjectReports,
        totalCmaReports,
      },
      charts: {
        monthlyStats,
        planDistribution,
        statusBreakdown,
      },
      recent: {
        users: recentUsersRaw.map((u: any) => ({
          id: u._id.toString(),
          name: u.name || "Unnamed User",
          email: u.email,
          createdAt: u.createdAt,
        })),
        subscriptions: recentSubscriptionsRaw.map((s: any) => ({
          id: s._id.toString(),
          userId: s.userId,
          planName: s.planName,
          amount: s.amount,
          status: s.status,
          isLifetime: !!s.isLifetime,
          isFreeAdminGrant: !!s.isFreeAdminGrant,
          createdAt: s.createdAt,
        })),
      },
    });
  } catch (error: any) {
    console.error("[Admin Stats Error]:", error);
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
