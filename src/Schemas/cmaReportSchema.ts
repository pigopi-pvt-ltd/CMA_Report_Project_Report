import { z } from "zod";

// ENUMS
export const industryTypeEnum = z.enum([
  "manufacturing",
  "service",
  "trading",
  "agriculture",
]);

export const loanTypeEnum = z.enum([
  "mudra",
  "pmegp",
  "msme",
  "others",
]);

export const salesTypeEnum = z.enum(["monthly", "unit"]);
export const genderEnum = z.enum(["male", "female", "other"]);
export const categoryEnum = z.enum(["general", "obc", "sc", "st"]);
export const educationQualificationEnum = z.enum([
  "8fail",
  "8pass",
  "10pass",
  "12pass",
  "graduate",
  "postGraduate",
  "phd",
]);
export const workExperienceEnum = z.enum([
  "0to2",
  "2to3",
  "3to5",
  "5+",
]);
export const legalConstitutionEnum = z.enum([
  "proprietorship",
  "partnership",
  "privateltd",
  "llp",
  "others",
]);
export const employementPotentialEnum = z.enum([
  "0to2",
  "2to5",
  "5to10",
  "10+",
]);
export const businessStartDateEnum = z.enum([
  "notStarted",
  "6monthsAgo",
  "6to12monthsAgo",
  "2to3yearsAgo",
]);

// SUB SCHEMAS
export const personalDetailsSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  mobile: z.string().min(10),
  businessMobile: z.string().min(10),
  personalAddress: z.string().min(1),
  businessAddress: z.string().min(1),
  gender: genderEnum,
  category: categoryEnum,
  educationQualification: educationQualificationEnum,
  workExperience: workExperienceEnum,
});

export const businessDetailsSchema = z.object({
  businessName: z.string().min(1),
  legalConstitution: legalConstitutionEnum,
  employementPotential: employementPotentialEnum,
  businessStartDate: businessStartDateEnum,
});

export const salesRevenueDetailsSchema = z.object({
  productName: z.string().min(1),
  salesType: salesTypeEnum,
  salesRevenue: z.number().min(0),
});

// ✅ FINAL CMA SCHEMA
export const cmaReportSchema = z.object({
  // STEP 1
  businessName: z.string().min(1),

  // STEP 2–4
  businessType: z.string().min(1),
  industryType: industryTypeEnum,
  loanType: loanTypeEnum,

  // STEP 5–6
  businessRequirements: z.record(z.string(), z.number().optional()).optional(),
  monthlyExpenses: z.record(z.string(), z.number().optional()).optional(),

  // STEP 7–8
  revenueDetails: salesRevenueDetailsSchema,
  loanPeriod: z.number().min(5).max(10),

  // STEP 9–10
  personalDetails: personalDetailsSchema,
  businessDetails: businessDetailsSchema,
});

export type cmaReportType = z.infer<typeof cmaReportSchema>;
