import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { getUserSubscription } from "@/lib/services/subscription.service";

export async function GET(request: Request) {
  try {
    const session = await requireAuth(request);
    const subscriptionInfo = await getUserSubscription(session.user.id);

    return NextResponse.json({
      success: true,
      subscription: subscriptionInfo,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
