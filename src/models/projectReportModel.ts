import { Schema, model, models, Document, Types } from "mongoose";

export type businessRequirementsType = "machinery" | "land" | "building" | "computersAndAccessories" | "furnituresAndFixtures" | "vehicle" | "softwareWebsiteAndApp" | "liveStockFarmAnimals" | "otherFixedExpenses" | "consumablesStocks" | "rawMaterials" | "workingExpenses";
export type monthlyExpensesType = "salary" | "purchaseOfEquipments" | "freight" | "powerAndFuel" | "printingAndStationery" | "advertisement" | "miscellaneousExpenses" | "postageAndCourier" | "transportAndConveyance" | "staffWelfare" | "repairAndMaintenance" | "rent" | "electricityExpenses" | "purchaseOfRawMaterials" | "otherExpenses"

export type businessRequirementsMap = Partial<Record<businessRequirementsType, number>>;
export type monthlyExpensesMap = Partial<Record<monthlyExpensesType, number>>;

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

export interface ProjectData extends Document {
  userId: Types.ObjectId;
  businessName: string;
  businessType: string;
  industryType: "manufacturing" | "service" | "trading" | "agriculture";
  loanType: "mudra" | "pmegp" | "msme" | "others";
  businessRequirements: businessRequirementsMap;
  monthlyExpenses: monthlyExpensesMap;
  productName: string;
  salesType: "monthly" | "unit";
  salesRevenue: number;
  loanPeriod: number;
  personalDetails: personalDetailsType;
  businessDetails: businessDetailsType;
}


const ProjectReportSchema = new Schema<ProjectData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // 👈 MUST match User model name
      required: true,
      index: true, // 👈 very important for performance
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
  },
  {
    timestamps: true,
  }
);

const ProjectReport = models.ProjectReport || model<ProjectData>("ProjectReport", ProjectReportSchema);

export default ProjectReport;
