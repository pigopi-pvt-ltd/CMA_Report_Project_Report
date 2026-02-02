import { Schema, model, models, Document, Types } from "mongoose";

export type businessRequirementsType = "machinery" | "land" | "building" | "computersAndAccessories" | "furnituresAndFixtures" | "vehicle" | "softwareWebsiteAndApp" | "liveStockFarmAnimals" | "otherFixedExpenses" | "consumablesStocks" | "rawMaterials" | "workingExpenses";
export type monthlyExpensesType = "salary" | "purchaseOfEquipments" | "freight" | "powerAndFuel" | "printingAndStationery" | "advertisement" | "miscellaneousExpenses" | "postageAndCourier" | "transportAndConveyance" | "staffWelfare" | "repairAndMaintenance" | "rent" | "electricityExpenses" | "purchaseOfRawMaterials" | "otherExpenses"

export type businessRequirementsMap = Partial<Record<businessRequirementsType, number>>;
export type monthlyExpensesMap = Partial<Record<monthlyExpensesType, number>>;

export type costStatementType = {
  year?: number;
  domesticSales?: number | string;
  exportSales?: number | string;
  subTotal?: number | string;
  gst?: number | string;
  netSales?: number | string;
  totalOtherIncome?: number | string;
  totalGrossIncome?: number | string;
}

export type personalDetailsType = {
  fullName: string,
  email: string,
  mobile: string,
  businessMobile: string,
  personalAddress: string,
  businessAddress: string,
  gender: "male" | "female" | "other",
  category: "general" | "obc" | "sc" | "st",
  educationQualification: "8fail" | "8pass" | "10pass" | "12pass" | "graduate" | "postGraduate" | "phd",
  workExperience: "0to2" | "2to3" | "3to5" | "5+"
}

export type businessDetailsType = {
  businessName: string,
  legalConstitution: "proprietorship" | "partnership" | "privateltd" | "llp" | "others",
  employementPotential: "0to2" | "2to5" | "5to10" | "10+",
  businessStartDate: "notStarted" | "6monthsAgo" | "6to12monthsAgo" | "2to3yearsAgo"
}

export type salesRevenueDetails = {
  productName: string;
  salesType: "monthly" | "unit",
  salesRevenue: number;
  totalSalesRevenueAnually: number;
}

export type LoanDetails = {
  fixedCapitalInvested: number;
  workingCapitalInvested: number;
  totalProjectCost: number;
  termLoan: number;
  workingCapitalLoan: number;
  totalLoanAmountNeeded: number;
  promotersContribution: number;
  averageDSCR: number;
}

export interface ProjectData extends Document {
  userId: Types.ObjectId;
  businessName: string;
  businessType: string;
  industryType: "manufacturing" | "service" | "trading" | "agriculture";
  loanType: "mudra" | "pmegp" | "msme" | "others";
  businessRequirements: businessRequirementsMap;
  monthlyExpenses: monthlyExpensesMap;
  revenueDetails: salesRevenueDetails;
  loanPeriod: number;
  personalDetails: personalDetailsType;
  businessDetails: businessDetailsType;
  loanDetails: LoanDetails;
  costStatement: costStatementType[];
}


const ProjectReportSchema = new Schema<ProjectData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    businessType: {
      type: String,
      required: true,
      trim: true,
    },

    industryType: {
      type: String,
      enum: ["manufacturing", "service", "trading", "agriculture"],
      required: true,
    },

    loanType: {
      type: String,
      enum: ["mudra", "pmegp", "msme", "others"],
      required: true,
    },

    businessRequirements: {
      type: Map,
      of: Number,
      default: {},
    },

    monthlyExpenses: {
      type: Map,
      of: Number,
      default: {},
    },

    // productName: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    //
    // salesType: {
    //   type: String,
    //   enum: ["monthly", "unit"],
    //   required: true,
    // },
    //
    // salesRevenue: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    // },

    revenueDetails: {
      productName: {
        type: String,
        required: true,
        trim: true,
      },

      salesType: {
        type: String,
        enum: ["monthly", "unit"],
        required: true,
      },

      salesRevenue: {
        type: Number,
        required: true,
        min: 0,
      },

    },

    loanPeriod: {
      type: Number,
      required: true,
      min: 5,
      max: 10
    },

    personalDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      businessMobile: { type: String, required: true },
      personalAddress: { type: String, required: true },
      businessAddress: { type: String, required: true },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      category: {
        type: String,
        enum: ["general", "obc", "sc", "st"],
        required: true,
      },
      educationQualification: {
        type: String,
        enum: [
          "8fail",
          "8pass",
          "10pass",
          "12pass",
          "graduate",
          "postGraduate",
          "phd",
        ],
        required: true,
      },
      workExperience: {
        type: String,
        enum: ["0to2", "2to3", "3to5", "5+"],
        required: true,
      },
    },

    businessDetails: {
      businessName: { type: String, required: true },
      legalConstitution: {
        type: String,
        enum: ["proprietorship", "partnership", "privateltd", "llp", "others"],
        required: true,
      },
      employementPotential: {
        type: String,
        enum: ["0to2", "2to5", "5to10", "10+"],
        required: true,
      },
      businessStartDate: {
        type: String,
        enum: [
          "notStarted",
          "6monthsAgo",
          "6to12monthsAgo",
          "2to3yearsAgo",
        ],
        required: true,
      },
    },
    loanDetails: {
      fixedCapitalInvested: {
        type: Number,
        required: true
      },
      workingCapitalInvested: {
        type: Number,
        required: true
      },
      totalProjectCost: {
        type: Number,
        required: true
      },
      termLoan: {
        type: Number,
        required: true
      },
      workingCapitalLoan: {
        type: Number,
        required: true
      },
      totalLoanAmountNeeded: {
        type: Number,
        required: true
      },
      averageDSCR: {
        type: Number,
        required: true
      },
      promotersContribution: {
        type: Number,
        required: true,
        min: 0,
      },

    },
    costStatement: [
      {
        year: {
          type: Number,
          required: true
        },
        domesticSales: {
          type: Number,
        },
        exportSales: {
          type: Number,
        },
        subTotal: {
          type: Number,
        },
        gst: {
          type: Number,
        },
        netSales: {
          type: Number,
        },
        totalOtherIncome: {
          type: Number,
        },
        totalGrossIncome: {
          type: Number,
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const ProjectReportModel = models.ProjectReport || model<ProjectData>("ProjectReport", ProjectReportSchema);

export default ProjectReportModel;
