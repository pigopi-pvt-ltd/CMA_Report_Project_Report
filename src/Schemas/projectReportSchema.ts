import { z } from "zod";

// Enums
export const industryTypeEnum = z.enum([
  "manufacturing",
  "service",
  "trading",
  "agriculture",
], "Industry Type must be a valid option");

export const loanTypeEnum = z.enum([
  "mudra",
  "pmegp",
  "msme",
  "others",
], "Loan Type must be a valid option");

export const salesTypeEnum = z.enum([
  "monthly",
  "unit",
]);

export const genderEnum = z.enum([
  "male",
  "female",
  "other",
]);

export const categoryEnum = z.enum([
  "general",
  "obc",
  "sc",
  "st",
]);

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

export const businessRequirementsKeyEnum = z.enum([
  "machinery",
  "land",
  "building",
  "computersAndAccessories",
  "furnituresAndFixtures",
  "vehicle",
  "softwareWebsiteAndApp",
  "liveStockFarmAnimals",
  "otherFixedExpenses",
  "consumablesStocks",
  "rawMaterials",
  "workingExpenses",
]);

export const monthlyExpensesKeyEnum = z.enum([
  "salary",
  "purchaseOfEquipments",
  "freight",
  "powerAndFuel",
  "printingAndStationery",
  "advertisement",
  "miscellaneousExpenses",
  "postageAndCourier",
  "transportAndConveyance",
  "staffWelfare",
  "repairAndMaintenance",
  "rent",
  "electricityExpenses",
  "purchaseOfRawMaterials",
  "otherExpenses",
]);

// Schemas
export const businessRequirementsSchema = z.record(
  businessRequirementsKeyEnum,
  z.union([z.number().nonnegative(), z.string()]).optional()
).optional();

export const monthlyExpensesSchema = z.record(
  monthlyExpensesKeyEnum,
  z.union([z.number().nonnegative(), z.string()]).optional()
).optional();

export const personalDetailsSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  mobile: z.string().regex(/^\+91[6-9]\d{9}$/, "Mobile number must be a valid Indian number starting with +91 followed by exactly 10 digits (starting with 6-9)"),
  businessMobile: z.string().regex(/^\+91[6-9]\d{9}$/, "Business mobile number must be a valid Indian number starting with +91 followed by exactly 10 digits (starting with 6-9)"),
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
  salesRevenue: z.union([z.number().nonnegative(), z.string()]).optional(),
  yearlyGrowthRate: z.union([z.number().min(5, "Growth rate must be at least 5%"), z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 5, "Growth rate must be at least 5%")]).optional(),
});




export const projectReportSchema = z.object({
  // step 1
  businessName: z.string().min(1, "Legal Business Name is required"),
  // step 2
  businessType: z.string().min(1, "Legal Business Type is required"),
  // step 3
  industryType: industryTypeEnum,
  // step 4
  loanType: loanTypeEnum,
  // step 5
  businessRequirements: businessRequirementsSchema.optional(),
  // step 6
  monthlyExpenses: monthlyExpensesSchema.optional(),
  // step 7
  revenueDetails: salesRevenueDetailsSchema,
  // step 8
  loanPeriod: z
    .number()
    .int()
    .min(5, "Loan period must be at least 5")
    .max(10, "Loan period must be at most 10"),
  // step 9
  personalDetails: personalDetailsSchema,
  // step 10
  businessDetails: businessDetailsSchema,
});

export type projectReportType = z.infer<typeof projectReportSchema>;
