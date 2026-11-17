import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import dbConnect from "@/db/dbConnect";
import Subscription from "@/db/models/subscriptionModel";
import { SAAS_PLANS } from "@/data/pricing-details";
import { generatePayURequestHash } from "@/lib/payu";

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request);
    await dbConnect();

    const body = await request.json();
    const { planId } = body;

    const plan = SAAS_PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const merchantKey = process.env.PAYU_MERCHANT_KEY;
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;

    if (!merchantKey || !merchantSalt) {
      return NextResponse.json(
        {
          error:
            "PayU credentials are not configured in .env (PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT)",
        },
        { status: 500 }
      );
    }

    const txnid = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const amount = Number(plan.price).toFixed(2);
    const productinfo = plan.name;
    const firstname = session.user.name?.split(" ")[0] || "User";
    const email = session.user.email;
    const phone = (session.user as any)?.phone || "9999999999";

    // Subscription dates (1 month = 30 days)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Save pending subscription record in DB
    await Subscription.create({
      userId: session.user.id,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      status: "pending",
      startDate,
      endDate,
      txnid,
    });

    const hashParams = {
      key: merchantKey,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1: session.user.id,
      udf2: plan.id,
    };

    const hash = generatePayURequestHash(hashParams, merchantSalt);

    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const surl = `${baseUrl}/api/payu/response`;
    const furl = `${baseUrl}/api/payu/response`;

    return NextResponse.json({
      success: true,
      boltParams: {
        key: merchantKey,
        txnid,
        hash,
        amount,
        firstname,
        email,
        phone,
        productinfo,
        surl,
        furl,
        service_provider: "payu_paisa",
        mode: process.env.PAYU_MODE || "TEST",
        udf1: session.user.id,
        udf2: plan.id,
      },
    });
  } catch (error: any) {
    console.error("PayU checkout init error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
