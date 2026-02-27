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
  const DEFAULT_GROWTH_RATE = 0.10;

  const interestRate = (data.assumptions?.particulars?.interestRateTermLoan || DEFAULT_INTEREST_RATE) / 100;
  const yearlyGrowthRate =
    (data.revenueDetails?.yearlyGrowthRate ?? DEFAULT_GROWTH_RATE * 100) / 100;

  const businessReq = data.businessRequirements ?? {};
  const monthlyExpenses = data.monthlyExpenses ?? {};
  const revenueDetails = data.revenueDetails ?? {};
  const loanPeriod = data.loanPeriod || 5;

  // CAPITAL
  const capital = calculateCapital(businessReq);

  const termLoan =
    capital.totalProjectCost * 0.54;

  const workingCapitalLoan =
    capital.totalProjectCost * 0.36;

  // LOAN
  const loanData = calculateLoanDetails(
    termLoan,
    workingCapitalLoan,
    data.assumptions?.particulars?.interestRateTermLoan || 11.1,
    loanPeriod
  );

  // REVENUE
  const revenueData = calculateRevenue(
    revenueDetails.salesRevenue,
    revenueDetails.salesType,
    yearlyGrowthRate,
    loanPeriod
  );

  // COST (USES LOAN DATA FOR PRINCIPAL REPAYMENT)
  const costStatement =
    generateCostStatement(revenueData, loanData);

  // PRODUCTION COST
  const purchaseCostStatement = calculateProductionCost(
    costStatement,
    capital.fixedCapitalInvested,
    yearlyGrowthRate,
    loanPeriod,
    businessReq
  );

  // DEPRECIATION
  const depreciationSchedule =
    calculateDepreciation(
      businessReq,
      loanPeriod
    );

  // PROFITABILITY
  const profitabilityStatement =
    calculateProfitability(
      costStatement,
      monthlyExpenses,
      depreciationSchedule,
      loanData,
      workingCapitalLoan,
      interestRate,
      yearlyGrowthRate
    );

  // DSCR
  const { dscrStatement, averageDSCR } =
    calculateDSCR(
      profitabilityStatement,
      depreciationSchedule,
      loanData,
      costStatement,
      loanPeriod
    );

  // EBITDA
  const ebidtaAnalysis =
    calculateEBITDA(profitabilityStatement, depreciationSchedule);

  // ROI
  const returnOnInvestmentAnalysis =
    calculateROI(
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
  const projectedBalanceSheet =
    calculateBalanceSheet(
      capital.totalProjectCost * 0.10,
      profitabilityStatement,
      depreciationSchedule,
      loanData.loanCalculation,
      workingCapitalLoan,
      purchaseCostStatement
    );

  // Cash Flow
  const projectedCashFlow =
    calculateCashFlow(
      profitabilityStatement,
      depreciationSchedule,
      projectedBalanceSheet,
      capital.totalProjectCost,
      termLoan,
      workingCapitalLoan,
      capital.fixedCapitalInvested
    );

  // Ratios
  const ratioAnalysis =
    calculateRatios(
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
  const breakEvenAnalysis =
    calculateBreakEven(
      profitabilityStatement
    );

  // SENSITIVITY
  const sensitivityAnalysis =
    calculateSensitivity(
      profitabilityStatement,
      purchaseCostStatement,
      loanPeriod
    );

  // FINANCIAL POSITION
  const financialPosition =
    calculateFinancialPosition(
      profitabilityStatement,
      ratioAnalysis,
      projectedBalanceSheet,
      loanPeriod
    );

  // AFP
  const AFPTable =
    calculateAFP(
      projectedBalanceSheet
    );

  // SWOT & ACTION PLAN
  const { swotAnalysis, actionPlan } = generateSWOT();

  // PROJECT PROSPECTS
  const projectProspects =
    generateProjectProspects(
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
    const totalOpsExp = Object.values(yearExp).reduce((a, b: any) => a + (Number(b) || 0), 0);
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
      operatingProfit
    };
  });

  // BREAK EVEN SALES DATA (SIMPLE TABLE)
  const breakEvenSalesData = profitabilityStatement.map((profit, i) => {
    const purExp = purchaseCostStatement[i];
    const bep = breakEvenAnalysis[i];
    const sales = profit.totalA;
    const fixedCosts = bep.fixedCostTotal;
    const grossProfit = purExp.grossProfit;
    const breakEvenSales = grossProfit > 0 ? Math.round((sales * fixedCosts) / grossProfit) : 0;

    return {
      year: profit.year,
      sales: sales,
      variableCosts: profit.totalPurchaseEquipment +
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
      breakEvenSales: breakEvenSales
    };
  });

  return {
    loanDetails: {
      fixedCapitalInvested: capital.fixedCapitalInvested,
      workingCapitalInvested: capital.workingCapitalInvested,
      totalProjectCost: capital.totalProjectCost,
      termLoan,
      workingCapitalLoan,
      totalLoanAmountNeeded: termLoan + workingCapitalLoan,
      promotersContribution: capital.totalProjectCost * 0.10,
      averageDSCR: averageDSCR,
    },
    revenueDetails: {
      productName: revenueDetails.productName,
      salesType: revenueDetails.salesType,
      salesRevenue: revenueDetails.salesRevenue,
      totalSalesRevenueAnually: revenueDetails.salesType === "monthly" ? revenueDetails.salesRevenue * 12 : revenueDetails.salesRevenue,
      yearlyGrowthRate: yearlyGrowthRate
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
    targetMarket: [
      {
        srNo: 1,
        targetCustomer: "Our initial plan is to target the customer base in our locality. The local customer base is large, and we will also get direct feedback from our customers.",
        expectedShare: "75%"
      },
      {
        srNo: 2,
        targetCustomer: "We will expand our reach to B2B Businesses by offering bulk orders and subscription-based services to enhance brand loyalty.",
        expectedShare: "15%"
      },
      {
        srNo: 3,
        targetCustomer: "Our long-term strategy focuses on targeting online consumers through e-commerce platforms and social media marketing, ensuring accessibility beyond local boundaries.",
        expectedShare: "10%"
      }
    ],
    projectProspects,
    industryJustifications: data.assumptions?.industryJustifications || [
      { industry: "Manufacturing", receiptsIncrement: "115%", expenditureIncrement: "120%", justification: "Govt. incentives like PLI, Make in India, rising raw material costs." },
      { industry: "Service", receiptsIncrement: "135%", expenditureIncrement: "112%", justification: "IT, fintech, outsourcing boom, automation reducing costs." },
      { industry: "Trading", receiptsIncrement: "128%", expenditureIncrement: "115%", justification: "E-commerce growth, supply chain efficiency, rising logistics costs." },
      { industry: "Agriculture", receiptsIncrement: "118%", expenditureIncrement: "122%", justification: "MSP hikes, agri-tech adoption, high fertilizer & labor costs." }
    ],
    assumptions: data.assumptions || {
      particulars: {
        projectedIncrementReceipts: "135%",
        projectedIncrementExpenditure: "112%",
        interestRateTermLoan: 11.10,
        interestRateCashCredit: 11.10
      }
    }
  };
}


