import { Schema, model, models } from "mongoose";

const CmaReportSchema = new Schema(
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

    revenueDetails: {
      productName: String,
      salesType: String,
      salesRevenue: Number,
    },

    loanPeriod: {
      type: Number,
      required: true,
    },

    personalDetails: {
      fullName: String,
      email: String,
      mobile: String,
      businessMobile: String,
      personalAddress: String,
      businessAddress: String,
      gender: String,
      category: String,
      educationQualification: String,
      workExperience: String,
    },

    businessDetails: {
      businessName: String,
      legalConstitution: String,
      employementPotential: String,
      businessStartDate: String,
    },
  },
  { timestamps: true }
);

const CmaReport =
  models.CmaReport || model("CmaReport", CmaReportSchema);

export default CmaReport;
