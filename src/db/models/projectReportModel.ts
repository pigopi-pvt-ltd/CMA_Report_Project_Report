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

export type costStatementType = {
  year?: number;
  domesticSales?: number | string;
  exportSales?: number | string;
  subTotal?: number | string;
  gst?: number | string;
  netSales?: number | string;
  totalOtherIncome?: number | string;
  totalGrossIncome?: number | string;
  principalRepayment: number;

}
export type purchaseCostStatementType = {
  year: number;
  indigenous: number;
  freightAndOtherExpenses: number;
  totalDirectExpenses: number;
  subTotal: number;
  openingStockOfWIP: number;
  subTotalAfterOpeningStock: number;
  closingStockOfWIP: number;
  totalCostOfProduction: number;
  openingStockOfFinishedGoods: number;
  subTotalAfterOpeningStockFinishedGoods: number;
  closingStockOfFinishedGoods: number;
  totalCostOfSales: number;
  grossProfit: number;
}
export type generalExpensesStatementType = {
  year: number;
  salary: number;
  powerAndFuel: number;
  printingAndStationery: number;
  advertisement: number;
  miscellaneousExpenses: number;
  otherExpenses: number;
  postageAndCourier: number;
  transportAndConveyance: number;
  staffWelfare: number;
  repairAndMaintenance: number;
  depreciation: number;
  rent: number;
  electricityExpenses: number;
  totalGeneralExpenses: number; // Total (Expenses + Depreciation)
  operatingProfit: number       // Gross Profit - Total Expenses
}

export type DepreciationAsset = {
  assetName: string;
  openingBalance: number;
  addition: number;
  total: number;
  rate: number;
  depreciationAmount: number;
  closingBalance: number;
}

export type DepreciationYear = {
  year: number;
  assets: DepreciationAsset[];
  totalDepreciationForYear: number;
}

export type profitabilityStatementType = {
  year: number;
  totalA: number;
  totalB: number;
  netCredit: number;
  profitBeforeTax: number;
  provisionForTaxation: number;
  profitAfterTax: number;
  interestOnTermLoan: number;
  interestOnWorkingCapital: number;
  balanceCarriedOverToBalanceSheet: number;
}
export type dscrStatementType = {
  year: number;
  netProfit: number;
  depreciation: number;
  interestOnTermLoan: number;
  interestOnCC: number;
  totalCashAccrual: number; // [X]
  loanRepayment: number;
  totalDebtService: number; // [Y]
  dscrRatio: number; // X / Y
}
export type SWOTAnalysisType = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}
export type ActionPlanType = {
  leverageStrengths: string[];
  improveWeaknesses: string[];
  capitalizeOpportunities: string[];
  mitigateThreats: string[];
}

export type ebidtaAnalysisType = {
  year: number;
  netIncome: number;
  taxExpense: number;
  interestOnTermLoan: number;
  interestOnCC: number;
  depreciation: number;
  ebit: number;
  ebidta: number;
}
export type ReturnOnInvestmentType = {
  year: number;
  profitBeforeTax: number;
  depreciation: number;
  interestOnTermLoan: number;
  interestOnCC: number;
  totalInvestment: number;
  AverageReturn: number;
  CapitalEmployed: number;
  ReturnOnInvestment: number;
}
export type targetMarketType = {
  srNo: number;
  targetCustomer: string;
  expectedShare: string;
}

export type breakEvenSalesType = {
  year: number;
  sales: number;
  variableCosts: number;
  grossProfit: number;
  depreciation: number;
  interestOnTermLoan: number;
  interestOnCC: number;
  fixedCosts: number;
  breakEvenSales: number;
};

export type LoanCalculationEntry = {
  month: number;
  date: string;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  closingBalance: number;
}


export type mpbfAnalysisType = {
  year: number;
  totalCurrentAssets: number; // (a)
  totalCurrentLiabilities: number; // (b)
  bankBorrowing: number; // (c)
  otherCurrentLiabilities: number; // (b)-(c)
  mpbfMethod1: number; // Method-1
  mpbfMethod2: number; // Method-2
};


export type ratioAnalysisType = {
  year: number;
  netProfit: number;
  interestOnTermLoan: number;
  interestOnCC: number;
  provisionForTaxation: number;
  totalPbit: number;
  interestOnTermLoanY: number;
  interestOnCCY: number;
  totalInterestY: number;
  iscr: number;
  netProfitXY: number;
  revenueIncome: number;
  netProfitToSales: number;
  pbit: number;
  depreciation: number;
  pbdit: number;
  totalAssets: number;
  profitToTotalAssetsRatio: number;
  netSales: number;
  termLoanBalance: number;
  cashCredit: number;
  totalBankBorrowing: number;
  netSalesToBankBorrowing: number;
  currentAssets: number;
  currentLiabilities: number;
  currentAssetRatio: number;
  netCapitalWorth: number;
  currentRatio: number;
  tnw: number;
  tol: number;
  tolToTnw: number;
  termLiabilities: number;
  termLiabilityToTnw: number;
};

export type SensitivityScenarioEntry = {
  financialYear: number;
  totalRevenueIncome: number;
  ebitdaValue: number;
  ebitValue: number;
  profitBeforeTaxValue: number;
}

export type projectedBalanceSheetType = {
  year: string; // Sample mein "FY 2025-26" ya number dono chalenge

  // --- LIABILITIES (Senior Sample Rows) ---
  capital: number;                        // Opening Capital
  addProfitDuringYear: number;            // Net Profit after tax (PAT)
  lessDrawings: number;                   // Personal withdrawals
  termLoan: number;                       // Long Term Borrowings
  cashCredit: number;                     // Short Term Borrowings (WC)
  currentLiabilitiesAndProvision: number; // Creditors & Provisions
  provisionForTax: number;                // Tax liability
  totalLiabilities: number;               // Grand Total (Liabilities)

  // --- ASSETS (Senior Sample Rows) ---
  netFixedAssetsWDV: number;              // Fixed Assets after Depreciation
  stockOfWIP: number;                     // Stock of W.I.P. & Finished Product
  sundryDebtors: number;                  // Outstanding from customers
  depositAndAdvance: number;              // Security deposits etc.
  cashAndBankBalance: number;             // Closing Balance
  totalAssets: number;                    // Grand Total (Assets)
};

export type breakEvenAnalysisType = {
  year: string;
  // BREAK-EVEN METRICS
  revenueSales: number;
  variableCostTotal: number;
  fixedCostTotal: number;
  contribution: number;
  pvRatio: number;
  breakEvenSales: number;
  cashBreakEven: number;

  // FIXED COSTS
  rent: number;
  salaryWages: number;
  interestTermLoan: number;
  interestCCLoan: number;
  advertisement: number;
  depreciation: number;
  staffWelfare: number;
  transportConvenyance: number;
  fixedCostWithoutDepr: number;

  // VARIABLE COSTS
  purchaseEquipments: number;
  purchaseRawMaterials: number;
  freight: number;
  powerFuel: number;
  printingStationery: number;
  electricityExpenses: number;
  miscExpenses: number;
  otherExpenses: number;
  postageCourier: number;
  repairMaintenance: number;
};


export type projectedCashFlowType = {
  year: string;
  // SOURCES
  pbit: number;
  depreciation: number;
  increaseInCapital: number;
  increaseInTermLoan: number;
  increaseInCashCredit: number;
  decreaseInAdvanceDeposits: number;
  decreaseInDebtors: number;
  provisions: number;
  decreaseInStock: number;
  totalA: number;

  // USES
  increaseInFixedAssets: number;
  interestOnBankLoan: number;
  drawing: number;
  taxPayment: number;
  totalB: number;

  // POSITION
  openCashBalance: number;
  netSurplusDeficit: number;
  closingCashBalance: number;
};
export type financialPositionType = {
  year: string;
  netSales: number;
  netProfitAfterTax: number;
  cashGeneration: number;
  netWorkingCapital: number;
  currentRatio: number;
  totalNetWorth: number; // TNW
  tolToTnwRatio: number; // TOL/TNW
  termLiabilityToTnwRatio: number; // Term Liability/TNW
};

export type IndustryJustificationEntry = {
  industry: string;           // Manufacturing, Service, etc.
  receiptsIncrement: string;   // e.g., "115%"
  expenditureIncrement: string; // e.g., "120%"
  justification: string;       // Detail explanation
};


export type ParticularsAssumption = {
  projectedIncrementReceipts: string;    // "135%"
  projectedIncrementExpenditure: string; // "112%"
  interestRateTermLoan: number;          // Abhi ke liye 11.1
  interestRateCashCredit: number;        // Abhi ke liye 11.1
};

export type ProjectAssumptionsType = {
  particulars: ParticularsAssumption;
  industryJustifications: IndustryJustificationEntry[];
};

export type AFPTableType = {
  year: string;
  capitalAndReserves: number;
  longTermLiabilities: number;
  currentLiabilities: number;
  totalLiability: number;
  fixedAssets: number;
  nonCurrentAssets: number;
  currentAssets: number;
  intangibleAssets: number;
  totalAssets: number;
};


export type finalAssumptionType = {
  loanDurationYearsCount: number;
  averageDebtServiceCoverageRatio: number;

  // Tables
  revenueFromSalesSummary: {
    year: string;
    grossReceipts: number;
  }[];

  totalExpensesSummary: {
    year: string;
    totalExpenditure: number;
  }[];

  taxationProvisionSummary: {
    year: string;
    taxAmount: number;
  }[];

  // Assumptions
  financialAssumptions: {
    incrementInGrossReceipts: string;
    incrementInExpenditure: string;
  };

  // Workforce
  workforceDetails: {
    employmentPotentialCount: string;
  };
};
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
  depreciationSchedule: DepreciationYear[];
  purchaseCostStatement: purchaseCostStatementType[];
  generalExpensesStatement: generalExpensesStatementType[];
  profitabilityStatement: profitabilityStatementType[];
  dscrStatement: dscrStatementType[];
  averageDSCR: number;
  swotAnalysis: SWOTAnalysisType;
  actionPlan: ActionPlanType;
  ebidtaAnalysis: ebidtaAnalysisType[];
  returnOnInvestmentAnalysis: ReturnOnInvestmentType[];
  targetMarket: targetMarketType[];
  breakEvenSalesData: breakEvenSalesType[];
  loanCalculation: LoanCalculationEntry[];
  mpbfAnalysis: mpbfAnalysisType[];
  ratioAnalysis: ratioAnalysisType[];
  sensitivityAnalysis: {
    scenarioSalesDecrease: SensitivityScenarioEntry[];
    scenarioVariableCostIncrease: SensitivityScenarioEntry[];
    scenarioFixedCostIncrease: SensitivityScenarioEntry[];
  };
  projectedBalanceSheet: projectedBalanceSheetType[];
  breakEvenAnalysis: breakEvenAnalysisType[];
  projectedCashFlow: projectedCashFlowType[];
  financialPosition: financialPositionType[];
  AFPTable: AFPTableType[];
  loanInterestTablesDetail: any[];
  assumptions: ProjectAssumptionsType;
  finalAssumption: finalAssumptionType;


}

const SensitivityScenarioSchema = {
  financialYear: Number,
  totalRevenueIncome: Number,
  ebitdaValue: Number,
  ebitValue: Number,
  profitBeforeTaxValue: Number
};

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
      totalSalesRevenueAnually: {
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
        },
        principalRepayment: {
          type: Number,
          required: true,
          min: 0,
        }

      }
    ],
    depreciationSchedule: [
      {
        year: Number,
        totalDepreciationForYear: Number,
        assets: [
          {
            assetName: String,
            openingBalance: Number,
            addition: Number,
            total: Number,
            rate: Number,
            depreciationAmount: Number,
            closingBalance: Number,
          }
        ]
      }
    ],

    purchaseCostStatement: [
      {
        year: Number,
        particulars: String,
        imported: Number,
        indigenous: Number,
        freightAndOtherExpenses: Number,
        totalDirectExpenses: Number,
        subTotal: Number,
        openingStockOfWIP: Number,
        subTotalAfterOpeningStock: Number,
        closingStockOfWIP: Number,
        totalCostOfProduction: Number,
        openingStockOfFinishedGoods: Number,
        subTotalAfterOpeningStockFinishedGoods: Number,
        closingStockOfFinishedGoods: Number,
        totalCostOfSales: Number,
        grossProfit: Number,
      }
    ],
    // projectReportModel.ts mein add karein
    generalExpensesStatement: [
      {
        year: Number,
        salary: Number,
        powerAndFuel: Number,
        printingAndStationery: Number,
        advertisement: Number,
        miscellaneousExpenses: Number,
        otherExpenses: Number,
        postageAndCourier: Number,
        transportAndConveyance: Number,
        staffWelfare: Number,
        repairAndMaintenance: Number,
        depreciation: Number,
        rent: Number,
        electricityExpenses: Number,
        totalGeneralExpenses: Number, // Total (Expenses + Depreciation)
        operatingProfit: Number       // Gross Profit - Total Expenses
      }
    ],
    profitabilityStatement: [
      {
        year: Number,
        totalA: Number,
        totalB: Number,
        netCredit: Number,
        profitBeforeTax: Number,
        provisionForTaxation: Number,
        profitAfterTax: Number,
        balanceCarriedOverToBalanceSheet: Number,
        interestOnTermLoan: Number,
        interestOnWorkingCapital: Number,
      }
    ],
    dscrStatement: [
      {
        year: Number,
        netProfit: Number,
        depreciation: Number,
        interestOnTermLoan: Number,
        interestOnCC: Number,
        totalCashAccrual: Number, // [X]
        loanRepayment: Number,
        totalDebtService: Number, // [Y]
        dscrRatio: Number, // X / Y
      }
    ],
    averageDSCR: {
      type: Number,
      default: 0
    },
    swotAnalysis: {
      strengths: [String],
      weaknesses: [String],
      opportunities: [String],
      threats: [String]
    },
    actionPlan: {
      leverageStrengths: [String],
      improveWeaknesses: [String],
      capitalizeOpportunities: [String],
      mitigateThreats: [String]
    },
    targetMarket: [
      {
        srNo: Number,
        targetCustomer: String,
        expectedShare: String
      }
    ],
    ebidtaAnalysis: [
      {
        year: Number,
        netIncome: Number,
        taxExpense: Number,
        interestOnTermLoan: Number,
        interestOnCC: Number,
        depreciation: Number,
        ebit: Number,
        ebidta: Number
      }
    ],

    returnOnInvestmentAnalysis: [
      {
        year: Number,
        profitBeforeTax: Number,
        depreciation: Number,
        interestOnTermLoan: Number,
        interestOnCC: Number,
        totalInvestment: Number,
        AverageReturn: Number,
        CapitalEmployed: Number,
        ReturnOnInvestment: Number
      }
    ],
    breakEvenSalesData: [
      {
        year: { type: Number, required: true },
        sales: { type: Number, default: 0 },
        variableCosts: { type: Number, default: 0 },
        grossProfit: { type: Number, default: 0 },
        depreciation: { type: Number, default: 0 },
        interestOnTermLoan: { type: Number, default: 0 },
        interestOnCC: { type: Number, default: 0 },
        fixedCosts: { type: Number, default: 0 },
        breakEvenSales: { type: Number, default: 0 }
      }
    ],
    loanInterestTablesDetail: [
      {
        year: String,
        openingBalance: Number,
        emi: Number,
        principal: Number,
        interest: Number,
        closingBalance: Number,
        ccInterest: Number, // Extra fields for Table 2
        totalInterest: Number
      }
    ],
    mpbfAnalysis: [
      {
        year: Number,
        totalCurrentAssets: Number,      // (a)
        totalCurrentLiabilities: Number, // (b)
        bankBorrowing: Number,           // (c)
        otherCurrentLiabilities: Number, // (b)-(c)
        mpbfMethod1: Number,             // 75% of (a - (b-c))
        mpbfMethod2: Number              // (75% of a) - (b-c)
      }
    ],
    ratioAnalysis: [{
      year: Number,
      netProfit: Number,                // 1
      interestOnTermLoan: Number,       // 2
      interestOnCC: Number,             // 3
      provisionForTaxation: Number,      // 4
      totalPbit: Number,                // 5
      interestOnTermLoanY: Number,      // 6
      interestOnCCY: Number,            // 7
      totalInterestY: Number,           // 8
      iscr: Number,                     // 9
      netProfitXY: Number,              // 10
      revenueIncome: Number,            // 11
      netProfitToSales: Number,         // 12
      pbit: Number,                     // 13
      depreciation: Number,             // 14
      pbdit: Number,                    // 15
      totalAssets: Number,              // 16
      profitToTotalAssetsRatio: Number, // 17
      netSales: Number,                 // 18
      termLoanBalance: Number,          // 19
      cashCredit: Number,               // 20
      totalBankBorrowing: Number,       // 21
      netSalesToBankBorrowing: Number,  // 22
      currentAssets: Number,            // 23
      currentLiabilities: Number,       // 24
      currentAssetRatio: Number,        // 25
      netCapitalWorth: Number,          // 26
      currentRatio: Number,             // 27
      tnw: Number,                      // 28
      tol: Number,                      // 29
      tolToTnw: Number,                 // 30
      termLiabilities: Number,          // 31
      termLiabilityToTnw: Number        // 32
    }],

    sensitivityAnalysis: {
      scenarioSalesDecrease: [SensitivityScenarioSchema],
      scenarioVariableCostIncrease: [SensitivityScenarioSchema],
      scenarioFixedCostIncrease: [SensitivityScenarioSchema]
    },

    projectedBalanceSheet: [
      {
        year: String,
        capital: Number,
        addProfitDuringYear: Number,
        lessDrawings: Number,
        termLoan: Number,
        cashCredit: Number,
        currentLiabilitiesAndProvision: Number,
        provisionForTax: Number,
        totalLiabilities: Number,
        netFixedAssetsWDV: Number,
        stockOfWIP: Number,
        sundryDebtors: Number,
        depositAndAdvance: Number,
        cashAndBankBalance: Number,
        totalAssets: Number,
      }
    ],
    breakEvenAnalysis: [{
      year: String,
      // BREAK-EVEN METRICS
      revenueSales: { type: Number, default: 0 },
      variableCostTotal: { type: Number, default: 0 },
      fixedCostTotal: { type: Number, default: 0 },
      contribution: { type: Number, default: 0 },
      pvRatio: { type: Number, default: 0 },
      breakEvenSales: { type: Number, default: 0 },
      cashBreakEven: { type: Number, default: 0 },

      // FIXED COSTS
      rent: { type: Number, default: 0 },
      salaryWages: { type: Number, default: 0 },
      interestTermLoan: { type: Number, default: 0 },
      interestCCLoan: { type: Number, default: 0 },
      advertisement: { type: Number, default: 0 },
      depreciation: { type: Number, default: 0 },
      staffWelfare: { type: Number, default: 0 },
      transportConvenyance: { type: Number, default: 0 },
      fixedCostWithoutDepr: { type: Number, default: 0 },

      // VARIABLE COSTS
      purchaseEquipments: { type: Number, default: 0 },
      purchaseRawMaterials: { type: Number, default: 0 },
      freight: { type: Number, default: 0 },
      powerFuel: { type: Number, default: 0 },
      printingStationery: { type: Number, default: 0 },
      electricityExpenses: { type: Number, default: 0 },
      miscExpenses: { type: Number, default: 0 },
      otherExpenses: { type: Number, default: 0 },
      postageCourier: { type: Number, default: 0 },
      repairMaintenance: { type: Number, default: 0 }

    }],
    projectedCashFlow: [{
      year: String,
      pbit: { type: Number, default: 0 },
      depreciation: { type: Number, default: 0 },
      increaseInCapital: { type: Number, default: 0 },
      increaseInTermLoan: { type: Number, default: 0 },
      increaseInCashCredit: { type: Number, default: 0 },
      decreaseInAdvanceDeposits: { type: Number, default: 0 },
      decreaseInDebtors: { type: Number, default: 0 },
      provisions: { type: Number, default: 0 },
      decreaseInStock: { type: Number, default: 0 },
      totalA: { type: Number, default: 0 },
      increaseInFixedAssets: { type: Number, default: 0 },
      interestOnBankLoan: { type: Number, default: 0 },
      drawing: { type: Number, default: 0 },
      taxPayment: { type: Number, default: 0 },
      totalB: { type: Number, default: 0 },
      openCashBalance: { type: Number, default: 0 },
      netSurplusDeficit: { type: Number, default: 0 },
      closingCashBalance: { type: Number, default: 0 }
    }],
    financialPosition: [{
      year: String,
      netSales: { type: Number, default: 0 },
      netProfitAfterTax: { type: Number, default: 0 },
      cashGeneration: { type: Number, default: 0 },
      netWorkingCapital: { type: Number, default: 0 },
      currentRatio: { type: Number, default: 0 },
      totalNetWorth: { type: Number, default: 0 },
      tolToTnwRatio: { type: Number, default: 0 },
      termLiabilityToTnwRatio: { type: Number, default: 0 }
    }],
    AFPTable: [{
      year: String,
      capitalAndReserves: { type: Number, default: 0 },
      longTermLiabilities: { type: Number, default: 0 },
      currentLiabilities: { type: Number, default: 0 },
      totalLiability: { type: Number, default: 0 },
      fixedAssets: { type: Number, default: 0 },
      nonCurrentAssets: { type: Number, default: 0 },
      currentAssets: { type: Number, default: 0 },
      intangibleAssets: { type: Number, default: 0 },
      totalAssets: { type: Number, default: 0 }
    }],

    finalAssumption: [{
      loanDurationYearsCount: { type: Number },
      averageDebtServiceCoverageRatio: { type: Number },

      revenueFromSalesSummary: [{
        year: String,
        grossReceipts: Number
      }],

      totalExpensesSummary: [{
        year: String,
        totalExpenditure: Number
      }],

      taxationProvisionSummary: [{
        year: String,
        taxAmount: Number
      }],

      financialAssumptions: {
        incrementInGrossReceipts: String,
        incrementInExpenditure: String
      },

      workforceDetails: {
        employmentPotentialCount: String
      }
    }],

    // ProjectReportSchema ke andar add karein
    assumptions: {
      particulars: {
        projectedIncrementReceipts: { type: String, default: "135%" },
        projectedIncrementExpenditure: { type: String, default: "112%" },
        interestRateTermLoan: { type: Number, default: 11.1 },
        interestRateCashCredit: { type: Number, default: 11.1 }
      },
      industryJustifications: {
        type: [
          {
            industry: String,
            receiptsIncrement: String,
            expenditureIncrement: String,
            justification: String
          }
        ],
        default: [
          { industry: "Manufacturing", receiptsIncrement: "115%", expenditureIncrement: "120%", justification: "Govt. incentives like PLI, Make in India, rising raw material costs." },
          { industry: "Service", receiptsIncrement: "135%", expenditureIncrement: "112%", justification: "IT, fintech, outsourcing boom, automation reducing costs." },
          { industry: "Trading", receiptsIncrement: "128%", expenditureIncrement: "115%", justification: "E-commerce growth, supply chain efficiency, rising logistics costs." },
          { industry: "Agriculture", receiptsIncrement: "118%", expenditureIncrement: "122%", justification: "MSP hikes, agri-tech adoption, high fertilizer & labor costs." }
        ]
      }
    },
    loanCalculation: [
      {
        month: { type: Number },
        date: { type: String },
        openingBalance: { type: Number },
        emi: { type: Number },
        principal: { type: Number },
        interest: { type: Number },
        closingBalance: { type: Number },
      }
    ],




  },
  {
    timestamps: true,
  }
);

delete models.ProjectReport;
const ProjectReportModel = models.ProjectReport || model<ProjectData>("ProjectReport", ProjectReportSchema);

export default ProjectReportModel;
