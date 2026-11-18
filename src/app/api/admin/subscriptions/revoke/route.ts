import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { requireAdminAuth } from "@/lib/adminAuth";
import Subscription from "@/db/models/subscriptionModel";

export async function POST(request: Request) {
  try {
    const admin = await requireAdminAuth(request);
    await dbConnect();

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await Subscription.updateMany(
      { userId, status: "active" },
      {
        $set: {
          status: "cancelled",
          notes: `Revoked by Admin (${admin.email}) on ${new Date().toISOString()}`,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Active subscription revoked successfully (${result.modifiedCount} modified)`,
    });
  } catch (error: any) {
    console.error("[Admin Revoke Subscription Error]:", error);
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Failed to revoke subscription" },
      { status: 500 }
    );
  }
}
