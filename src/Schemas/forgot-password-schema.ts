import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export const resetPasswordWithOTPSchema = z
  .object({
    email: z.email("Invalid email address"),
    otp: z
      .string()
      .min(6, "OTP must be at least 6 characters")
      .max(10, "Invalid OTP format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordWithTokenSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordServerSchema = z.object({
  email: z.email("Invalid email address").optional(),
  otp: z.string().optional(),
  token: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
}).refine(
  (data) => (data.email && data.otp) || data.token,
  {
    message: "Either email and OTP or a reset token must be provided",
    path: ["otp"],
  }
);
