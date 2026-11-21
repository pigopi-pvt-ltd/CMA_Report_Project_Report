import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sendEmail, sendPasswordResetLinkEmail, sendPasswordResetOTPEmail } from "./mail";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URL || "");
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  user: {
    additionalFields: {
      mobileNumber: {
        type: "string",
        required: false,
        input: true,
      },
      phoneNumber: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url, token }) => {
      const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
      const resetUrl = url || `${baseUrl}/reset-password?token=${token}`;
      await sendPasswordResetLinkEmail({
        to: user.email,
        resetUrl,
      });
      console.log("Password reset link sent successfully");
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "compact" // or "jwt" or "jwe"
    }
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Click the link to verify your email: ${url}</p>`,
        text: `Click the link to verify your email: ${url}`,
      });
      console.log("Verification email sent successfully")
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "forget-password") {
          const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
          const resetUrl = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`;
          await sendPasswordResetOTPEmail({
            to: email,
            otp,
            resetUrl,
          });
          console.log("Password reset OTP sent successfully");
        }
      },
      expiresIn: 600, // 10 minutes
      otpLength: 6,
    }),
  ]
});
