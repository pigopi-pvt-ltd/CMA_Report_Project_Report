import { Schema, model, models, Document, Types } from "mongoose";

// Types from project model for consistency
export type businessRequirementsType = "machinery" | "land" | "building" | "computersAndAccessories" | "furnituresAndFixtures" | "vehicle" | "softwareWebsiteAndApp" | "liveStockFarmAnimals" | "otherFixedExpenses" | "consumablesStocks" | "rawMaterials" | "workingExpenses";
export type monthlyExpensesType = "salary" | "purchaseOfEquipments" | "freight" | "powerAndFuel" | "printingAndStationery" | "advertisement" | "miscellaneousExpenses" | "postageAndCourier" | "transportAndConveyance" | "staffWelfare" | "repairAndMaintenance" | "rent" | "electricityExpenses" | "purchaseOfRawMaterials" | "otherExpenses"

export interface ICmaReport extends Document {
  userId: Types.ObjectId;
  businessName: string;
  businessType: string;
  industryType: "manufacturing" | "service" | "trading" | "agriculture";
  loanType: "mudra" | "pmegp" | "msme" | "others";
  loanPeriod: number;

  personalDetails: {
    fullName: string;
    email: string;
    mobile: string;
    businessMobile: string;
    personalAddress: string;
    businessAddress: string;
    gender: "male" | "female" | "other";
    category: "general" | "obc" | "sc" | "st";
    educationQualification: string;
    workExperience: string;
  };

  businessDetails: {
    businessName: string;
    legalConstitution: string;
    employementPotential: string;
    businessStartDate: string;
  };

  revenueDetails: {
    productName: string;
    salesType: "monthly" | "unit";
    salesRevenue: number;
    totalSalesRevenueAnually: number;
    yearlyGrowthRate: number;
  };

  businessRequirements: Map<string, number>;
  monthlyExpenses: Map<string, number>;

  // --- CALCULATED FIELDS ---
  loanDetails: {
    fixedCapitalInvested: number;
    workingCapitalInvested: number;
    totalProjectCost: number;
    termLoan: number;
    workingCapitalLoan: number;
    totalLoanAmountNeeded: number;
    promotersContribution: number;
    averageDSCR: number;
  };
  costStatement: any[];
  depreciationSchedule: any[];
  purchaseCostStatement: any[];
  generalExpensesStatement: any[];
  profitabilityStatement: any[];
  dscrStatement: any[];
  averageDSCR: number;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  actionPlan: {
    leverageStrengths: string[];
    improveWeaknesses: string[];
    capitalizeOpportunities: string[];
    mitigateThreats: string[];
  };
  ebidtaAnalysis: any[];
  returnOnInvestmentAnalysis: any[];
  targetMarket: any[];
  breakEvenSalesData: any[];
  loanCalculation: any[];
  loanInterestTablesDetail: any[];
  mpbfAnalysis: any[];
  ratioAnalysis: any[];
  revenueData: any[];
  industryJustifications: any[];
  sensitivityAnalysis: {
    scenarioSalesDecrease: any[];
    scenarioVariableCostIncrease: any[];
    scenarioFixedCostIncrease: any[];
  };
  projectedBalanceSheet: any[];
  breakEvenAnalysis: any[];
  projectedCashFlow: any[];
  financialPosition: any[];
  AFPTable: any[];
  projectProspects: any;
  assumptions: any;
  emi: number;
}

const cmaReportSchema = new Schema<ICmaReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    businessName: { type: String, required: true },
    businessType: { type: String, required: true },
    industryType: { type: String, enum: ["manufacturing", "service", "trading", "agriculture"], required: true },
    loanType: { type: String, enum: ["mudra", "pmegp", "msme", "others"], required: true },
    loanPeriod: { type: Number, required: true, min: 5, max: 10 },

    personalDetails: {
      fullName: String, email: String, mobile: { type: String, match: /^\+91[6-9]\d{9}$/ }, businessMobile: { type: String, match: /^\+91[6-9]\d{9}$/ },
      personalAddress: String, businessAddress: String, gender: String, category: String,
      educationQualification: String, workExperience: String
    },
    businessDetails: {
      businessName: String, legalConstitution: String,
      employementPotential: String, businessStartDate: String
    },
    revenueDetails: {
      productName: String, salesType: String, salesRevenue: Number,
      totalSalesRevenueAnually: Number, yearlyGrowthRate: Number
    },
    businessRequirements: { type: Map, of: Number, default: {} },
    monthlyExpenses: { type: Map, of: Number, default: {} },

    // CALCULATED FIELDS
    loanDetails: {
      fixedCapitalInvested: Number, workingCapitalInvested: Number, totalProjectCost: Number,
      termLoan: Number, workingCapitalLoan: Number, totalLoanAmountNeeded: Number,
      promotersContribution: Number, averageDSCR: Number
    },
    costStatement: [Schema.Types.Mixed],
    depreciationSchedule: [Schema.Types.Mixed],
    purchaseCostStatement: [Schema.Types.Mixed],
    generalExpensesStatement: [Schema.Types.Mixed],
    profitabilityStatement: [Schema.Types.Mixed],
    dscrStatement: [Schema.Types.Mixed],
    averageDSCR: Number,
    swotAnalysis: { strengths: [String], weaknesses: [String], opportunities: [String], threats: [String] },
    actionPlan: { leverageStrengths: [String], improveWeaknesses: [String], capitalizeOpportunities: [String], mitigateThreats: [String] },
    ebidtaAnalysis: [Schema.Types.Mixed],
    returnOnInvestmentAnalysis: [Schema.Types.Mixed],
    targetMarket: [Schema.Types.Mixed],
    breakEvenSalesData: [Schema.Types.Mixed],
    loanCalculation: [Schema.Types.Mixed],
    loanInterestTablesDetail: [Schema.Types.Mixed],
    mpbfAnalysis: [Schema.Types.Mixed],
    ratioAnalysis: [Schema.Types.Mixed],
    revenueData: [Schema.Types.Mixed],
    industryJustifications: [Schema.Types.Mixed],
    sensitivityAnalysis: {
      scenarioSalesDecrease: [Schema.Types.Mixed],
      scenarioVariableCostIncrease: [Schema.Types.Mixed],
      scenarioFixedCostIncrease: [Schema.Types.Mixed]
    },
    projectedBalanceSheet: [Schema.Types.Mixed],
    breakEvenAnalysis: [Schema.Types.Mixed],
    projectedCashFlow: [Schema.Types.Mixed],
    financialPosition: [Schema.Types.Mixed],
    AFPTable: [Schema.Types.Mixed],
    projectProspects: Schema.Types.Mixed,
    assumptions: Schema.Types.Mixed,
    emi: Number
  },
  { timestamps: true }
);

export default models.CmaReport || model<ICmaReport>("CmaReport", cmaReportSchema);
