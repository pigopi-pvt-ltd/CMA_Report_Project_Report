import { z } from "zod";

// ENUMS
export const industryTypeEnum = z.enum([
  "manufacturing",
  "service",
  "trading",
  "agriculture",
], { message: "Please select an industry type" });

export const loanTypeEnum = z.enum([
  "mudra",
  "pmegp",
  "msme",
  "others",
], { message: "Please select a loan type" });

export const salesTypeEnum = z.enum(["monthly", "unit"], { message: "Please select a sales type" });
export const genderEnum = z.enum(["male", "female", "other"], { message: "Please select your gender" });
export const categoryEnum = z.enum(["general", "obc", "sc", "st"], { message: "Please select your category" });
export const educationQualificationEnum = z.enum([
  "8fail", "8pass", "10pass", "12pass", "graduate", "postGraduate", "phd",
], { message: "Please select your educational qualification" });

export const workExperienceEnum = z.enum([
  "0to2", "2to3", "3to5", "5+",
], { message: "Please select your work experience" });

export const legalConstitutionEnum = z.enum([
  "proprietorship", "partnership", "privateltd", "llp", "others",
], { message: "Please select legal constitution" });

export const employementPotentialEnum = z.enum([
  "0to2", "2to5", "5to10", "10+",
], { message: "Please select employment potential" });

export const businessStartDateEnum = z.enum([
  "notStarted", "6monthsAgo", "6to12monthsAgo", "2to3yearsAgo",
], { message: "Please select a business start date" });

// SUB SCHEMAS
export const personalDetailsSchema = z.object({
  fullName: z.string({ message: "Full name is required" }).min(1, "Please enter your full name"),
  email: z.string({ message: "Email is required" }).email("Please enter a valid email address"),
  mobile: z.string({ message: "Mobile number is required" }).regex(/^\+91[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  businessMobile: z.string({ message: "Business mobile is required" }).regex(/^\+91[6-9]\d{9}$/, "Please enter a valid 10-digit Indian business mobile number"),
  personalAddress: z.string({ message: "Personal address is required" }).min(1, "Please enter your complete personal address"),
  businessAddress: z.string({ message: "Business address is required" }).min(1, "Please enter your complete business address"),
  gender: genderEnum,
  category: categoryEnum,
  educationQualification: educationQualificationEnum,
  workExperience: workExperienceEnum,
});

export const businessDetailsSchema = z.object({
  businessName: z.string({ message: "Business name is required" }).min(1, "Please enter your business name"),
  legalConstitution: legalConstitutionEnum,
  employementPotential: employementPotentialEnum,
  businessStartDate: businessStartDateEnum,
});

export const salesRevenueDetailsSchema = z.object({
  productName: z.string({ message: "Product name is required" }).min(1, "Please enter the product name"),
  salesType: salesTypeEnum,
  salesRevenue: z.union([z.number().nonnegative("Revenue cannot be negative"), z.string().min(1, "Please enter sales revenue")]).optional(),
  yearlyGrowthRate: z.union([
    z.number().min(5, "Growth rate must be at least 5%"), 
    z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 5, "Growth rate must be at least 5%")
  ]).optional(),
});

// FINAL CMA SCHEMA
export const cmaReportSchema = z.object({
  businessName: z.string({ message: "Business Entity Name is required" }).min(1, "Please enter your complete legal business name"),
  businessType: z.string({ message: "Business Type is required" }).min(1, "Please enter your business type"),
  businessSummary: z.string({ message: "Business Summary is required" }).min(20, "Please write at least 2-3 lines explaining your business plan"),
  industryType: industryTypeEnum,
  loanType: loanTypeEnum,
  businessRequirements: z.record(z.string(), z.union([z.number(), z.string()]).optional()).optional(),
  monthlyExpenses: z.record(z.string(), z.union([z.number(), z.string()]).optional()).optional(),
  revenueDetails: salesRevenueDetailsSchema,
  loanPeriod: z.number({ message: "Loan period is required" }).min(5, "Loan period must be at least 5 years").max(10, "Loan period cannot exceed 10 years"),
  personalDetails: personalDetailsSchema,
  businessDetails: businessDetailsSchema,
});

export type cmaReportType = z.infer<typeof cmaReportSchema>;
