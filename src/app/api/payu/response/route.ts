import dbConnect from "@/db/dbConnect";
import Subscription from "@/db/models/subscriptionModel";
import { verifyPayUResponseHash } from "@/lib/payu";

/**
 * Handles PayU callback (surl / furl)
 * In browser POST callbacks, PayU submits standard form-urlencoded data.
 * Returning HTML with an auto-redirect is the safest across all browsers.
 */
export async function POST(request: Request) {
  let targetUrl = "/dashboard?payment=error";

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
      try {
        params = await request.json();
      } catch {
        const text = await request.text();
        const searchParams = new URLSearchParams(text);
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
      }
    }

    const { status, txnid, mihpayid } = params;
    const salt = process.env.PAYU_MERCHANT_SALT;

    if (!salt) {
      console.error("[PayU Response] Missing PAYU_MERCHANT_SALT");
      targetUrl = "/dashboard?payment=error&reason=config_missing";
    } else {
      const isHashValid = verifyPayUResponseHash(params, salt);
      if (!isHashValid) {
        console.error("[PayU Response] Hash mismatch", params);
        targetUrl = "/dashboard?payment=failed&reason=hash_mismatch";
      } else {
        const subscription = await Subscription.findOne({ txnid });
        if (!subscription) {
          console.error("[PayU Response] Subscription not found for txnid:", txnid);
          targetUrl = "/dashboard?payment=failed&reason=sub_not_found";
        } else if (status === "success") {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30);

          subscription.status = "active";
          subscription.paymentId = mihpayid;
          subscription.startDate = startDate;
          subscription.endDate = endDate;
          subscription.payuResponse = params;
          await subscription.save();

          targetUrl = `/dashboard?payment=success&plan=${subscription.planId}`;
        } else {
          subscription.status = "cancelled";
          subscription.paymentId = mihpayid;
          subscription.payuResponse = params;
          await subscription.save();

          targetUrl = `/dashboard?payment=failed&reason=${params.error_Message || "transaction_failed"}`;
        }
      }
    }
  } catch (error: any) {
    console.error("[PayU Response] Error:", error);
    targetUrl = "/dashboard?payment=error&reason=server_error";
  }

  // Return an HTML response that automatically redirects the browser.
  // This bypasses browser cross-site POST 303/302 blocks between payu.in and localhost.
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting to Dashboard...</title>
    <meta http-equiv="refresh" content="0;url=${targetUrl}">
  </head>
  <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f9fafb;">
    <div style="text-align: center; padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <h2 style="color: #111827; margin-bottom: 8px;">Processing Payment...</h2>
      <p style="color: #6b7280; margin-bottom: 20px;">Please wait while we redirect you to your dashboard.</p>
      <a href="${targetUrl}" style="color: #4f46e5; font-weight: bold; text-decoration: none;">Click here if not redirected automatically &rarr;</a>
    </div>
    <script>
      window.location.replace("${targetUrl}");
    </script>
  </body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
