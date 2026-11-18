import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { requireAdminAuth } from "@/lib/adminAuth";
import UserModel from "@/db/models/userModel";
import Subscription from "@/db/models/subscriptionModel";
import ProjectReportModel from "@/db/models/projectReportModel";
import CmaReport from "@/db/models/cmaReportModel";

export async function GET(request: Request) {
  try {
    await requireAdminAuth(request);
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const filter = searchParams.get("filter") || "all";

    // 1. Build User Search Query
    const userQuery: any = {};
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await UserModel.find(userQuery)
      .sort({ createdAt: -1 })
      .lean();

    const userIds = users.map((u: any) => u._id.toString());

    // 2. Fetch Subscriptions for these users
    const allSubs = await Subscription.find({
      userId: { $in: userIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    // Map user to their latest active subscription or latest subscription
    const now = new Date();
    const userSubMap = new Map<string, any>();

    for (const sub of allSubs) {
      const existing = userSubMap.get(sub.userId);
      const isActive =
        sub.status === "active" && (sub.isLifetime || new Date(sub.endDate) > now);

      if (!existing) {
        userSubMap.set(sub.userId, sub);
      } else {
        const existingIsActive =
          existing.status === "active" &&
          (existing.isLifetime || new Date(existing.endDate) > now);

        if (!existingIsActive && isActive) {
          userSubMap.set(sub.userId, sub);
        }
      }
    }

    // 3. Count reports per user
    const [projectCounts, cmaCounts] = await Promise.all([
      ProjectReportModel.aggregate([
        { $match: { userId: { $in: users.map((u: any) => u._id) } } },
        { $group: { _id: { $toString: "$userId" }, count: { $sum: 1 } } },
      ]),
      CmaReport.aggregate([
        { $match: { userId: { $in: users.map((u: any) => u._id) } } },
        { $group: { _id: { $toString: "$userId" }, count: { $sum: 1 } } },
      ]),
    ]);

    const projectCountMap = new Map<string, number>(
      projectCounts.map((p: any) => [p._id, p.count])
    );
    const cmaCountMap = new Map<string, number>(
      cmaCounts.map((c: any) => [c._id, c.count])
    );

    // 4. Combine and format user data
    let formattedUsers = users.map((u: any) => {
      const uid = u._id.toString();
      const sub = userSubMap.get(uid);

      const isActive =
        sub &&
        sub.status === "active" &&
        (sub.isLifetime || new Date(sub.endDate) > now);

      const isLifetime = !!sub?.isLifetime;
      const daysRemaining = !sub
        ? 0
        : isLifetime
        ? 99999
        : Math.max(
            0,
            Math.ceil(
              (new Date(sub.endDate).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          );

      const pCount = projectCountMap.get(uid) || 0;
      const cCount = cmaCountMap.get(uid) || 0;

      return {
        id: uid,
        name: u.name || "Unnamed User",
        email: u.email,
        emailVerified: !!u.emailVerified,
        createdAt: u.createdAt,
        subscription: sub
          ? {
              id: sub._id.toString(),
              planId: sub.planId,
              planName: sub.planName,
              status: isActive ? "active" : sub.status,
              isActive,
              isLifetime,
              isFreeAdminGrant: !!sub.isFreeAdminGrant,
              amount: sub.amount,
              startDate: sub.startDate,
              endDate: sub.endDate,
              daysRemaining,
              notes: sub.notes,
            }
          : null,
        reportsCount: {
          project: pCount,
          cma: cCount,
          total: pCount + cCount,
        },
      };
    });

    // 5. Apply Status Filter
    if (filter === "active") {
      formattedUsers = formattedUsers.filter(
        (u) => u.subscription?.isActive && !u.subscription?.isLifetime
      );
    } else if (filter === "lifetime") {
      formattedUsers = formattedUsers.filter(
        (u) => u.subscription?.isActive && u.subscription?.isLifetime
      );
    } else if (filter === "expired") {
      formattedUsers = formattedUsers.filter(
        (u) => u.subscription && !u.subscription?.isActive
      );
    } else if (filter === "none") {
      formattedUsers = formattedUsers.filter((u) => !u.subscription);
    }

    return NextResponse.json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error: any) {
    console.error("[Admin Users List Error]:", error);
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
