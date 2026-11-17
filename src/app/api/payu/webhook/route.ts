import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Subscription from "@/db/models/subscriptionModel";
import { verifyPayUResponseHash } from "@/lib/payu";

/**
 * PayU Webhook / Server-to-Server Notification Endpoint
 * PayU posts payment status directly here in JSON or form-data
 */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const contentType = request.headers.get("content-type") || "";
    let params: Record<string, any> = {};

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        params[key] = value.toString();
      });
    } else {
      params = await request.json();
    }

    const { status, txnid, mihpayid } = params;
    const salt = process.env.PAYU_MERCHANT_SALT;

    if (!salt) {
      console.error("[PayU Webhook] PAYU_MERCHANT_SALT is not defined");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Verify hash integrity
    const isValid = verifyPayUResponseHash(params, salt);
    if (!isValid) {
      console.error("[PayU Webhook] Hash validation failed for txnid:", txnid);
      return NextResponse.json({ error: "Invalid hash signature" }, { status: 400 });
    }

    const subscription = await Subscription.findOne({ txnid });
    if (!subscription) {
      console.warn("[PayU Webhook] No subscription record found for txnid:", txnid);
      return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
    }

    // If already active, acknowledge PayU webhook with 200 OK
    if (subscription.status === "active") {
      return NextResponse.json({ message: "Subscription already active" }, { status: 200 });
    }

    if (status === "success") {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      subscription.status = "active";
      subscription.paymentId = mihpayid;
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      subscription.payuResponse = params;
      await subscription.save();

      console.log(`[PayU Webhook] Subscription successfully activated for txnid: ${txnid}`);
      return NextResponse.json({ status: "success", message: "Subscription activated" }, { status: 200 });
    } else {
      subscription.status = "cancelled";
      subscription.paymentId = mihpayid;
      subscription.payuResponse = params;
      await subscription.save();

      console.log(`[PayU Webhook] Subscription marked as cancelled for txnid: ${txnid}`);
      return NextResponse.json({ status: "cancelled", message: "Subscription updated" }, { status: 200 });
    }
  } catch (error: any) {
    console.error("[PayU Webhook] Error processing notification:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
