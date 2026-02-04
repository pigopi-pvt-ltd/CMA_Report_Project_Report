import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sendEmail } from "./mail";
import { nextCookies } from "better-auth/next-js";

const client = new MongoClient(process.env.MONGODB_URL || "");
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    autoSignIn: false
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
    sendVerificationEmail: async ({ user, url, token }, request) => {
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
    nextCookies()
  ]
});
