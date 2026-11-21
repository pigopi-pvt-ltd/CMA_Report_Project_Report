import { calculateCapital } from "./capital.service";
import { calculateLoanDetails } from "./loan.service";
import { calculateRevenue } from "./revenue.service";
import { generateCostStatement } from "./cost-statement.service";
import { calculateDepreciation } from "./depreciation.service";
import { calculateProfitability } from "./profitability.service";
import { calculateDSCR } from "./dscr.service";
import { calculateEBITDA } from "./ebitda.service";
import { calculateROI } from "./roi.service";
import { calculateBalanceSheet } from "./balance-sheet.service";
import { calculateCashFlow } from "./cashflow.service";
import { calculateRatios } from "./ratio.service";
import { calculateBreakEven } from "./break-even.service";
import { calculateSensitivity } from "./sensitivity.service";
import { calculateFinancialPosition } from "./financial-position.service";
import { calculateAFP } from "./afp.service";
import { generateProjectProspects } from "./project-prospect.service";
import { calculateProductionCost } from "./production-cost.service";
import { calculateMPBF } from "./mpbf.service";
import { generateSWOT } from "./swot.service";

export async function generateProjectReport(data: any) {
  const DEFAULT_INTEREST_RATE = 11.1;
  const DEFAULT_GROWTH_RATE = 0.1;
  const DEFAULT_TERM_LOAN_RATE = 54;
  const DEFAULT_WORKING_CAPITAL_RATE = 36;

  const rawTermLoanRate =
    data.termLoanPercentage !== undefined &&
    data.termLoanPercentage !== null &&
    data.termLoanPercentage !== "" &&
    !isNaN(Number(data.termLoanPercentage))
      ? Number(data.termLoanPercentage)
      : data.loanDetails?.termLoanPercentage !== undefined &&
          !isNaN(Number(data.loanDetails?.termLoanPercentage))
        ? Number(data.loanDetails.termLoanPercentage)
        : DEFAULT_TERM_LOAN_RATE;

  const rawWCRate =
    (data.workingCapitalPercentage ?? data.workingCapitalLoanPercentage) !==
      undefined &&
    (data.workingCapitalPercentage ?? data.workingCapitalLoanPercentage) !==
      null &&
    (data.workingCapitalPercentage ?? data.workingCapitalLoanPercentage) !==
      "" &&
    !isNaN(
      Number(data.workingCapitalPercentage ?? data.workingCapitalLoanPercentage)
    )
      ? Number(
          data.workingCapitalPercentage ?? data.workingCapitalLoanPercentage
        )
      : data.loanDetails?.workingCapitalPercentage !== undefined &&
          !isNaN(Number(data.loanDetails?.workingCapitalPercentage))
        ? Number(data.loanDetails.workingCapitalPercentage)
        : DEFAULT_WORKING_CAPITAL_RATE;

  // Decimal rate used for internal calculations (e.g. 0.54 for 54%)
  const termLoanRate =
    rawTermLoanRate >= 1 ? rawTermLoanRate / 100 : rawTermLoanRate;
  const workingCapitalRate = rawWCRate >= 1 ? rawWCRate / 100 : rawWCRate;

  // Stored percentage value (e.g. 54 instead of 0.54)
  const storedTermLoanRate =
    rawTermLoanRate < 1 ? Math.round(rawTermLoanRate * 100) : rawTermLoanRate;
  const storedWorkingCapitalRate =
    rawWCRate < 1 ? Math.round(rawWCRate * 100) : rawWCRate;
  const storedPromoterRate = Math.max(
    0,
    100 - storedTermLoanRate - storedWorkingCapitalRate
  );

  const rawTermLoanInterestRate =
    data.interestRateTermLoan !== undefined &&
    data.interestRateTermLoan !== null &&
    data.interestRateTermLoan !== "" &&
    !isNaN(Number(data.interestRateTermLoan))
      ? Number(data.interestRateTermLoan)
      : data.assumptions?.particulars?.interestRateTermLoan !== undefined &&
          !isNaN(Number(data.assumptions?.particulars?.interestRateTermLoan))
        ? Number(data.assumptions.particulars.interestRateTermLoan)
        : DEFAULT_INTEREST_RATE;

  const rawWCInterestRate =
    data.interestRateCashCredit !== undefined &&
    data.interestRateCashCredit !== null &&
    data.interestRateCashCredit !== "" &&
    !isNaN(Number(data.interestRateCashCredit))
      ? Number(data.interestRateCashCredit)
      : data.assumptions?.particulars?.interestRateCashCredit !== undefined &&
          !isNaN(Number(data.assumptions?.particulars?.interestRateCashCredit))
        ? Number(data.assumptions.particulars.interestRateCashCredit)
        : rawTermLoanInterestRate;

  // Stored percentage value (e.g. 11.1 instead of 0.111)
  const storedTermLoanInterestRate =
    rawTermLoanInterestRate < 1 && rawTermLoanInterestRate > 0
      ? Math.round(rawTermLoanInterestRate * 1000) / 10
      : rawTermLoanInterestRate;

  const storedWCInterestRate =
    rawWCInterestRate < 1 && rawWCInterestRate > 0
      ? Math.round(rawWCInterestRate * 1000) / 10
      : rawWCInterestRate;

  // Decimal rate used for internal calculations
  const interestRate =
    storedTermLoanInterestRate >= 1
      ? storedTermLoanInterestRate / 100
      : storedTermLoanInterestRate;

  const wcInterestRateDecimal =
    storedWCInterestRate >= 1
      ? storedWCInterestRate / 100
      : storedWCInterestRate;

  const yearlyGrowthRateValue = data.revenueDetails?.yearlyGrowthRate;
  const rawGrowth =
    yearlyGrowthRateValue !== undefined &&
    yearlyGrowthRateValue !== null &&
    yearlyGrowthRateValue !== "" &&
    !isNaN(Number(yearlyGrowthRateValue))
      ? Number(yearlyGrowthRateValue)
      : DEFAULT_GROWTH_RATE * 100;

  // Decimal rate used for internal calculations (e.g. 0.10 for 10%)
  const yearlyGrowthRate = rawGrowth >= 1 ? rawGrowth / 100 : rawGrowth;

  // Percentage value preserved for storage/display (e.g. 10 instead of 0.10)
  const storedGrowthRate =
    rawGrowth < 1 ? Math.round(rawGrowth * 100) : rawGrowth;

  const businessReq = data.businessRequirements ?? {};
  const monthlyExpenses = data.monthlyExpenses ?? {};
  const revenueDetails = data.revenueDetails ?? {};
  const loanPeriod = data.loanPeriod || 5;

  // CAPITAL
  const capital = calculateCapital(businessReq);

  const termLoan = capital.totalProjectCost * termLoanRate;

  const workingCapitalLoan = capital.totalProjectCost * workingCapitalRate;

  const promotersContribution = Math.max(
    0,
    capital.totalProjectCost - (termLoan + workingCapitalLoan)
  );

  // LOAN
  const loanData = calculateLoanDetails(
    termLoan,
    workingCapitalLoan,
    storedTermLoanInterestRate,
    loanPeriod,
    storedWCInterestRate
  );

  // REVENUE
  const revenueData = calculateRevenue(
    Number(revenueDetails.salesRevenue) || 0,
    revenueDetails.salesType,
    yearlyGrowthRate,
    loanPeriod
  );

  // COST (USES LOAN DATA FOR PRINCIPAL REPAYMENT)
  const costStatement = generateCostStatement(revenueData, loanData);

  // PRODUCTION COST
  const purchaseCostStatement = calculateProductionCost(
    costStatement,
    capital.fixedCapitalInvested,
    yearlyGrowthRate,
    loanPeriod,
    businessReq
  );

  // DEPRECIATION
  const depreciationSchedule = calculateDepreciation(businessReq, loanPeriod);

  // PROFITABILITY
  const profitabilityStatement = calculateProfitability(
    costStatement,
    monthlyExpenses,
    depreciationSchedule,
    loanData,
    workingCapitalLoan,
    wcInterestRateDecimal,
    yearlyGrowthRate
  );

  // DSCR
  const { dscrStatement, averageDSCR } = calculateDSCR(
    profitabilityStatement,
    depreciationSchedule,
    loanData,
    costStatement,
    loanPeriod
  );

  // EBITDA
  const ebidtaAnalysis = calculateEBITDA(
    profitabilityStatement,
    depreciationSchedule
  );

  // ROI
  const returnOnInvestmentAnalysis = calculateROI(
    profitabilityStatement,
    depreciationSchedule,
    capital.totalProjectCost,
    loanPeriod
  );

  // MPBF
  const mpbfAnalysis = calculateMPBF(
    profitabilityStatement,
    purchaseCostStatement,
    depreciationSchedule,
    workingCapitalLoan,
    loanPeriod
  );

  // Balance Sheet
  const projectedBalanceSheet = calculateBalanceSheet(
    capital.totalProjectCost * 0.1,
    profitabilityStatement,
    depreciationSchedule,
    loanData.loanCalculation,
    workingCapitalLoan,
    purchaseCostStatement
  );

  // Cash Flow
  const projectedCashFlow = calculateCashFlow(
    profitabilityStatement,
    depreciationSchedule,
    projectedBalanceSheet,
    capital.totalProjectCost,
    termLoan,
    workingCapitalLoan,
    capital.fixedCapitalInvested
  );

  // Ratios
  const ratioAnalysis = calculateRatios(
    profitabilityStatement,
    depreciationSchedule,
    mpbfAnalysis,
    costStatement,
    termLoan,
    capital.totalProjectCost,
    capital.fixedCapitalInvested,
    loanPeriod
  );

  // BREAK EVEN
  const breakEvenAnalysis = calculateBreakEven(profitabilityStatement);

  // SENSITIVITY
  const sensitivityAnalysis = calculateSensitivity(
    profitabilityStatement,
    purchaseCostStatement,
    loanPeriod
  );

  // FINANCIAL POSITION
  const financialPosition = calculateFinancialPosition(
    profitabilityStatement,
    ratioAnalysis,
    projectedBalanceSheet,
    loanPeriod
  );

  // AFP
  const AFPTable = calculateAFP(projectedBalanceSheet);

  // SWOT & ACTION PLAN
  const { swotAnalysis, actionPlan } = generateSWOT();

  // PROJECT PROSPECTS
  const projectProspects = generateProjectProspects(
    data.industryType,
    averageDSCR
  );

  // GENERAL EXPENSES STATEMENT
  const generalExpensesStatement = profitabilityStatement.map((p, i) => {
    const yearDepr = depreciationSchedule[i]?.totalDepreciationForYear || 0;
    const yearExp = {
      salary: p.salary,
      powerAndFuel: p.powerAndFuel,
      printingAndStationery: p.printingAndStationery,
      advertisement: p.advertisement,
      miscellaneousExpenses: p.miscellaneousExpenses,
      otherExpenses: p.otherExpenses,
      postageAndCourier: p.postageAndCourier,
      transportAndConveyance: p.transportAndConveyance,
      staffWelfare: p.staffWelfare,
      repairAndMaintenance: p.repairAndMaintenance,
      rent: p.rent,
      electricityExpenses: p.electricityExpenses,
    };
    const totalOpsExp = Object.values(yearExp).reduce(
      (a, b: any) => a + (Number(b) || 0),
      0
    );
    const totalGeneralExpenses = totalOpsExp + yearDepr;
    const currentGrossProfit = purchaseCostStatement[i].grossProfit;
    const operatingProfit = currentGrossProfit - totalGeneralExpenses;

    return {
      year: p.year,
      ...yearExp,
      interestOnTermLoan: p.interestOnTermLoan,
      interestOnCC: p.interestOnWorkingCapital,
      totalFinanceCharges: p.interestOnTermLoan + p.interestOnWorkingCapital,
      depreciation: yearDepr,
      totalGeneralExpenses,
      operatingProfit,
    };
  });

  // BREAK EVEN SALES DATA (SIMPLE TABLE)
  const breakEvenSalesData = profitabilityStatement.map((profit, i) => {
    const purExp = purchaseCostStatement[i];
    const bep = breakEvenAnalysis[i];
    const sales = profit.totalA;
    const fixedCosts = bep.fixedCostTotal;
    const grossProfit = purExp.grossProfit;
    const breakEvenSales =
      grossProfit > 0 ? Math.round((sales * fixedCosts) / grossProfit) : 0;

    return {
      year: profit.year,
      sales: sales,
      variableCosts:
        profit.totalPurchaseEquipment +
        profit.powerAndFuel +
        profit.printingAndStationery +
        profit.miscellaneousExpenses +
        profit.otherExpenses +
        profit.repairAndMaintenance,
      grossProfit: grossProfit,
      depreciation: profit.yearDepreciation,
      interestOnTermLoan: profit.interestOnTermLoan,
      interestOnCC: profit.interestOnWorkingCapital || 0,
      fixedCosts: fixedCosts,
      breakEvenSales: breakEvenSales,
    };
  });

  // Generate finalAssumption data
  const finalAssumption = {
    loanDurationYearsCount: loanPeriod,
    averageDebtServiceCoverageRatio: averageDSCR,

    // Revenue from sales summary (based on profitability data)
    revenueFromSalesSummary: profitabilityStatement.map((profit: any) => ({
      year: profit.year,
      grossReceipts: profit.totalA || 0,
    })),

    // Total expenses summary
    totalExpensesSummary: profitabilityStatement.map((profit: any) => ({
      year: profit.year,
      totalExpenditure: profit.totalB || 0,
    })),

    // Taxation provision summary
    taxationProvisionSummary: profitabilityStatement.map((profit: any) => ({
      year: profit.year,
      taxAmount: profit.provisionForTaxation || 0,
    })),

    // Financial assumptions
    financialAssumptions: {
      incrementInGrossReceipts:
        data.assumptions?.particulars?.projectedIncrementReceipts || "135%",
      incrementInExpenditure:
        data.assumptions?.particulars?.projectedIncrementExpenditure || "112%",
    },

    // Workforce details
    workforceDetails: {
      employmentPotentialCount: "10 Above", // This could be made dynamic based on business requirements
    },
  };

  return {
    termLoanPercentage: storedTermLoanRate,
    workingCapitalPercentage: storedWorkingCapitalRate,
    loanDetails: {
      fixedCapitalInvested: capital.fixedCapitalInvested,
      workingCapitalInvested: capital.workingCapitalInvested,
      totalProjectCost: capital.totalProjectCost,
      termLoan,
      workingCapitalLoan,
      totalLoanAmountNeeded: termLoan + workingCapitalLoan,
      promotersContribution,
      averageDSCR: averageDSCR,
      termLoanPercentage: storedTermLoanRate,
      workingCapitalPercentage: storedWorkingCapitalRate,
      promotersContributionPercentage: storedPromoterRate,
    },
    revenueDetails: {
      productName: revenueDetails.productName,
      salesType: revenueDetails.salesType,
      salesRevenue: Number(revenueDetails.salesRevenue) || 0,
      totalSalesRevenueAnually:
        revenueDetails.salesType === "monthly"
          ? (Number(revenueDetails.salesRevenue) || 0) * 12
          : Number(revenueDetails.salesRevenue) || 0,
      yearlyGrowthRate: storedGrowthRate,
    },

    revenueData,
    costStatement,
    purchaseCostStatement,
    generalExpensesStatement,
    depreciationSchedule,
    profitabilityStatement,
    dscrStatement,
    averageDSCR,

    loanCalculation: loanData.loanCalculation,
    loanInterestTablesDetail: loanData.loanInterestTablesDetail,
    emi: loanData.emi,
    ebidtaAnalysis,
    returnOnInvestmentAnalysis,
    projectedBalanceSheet,
    projectedCashFlow,
    ratioAnalysis,
    breakEvenAnalysis,
    breakEvenSalesData,
    sensitivityAnalysis,
    financialPosition,
    AFPTable,
    mpbfAnalysis,
    swotAnalysis,
    actionPlan,
    finalAssumption, // Add the newly generated finalAssumption
    targetMarket: [
      {
        srNo: 1,
        targetCustomer:
          "Our initial plan is to target the customer base in our locality. The local customer base is large, and we will also get direct feedback from our customers.",
        expectedShare: "75%",
      },
      {
        srNo: 2,
        targetCustomer:
          "We will expand our reach to B2B Businesses by offering bulk orders and subscription-based services to enhance brand loyalty.",
        expectedShare: "15%",
      },
      {
        srNo: 3,
        targetCustomer:
          "Our long-term strategy focuses on targeting online consumers through e-commerce platforms and social media marketing, ensuring accessibility beyond local boundaries.",
        expectedShare: "10%",
      },
    ],
    projectProspects,
    industryJustifications: data.assumptions?.industryJustifications || [
      {
        industry: "Manufacturing",
        receiptsIncrement: "115%",
        expenditureIncrement: "120%",
        justification:
          "Govt. incentives like PLI, Make in India, rising raw material costs.",
      },
      {
        industry: "Service",
        receiptsIncrement: "135%",
        expenditureIncrement: "112%",
        justification:
          "IT, fintech, outsourcing boom, automation reducing costs.",
      },
      {
        industry: "Trading",
        receiptsIncrement: "128%",
        expenditureIncrement: "115%",
        justification:
          "E-commerce growth, supply chain efficiency, rising logistics costs.",
      },
      {
        industry: "Agriculture",
        receiptsIncrement: "118%",
        expenditureIncrement: "122%",
        justification:
          "MSP hikes, agri-tech adoption, high fertilizer & labor costs.",
      },
    ],
    interestRateTermLoan: storedTermLoanInterestRate,
    interestRateCashCredit: storedWCInterestRate,
    assumptions: {
      ...(data.assumptions || {}),
      particulars: {
        projectedIncrementReceipts:
          data.assumptions?.particulars?.projectedIncrementReceipts || "135%",
        projectedIncrementExpenditure:
          data.assumptions?.particulars?.projectedIncrementExpenditure || "112%",
        interestRateTermLoan: storedTermLoanInterestRate,
        interestRateCashCredit: storedWCInterestRate,
      },
      industryJustifications:
        data.assumptions?.industryJustifications || [
          {
            industry: "Manufacturing",
            receiptsIncrement: "135%",
            expenditureIncrement: "112%",
            justification:
              "Capacity expansion, steady raw material prices, scale-driven margin gains.",
          },
          {
            industry: "Service",
            receiptsIncrement: "140%",
            expenditureIncrement: "110%",
            justification:
              "Higher digital adoption, low capex requirement, improved billable hours.",
          },
          {
            industry: "Trading",
            receiptsIncrement: "128%",
            expenditureIncrement: "115%",
            justification:
              "E-commerce growth, supply chain efficiency, rising logistics costs.",
          },
          {
            industry: "Agriculture",
            receiptsIncrement: "118%",
            expenditureIncrement: "122%",
            justification:
              "MSP hikes, agri-tech adoption, high fertilizer & labor costs.",
          },
        ],
    },
  };
}
