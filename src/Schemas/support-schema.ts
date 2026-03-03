import { z } from "zod"

export const supportSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+91[6-9]\d{9}$/, "Phone number must be a valid Indian number starting with +91 followed by exactly 10 digits (starting with 6-9)"),
  message: z.string().min(1, "Message is required").max(200, "Message cannot exceed 200 words limit"),
})
