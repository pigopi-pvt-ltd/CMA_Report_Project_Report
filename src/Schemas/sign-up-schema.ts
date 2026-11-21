import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.email("Invalid email address"),
    mobileNumber: z
      .string()
      .min(1, "Mobile number is required")
      .refine(
        (val) => val.replace(/\D/g, "").length >= 10,
        "Mobile number must contain at least 10 digits"
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signUpServerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

