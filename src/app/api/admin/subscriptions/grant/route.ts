import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { requireAdminAuth } from "@/lib/adminAuth";
import Subscription from "@/db/models/subscriptionModel";
import UserModel from "@/db/models/userModel";

export async function POST(request: Request) {
  try {
    const admin = await requireAdminAuth(request);
    await dbConnect();

    const body = await request.json();
    const { userId, planId = "combo_plan", duration = "lifetime", notes } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!["combo_plan", "project_plan"].includes(planId)) {
      return NextResponse.json(
        { success: false, message: "Invalid plan ID. Must be combo_plan or project_plan" },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await UserModel.findById(userId).lean();
    if (!user) {
      try {
        const u = await UserModel.db.collection("user").findOne({ _id: userId as any });
        user = u as any;
      } catch {
        // ignore
      }
    }

    // Cancel any previous active subscriptions for this user
    await Subscription.updateMany(
      { userId, status: "active" },
      { $set: { status: "cancelled", notes: "Superseded by Admin grant" } }
    );

    const startDate = new Date();
    let endDate: Date;
    const isLifetime = duration === "lifetime";

    if (isLifetime) {
      endDate = new Date("2099-12-31T23:59:59.999Z");
    } else {
      let days = 30;
      if (duration === "90d") days = 90;
      else if (duration === "180d") days = 180;
      else if (duration === "365d") days = 365;
      endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    const planName =
      planId === "combo_plan"
        ? "Combo Plan (Project + CMA)"
        : "Project Report Plan";

    const subscription = await Subscription.create({
      userId,
      planId,
      planName,
      amount: 0,
      status: "active",
      startDate,
      endDate,
      isLifetime,
      isFreeAdminGrant: true,
      txnid: `admin_free_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      paymentId: "ADMIN_FREE_GRANT",
      notes: notes || `Free ${isLifetime ? "Lifetime" : duration} subscription granted by Admin (${admin.email})`,
    });

    return NextResponse.json({
      success: true,
      message: isLifetime
        ? `Lifetime free subscription (${planName}) successfully granted!`
        : `Free subscription (${planName}) successfully granted!`,
      subscription,
    });
  } catch (error: any) {
    console.error("[Admin Grant Subscription Error]:", error);
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Failed to grant subscription" },
      { status: 500 }
    );
  }
}
