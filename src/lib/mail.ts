import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
    
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function sendPasswordResetOTPEmail({
  to,
  otp,
  resetUrl,
}: {
  to: string;
  otp: string;
  resetUrl: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .logo { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 24px; text-align: center; }
        h1 { font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-align: center; }
        p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px; }
        .otp-box { background: #f1f5f9; border: 1.5px dashed #cbd5e1; border-radius: 8px; padding: 18px 24px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0f172a; }
        .otp-sub { font-size: 12px; color: #64748b; margin-top: 6px; }
        .btn-wrapper { text-align: center; margin: 28px 0; }
        .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-size: 14px; font-weight: 600; padding: 12px 28px; text-decoration: none; border-radius: 6px; }
        .divider { height: 1px; background: #e2e8f0; margin: 28px 0; border: none; }
        .footer { font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center; }
        .link-alt { word-break: break-all; color: #2563eb; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">CMA Platform</div>
        <h1>Reset Your Password</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password. Use the 6-digit verification code below to complete your password reset:</p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="otp-sub">This code expires in 10 minutes</div>
        </div>

        <p style="text-align: center; margin-bottom: 8px;">Or click the button below to reset your password directly:</p>
        <div class="btn-wrapper">
          <a href="${resetUrl}" class="btn" target="_blank">Reset Password Directly</a>
        </div>

        <p style="font-size: 13px; color: #64748b;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}" class="link-alt" target="_blank">${resetUrl}</a></p>

        <hr class="divider" />
        <div class="footer">
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Your Password Reset Code: ${otp}`,
    html,
    text: `Your password reset OTP is ${otp}. It expires in 10 minutes. Alternatively, visit this link: ${resetUrl}`,
  });
}

export async function sendPasswordResetLinkEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .logo { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 24px; text-align: center; }
        h1 { font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-align: center; }
        p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px; }
        .btn-wrapper { text-align: center; margin: 28px 0; }
        .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-size: 14px; font-weight: 600; padding: 12px 28px; text-decoration: none; border-radius: 6px; }
        .divider { height: 1px; background: #e2e8f0; margin: 28px 0; border: none; }
        .footer { font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center; }
        .link-alt { word-break: break-all; color: #2563eb; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">CMA Platform</div>
        <h1>Reset Your Password</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
        
        <div class="btn-wrapper">
          <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
        </div>

        <p style="font-size: 13px; color: #64748b;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}" class="link-alt" target="_blank">${resetUrl}</a></p>

        <p style="font-size: 12px; color: #64748b;">This link will expire in 1 hour.</p>

        <hr class="divider" />
        <div class="footer">
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "Reset your password",
    html,
    text: `Reset your password by visiting this link: ${resetUrl}`,
  });
}