import { sendEmail } from "@/lib/mail";
import { requireAuth } from "@/lib/requireAuth";
import { supportSchema } from "@/Schemas/support-schema";
import { NextResponse } from "next/server";

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export async function POST(request: Request) {

  try {
    await requireAuth(request)
    const body = await request.json()
    const { name, email, phoneNumber, message } = supportSchema.parse(body);
    const safeMessage = escapeHtml(message)
    await sendEmail({
      to: email,
      subject: "Support Query",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="margin-bottom: 10px;">Hello ${name},</h2>

      <p>
        Thank you for reaching out to our support team. We’ve received your message
        and will get back to you as soon as possible.
      </p>

      <hr style="margin: 20px 0;" />

      <h3 style="margin-bottom: 8px;">📩 Your Message Details</h3>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>

      <p style="margin-top: 12px;"><strong>Message:</strong></p>
      <blockquote
        style="
          margin: 0;
          padding: 12px;
          background: #f9f9f9;
          border-left: 4px solid #6366f1;
        "
      >
        ${message.replace(/\n/g, "<br />")}
      </blockquote>

      <p style="margin-top: 20px;">
        Our team will review your query and respond shortly.
      </p>

      <p>
        Best regards,<br />
        <strong>Support Team</strong>
      </p>
    </div>
  `,
      text: `
        Hello ${name},

        Thank you for contacting our support team. We have received your message.

        --- Your Message Details ---

        Name: ${name}
        Email: ${email}
        Phone Number: ${phoneNumber}

        Message:
        ${message}

        Our team will get back to you shortly.

        Best regards,
        Support Team
        `,
    })

    return NextResponse.json({
      message: "Email Sent Successfully"
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({
      message: "Internal Server Error " + error
    }, { status: 500 })
  }
}
