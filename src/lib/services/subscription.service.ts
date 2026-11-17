import dbConnect from "@/db/dbConnect";
import Subscription, { ISubscription } from "@/db/models/subscriptionModel";

export interface UserSubscriptionStatus {
  hasActiveSubscription: boolean;
  planId?: "project_plan" | "combo_plan";
  planName?: string;
  canCreateProjectReport: boolean;
  canCreateCMAReport: boolean;
  endDate?: Date;
  daysRemaining?: number;
}

/**
 * Check active subscription for a user.
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscriptionStatus> {
  await dbConnect();

  const now = new Date();
  const activeSub = await Subscription.findOne({
    userId,
    status: "active",
    endDate: { $gt: now },
  }).sort({ endDate: -1 });

  if (!activeSub) {
    return {
      hasActiveSubscription: false,
      canCreateProjectReport: false,
      canCreateCMAReport: false,
    };
  }

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(activeSub.endDate).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return {
    hasActiveSubscription: true,
    planId: activeSub.planId,
    planName: activeSub.planName,
    canCreateProjectReport: true, // both plans can create project report
    canCreateCMAReport: activeSub.planId === "combo_plan", // only combo_plan can create CMA report
    endDate: activeSub.endDate,
    daysRemaining,
  };
}
