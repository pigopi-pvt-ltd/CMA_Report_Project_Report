import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import ProjectReportModel from "@/db/models/projectReportModel";
import { projectReportSchema } from "@/Schemas/projectReportSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { FaFirstAid } from "react-icons/fa";
import { Value } from "@radix-ui/react-select";
import { drawEBIDTAAnalysis } from "@/helpers/pdfSections";


export async function POST(request: Request) {
  try {
    const session = await requireAuth(request)
    await dbConnect();
    const body = await request.json()
    // const data = projectReportSchema.parse(body)
    const data = body; // Validation temporarily disabled for testing

    const businessReq: Record<string, number | undefined> = data.businessRequirements ?? {};
    const monthExp: Record<string, number | undefined> = data.monthlyExpenses ?? {};
    const govtMarginPercent = 0.54;
    const yearlyGrowthRate = (data.revenueDetails.yearlyGrowthRate) * .01;
    let currentGrowthFactor = 1;

    // --- 1. CALCULATE FINANCIALS ---

    const fixedCapitalInvested = Object.entries(businessReq)
      .filter((value) => {
        return value[0] !== "workingExpenses" && typeof value[1] === "number"
      })
      .reduce((sum, [first, second]) => {
        return sum + (second || 0);

      }, 0)
    const workingCapitalInvested = businessReq.workingExpenses || 0;
    const totalProjectCost = fixedCapitalInvested + workingCapitalInvested;
    const termLoan = totalProjectCost * govtMarginPercent;
    const workingCapitalLoan = totalProjectCost * 0.36;
    const totalLoanAmountNeeded = workingCapitalLoan + termLoan;

    const industryList = (data.assumptions?.industryJustifications && data.assumptions.industryJustifications.length > 0)
      ? data.assumptions.industryJustifications
      : [
        { industry: "Manufacturing", receiptsIncrement: "115%", expenditureIncrement: "120%", justification: "Govt. incentives like PLI, Make in India, rising raw material costs." },
        { industry: "Service", receiptsIncrement: "135%", expenditureIncrement: "112%", justification: "IT, fintech, outsourcing boom, automation reducing costs." },
        { industry: "Trading", receiptsIncrement: "128%", expenditureIncrement: "115%", justification: "E-commerce growth, supply chain efficiency, rising logistics costs." },
        { industry: "Agriculture", receiptsIncrement: "118%", expenditureIncrement: "122%", justification: "MSP hikes, agri-tech adoption, high fertilizer & labor costs." }
      ];


    const assumptions = data.assumptions || {
      particulars: {
        projectedIncrementReceipts: "135%",
        projectedIncrementExpenditure: "112%",
        interestRateTermLoan: 11.10,
        interestRateCashCredit: 11.10
      }
    };



    // --- LOAN & EMI CALCULATION (STEP 1) ---
    const annualRate = assumptions.particulars.interestRateTermLoan;
    const totalMonths = data.loanPeriod * 12;
    const monthlyRate = annualRate / 12 / 100;

    const emi = (termLoan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    // 1. Array for Database/PDF
    const loanCalculation = [];
    // 2. Array for Internal Calculations (Yearly Interest/Principal)
    let monthlySchedule: { interest: number; principal: number }[] = [];

    let tempBalance = termLoan;
    const reportDate = new Date();
    for (let i = 1; i <= totalMonths; i++) {
      const interestM = tempBalance * monthlyRate;
      const principalM = emi - interestM;

      // Date Logic: Next month starting
      const paymentDate = new Date(reportDate.getFullYear(), reportDate.getMonth() + i + 1, 0);

      // Push for Internal logic (getYearly functions)
      monthlySchedule.push({
        interest: interestM,
        principal: principalM
      });

      // Push for Master Table (Database/PDF)
      loanCalculation.push({
        month: i,
        date: paymentDate.toLocaleDateString('en-GB'),
        openingBalance: Math.round(tempBalance),
        emi: Math.round(emi * 100) / 100,
        principal: Math.round(principalM * 100) / 100,
        interest: Math.round(interestM * 100) / 100,
        closingBalance: Math.round((tempBalance - principalM) * 100) / 100
      });

      // Balance update for next iteration
      tempBalance -= principalM;
    }

    // Ab ye functions error nahi denge
    const getYearlyInterest = (yr: number) =>
      monthlySchedule.slice((yr - 1) * 12, yr * 12).reduce((sum, m) => sum + m.interest, 0);

    const getYearlyPrincipal = (yr: number) =>
      monthlySchedule.slice((yr - 1) * 12, yr * 12).reduce((sum, m) => sum + m.principal, 0);


    // --- 3. GENERATE COST STATEMENT ---
    const annualSales = data.revenueDetails.salesRevenue * 12
    let sales = annualSales;
    const costStatement = [];
    let currentYearLabel = new Date().getFullYear();

    for (let index = 0; index < data.loanPeriod; index++) {
      const repaymentAmount = Math.round(getYearlyPrincipal(index + 1) || 0);
      costStatement.push({
        year: currentYearLabel,
        domesticSales: sales,
        subTotal: sales,
        netSales: sales,
        totalGrossIncome: sales,
        principalRepayment: repaymentAmount > 0 ? repaymentAmount : 0
      });
      currentYearLabel++;
      if (index > 0) {
        currentGrowthFactor = currentGrowthFactor * (1 + yearlyGrowthRate);
      }
      sales = sales + (sales * currentGrowthFactor);
    }
    currentGrowthFactor = 1;

    // --- 2.5 COST OF PRODUCTION & GROSS PROFIT DETERMINATION ---
    let rawMaterialAnnual = (businessReq.rawMaterials || 0) + (monthExp.purchaseOfRawMaterials || 0) * 12;
    let purchaseYear = new Date().getFullYear();
    const purchaseCostStatement = [];




    for (let i = 0; i < data.loanPeriod; i++) {
      const currentYearSales = costStatement[i].netSales;
      if (i > 0) {
        currentGrowthFactor = currentGrowthFactor * (1 + yearlyGrowthRate);

      }
      let indigenous = fixedCapitalInvested * (currentGrowthFactor);
      // 1. Freight & Direct Expenses
      const freightAndOtherExpenses = 0;
      const totalDirectExpenses = freightAndOtherExpenses;
      const subTotal = indigenous + totalDirectExpenses;
      // 2. Work In Progress (WIP) Logic
      const openingStockOfWIP = i === 0 ? 0 : Math.round(subTotal * 0.02);
      const subTotalAfterOpeningStock = subTotal + openingStockOfWIP;
      const closingStockOfWIP = 0;
      // 3. Cost of Production
      const totalCostOfProduction = subTotalAfterOpeningStock - closingStockOfWIP;
      // 4. Finished Goods Logic
      const openingStockOfFinishedGoods = i === 0 ? 0 : Math.round(totalCostOfProduction * 0.03);
      const subTotalAfterOpeningStockFinishedGoods = totalCostOfProduction + openingStockOfFinishedGoods;
      const closingStockOfFinishedGoods = 0;
      // 5. Final Cost of Sales & Profit
      const totalCostOfSales = subTotalAfterOpeningStockFinishedGoods - closingStockOfFinishedGoods;
      const grossProfit = currentYearSales - totalCostOfSales;
      purchaseCostStatement.push({
        year: purchaseYear,
        imported: 0,
        indigenous: indigenous, // Updated value yahan push hogi
        freightAndOtherExpenses,
        totalDirectExpenses,
        subTotal,
        openingStockOfWIP,
        subTotalAfterOpeningStock,
        closingStockOfWIP,
        totalCostOfProduction,
        openingStockOfFinishedGoods,
        subTotalAfterOpeningStockFinishedGoods,
        closingStockOfFinishedGoods,
        totalCostOfSales,
        grossProfit: Math.round(grossProfit)
      });

      purchaseYear++;
      // Raw Material growth calculation
      rawMaterialAnnual = Math.round(rawMaterialAnnual * currentGrowthFactor);
    }
    currentGrowthFactor = 1;




    // --- 3. GENERATE DEPRECIATION SCHEDULE ---
    const depreciationSchedule = [];
    // Define initial assets with their specific rates
    const currentAssets = [
      { name: "Plant & Machinery", value: businessReq.machinery || 0, rate: 0.15 },
      { name: "Building", value: businessReq.building || 0, rate: 0.10 },
      { name: "Computer, Mobile & Accessories", value: businessReq.computersAndAccessories || 0, rate: 0.40 },
      { name: "Furniture & Fixtures", value: businessReq.furnituresAndFixtures || 0, rate: 0.10 },
      { name: "Vehicle", value: businessReq.vehicle || 0, rate: 0.15 },
    ]

    let deprYearLabel = new Date().getFullYear();

    for (let i = 0; i < data.loanPeriod; i++) {
      let yearlyTotalDepr = 0;

      const yearAssets = currentAssets.map(asset => {
        const opening = asset.value;
        const deprAmount = opening * asset.rate;
        const closing = opening - deprAmount;

        yearlyTotalDepr += deprAmount;

        // Update the asset value for the next year in the loop
        asset.value = closing;

        return {
          assetName: asset.name,
          openingBalance: Math.round(opening),
          addition: 0,
          total: Math.round(opening),
          rate: asset.rate,
          depreciationAmount: Math.round(deprAmount),
          closingBalance: Math.round(closing)
        };
      });

      depreciationSchedule.push({
        year: deprYearLabel,
        assets: yearAssets,
        totalDepreciationForYear: Math.round(yearlyTotalDepr)
      });
      deprYearLabel++;
    }


    // ---- GENERATE GENERAL EXPENSES STATEMENT ---

    const generalExpensesStatement = [];
    const interestRate = 0.11;
    const interestOnCC = Math.round(workingCapitalLoan * interestRate);

    for (let i = 0; i < data.loanPeriod; i++) {
      if (i > 0) {
        currentGrowthFactor = currentGrowthFactor * (1 + yearlyGrowthRate);
      }

      const calcAnn = (val: number | undefined) => Math.round((val || 0) * 12 * currentGrowthFactor);
      const interestOnTermLoan = Math.round(getYearlyInterest(i + 1));

      const yearExp = {
        salary: calcAnn(monthExp.salary),
        powerAndFuel: calcAnn(monthExp.powerAndFuel),
        printingAndStationery: calcAnn(monthExp.printingAndStationery),
        advertisement: calcAnn(monthExp.advertisement),
        miscellaneousExpenses: calcAnn(monthExp.miscellaneousExpenses),
        otherExpenses: calcAnn(monthExp.otherExpenses),
        postageAndCourier: calcAnn(monthExp.postageAndCourier),
        transportAndConveyance: calcAnn(monthExp.transportAndConveyance),
        staffWelfare: calcAnn(monthExp.staffWelfare),
        repairAndMaintenance: calcAnn(monthExp.repairAndMaintenance),
        rent: calcAnn(monthExp.rent),
        electricityExpenses: calcAnn(monthExp.electricityExpenses),
      };

      const yearDepr = depreciationSchedule[i]?.totalDepreciationForYear || 0;
      const totalOpsExp = Object.values(yearExp).reduce((a, b) => a + b, 0);
      const totalGeneralExpenses = totalOpsExp + yearDepr;

      // Gross Profit pichle loop se uthayenge
      const currentGrossProfit = purchaseCostStatement[i].grossProfit;
      const operatingProfit = currentGrossProfit - totalGeneralExpenses;

      generalExpensesStatement.push({
        year: costStatement[i].year,
        ...yearExp,
        interestOnTermLoan,
        interestOnCC,
        totalFinanceCharges: interestOnTermLoan + interestOnCC,
        depreciation: yearDepr,
        totalGeneralExpenses,
        operatingProfit
      });
    }
    currentGrowthFactor = 1;
    // --- 2.8 PROFITABILITY STATEMENT CALCULATION LOGIC (FINAL FIX) ---


    const profitabilityStatement: any[] = [];

    for (let i = 0; i < data.loanPeriod; i++) {
      if (i > 0) {
        currentGrowthFactor = currentGrowthFactor * (1 + yearlyGrowthRate);
      }
      const calcAnn = (val: number | undefined) => Math.round((val || 0) * 12 * currentGrowthFactor);
      const totalGrossIncome = costStatement[i].totalGrossIncome || 0;
      const totalA = costStatement[i].totalGrossIncome || 0;


      const yearExp = {
        salary: calcAnn(monthExp.salary),
        totalPurchaseEquipment: calcAnn(monthExp.purchaseOfEquipments),
        powerAndFuel: calcAnn(monthExp.powerAndFuel),
        printingAndStationery: calcAnn(monthExp.printingAndStationery),
        advertisement: calcAnn(monthExp.advertisement),
        miscellaneousExpenses: calcAnn(monthExp.miscellaneousExpenses),
        otherExpenses: calcAnn(monthExp.otherExpenses),
        postageAndCourier: calcAnn(monthExp.postageAndCourier),
        transportAndConveyance: calcAnn(monthExp.transportAndConveyance),
        staffWelfare: calcAnn(monthExp.staffWelfare),
        repairAndMaintenance: calcAnn(monthExp.repairAndMaintenance),
        rent: calcAnn(monthExp.rent),
        electricityExpenses: calcAnn(monthExp.electricityExpenses),
      };

      const interestOnTermLoan = Math.round(getYearlyInterest(i + 1));
      const interestOnWorkingCapital = Math.round(workingCapitalLoan * interestRate);
      const yearDepreciation = depreciationSchedule[i]?.totalDepreciationForYear || 0;


      const totalB = Object.values(yearExp).reduce((a, b) => a + b, 0) + interestOnCC + interestOnTermLoan + yearDepreciation; // +
      const netCredit = totalA - totalB;


      const profitBeforeTax = netCredit
      const provisionForTaxation = Math.round(profitBeforeTax * 0.30);
      const profitAfterTax = profitBeforeTax - provisionForTaxation;

      profitabilityStatement.push({
        year: costStatement[i].year,
        totalGrossIncome,
        totalA,
        ...yearExp,
        totalB,
        netCredit,
        interestOnTermLoan,
        interestOnWorkingCapital,
        yearDepreciation,
        profitBeforeTax,
        provisionForTaxation,
        profitAfterTax,
        balanceCarriedOverToBalanceSheet: profitAfterTax
      });
    }
    currentGrowthFactor = 1;
    // --- 2.9 GENERATE DSCR STATEMENT ---
    const dscrStatement: any[] = [];
    let totalDSCRSum = 0;

    for (let i = 0; i < data.loanPeriod; i++) {
      const profit = profitabilityStatement[i];
      const depr = depreciationSchedule[i].totalDepreciationForYear;
      const repayment = (costStatement[i] as any).principalRepayment || 0;


      // X = Profit + Depr + Interest
      const totalCashAccrual =
        profit.profitAfterTax +
        depr +
        profit.interestOnTermLoan +
        profit.interestOnWorkingCapital;

      // Y = Repayment + Interest
      const installmentOfTermLoan = repayment + profit.interestOnTermLoan;
      const totalDebtService = installmentOfTermLoan + profit.interestOnTermLoan + profit.interestOnWorkingCapital;

      const dscrRatio = installmentOfTermLoan === 0 ? 0 : Number((totalCashAccrual / totalDebtService).toFixed(2));

      totalDSCRSum += dscrRatio;

      dscrStatement.push({
        year: costStatement[i].year,
        netProfit: profit.profitAfterTax,
        depreciation: depr,
        interestOnTermLoan: profit.interestOnTermLoan,
        interestOnCC: profit.interestOnWorkingCapital,
        totalCashAccrual,
        loanRepayment: repayment,
        installmentOfTermLoan,
        totalDebtService,
        dscrRatio
      });
    }

    const averageDSCR = Number((totalDSCRSum / data.loanPeriod).toFixed(2));

    // --- 2.10 SWOT ANALYSIS (BASIC LOGIC) ---
    const swotAnalysis = {
      strengths: [
        "Unique selling proposition (USP)", "Strong brand reputation",
        "High-quality products/services", "Skilled and experienced workforce",
        "Strong customer loyalty", "Efficient supply chain and operations", "Financial stability"
      ],
      weaknesses: [
        "Limited market reach", "High operational costs",
        "Dependence on a single revenue stream", "Outdated technology or processes",
        "Weak online presence", "Lack of skilled employees in key areas"
      ],
      opportunities: [
        "Growing market demand", "Emerging technology improvements",
        "Expansion into new markets", "Strategic partnerships and collaborations",
        "Changing customer preferences", "Government incentives and grants"
      ],
      threats: [
        "Increased competition", "Economic downturns",
        "Changing regulations and compliance issues", "Rising costs of raw materials",
        "Technological disruptions", "Negative public perception or PR crises"
      ]
    };



    // route.ts mein finalData banane se pehle
    const actionPlan = {
      leverageStrengths: [
        "Boost brand awareness via marketing campaigns (3-6 months).",
        "Enhance workforce skills with training programs (Ongoing).",
        "Strengthen customer loyalty with rewards programs (2-4 months)."
      ],
      improveWeaknesses: [
        "Expand market reach through digital marketing (6-12 months).",
        "Reduce operational costs by optimizing expenses (3-6 months).",
        "Strengthen online presence with SEO and e-commerce (6 months)."
      ],
      capitalizeOpportunities: [
        "Invest in automation and AI for efficiency (12 months).",
        "Research and enter new markets (6-12 months).",
        "Build strategic partnerships (Ongoing)."
      ],
      mitigateThreats: [
        "Differentiate with innovation and customer service (Ongoing).",
        "Develop a financial contingency plan (6 months).",
        "Ensure regulatory compliance (Ongoing)."
      ]
    };
    // --- 2.11 TARGET MARKET ANALYSIS ---

    const targetMarket = [
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
    ];



    // --- 2.11 EBIDTA ANALYSIS ---
    const ebidtaAnalysis = [];

    for (let i = 0; i < data.loanPeriod; i++) {
      const profit = profitabilityStatement[i];
      const depr = depreciationSchedule[i].totalDepreciationForYear;

      const ebidta = profit.netCredit + profit.provisionForTaxation + profit.interestOnTermLoan + profit.interestOnWorkingCapital + depr;
      const ebit = ebidta - depr;

      ebidtaAnalysis.push({
        year: profit.year,
        netIncome: profit.netCredit,
        taxExpense: profit.provisionForTaxation,
        interestOnTermLoan: profit.interestOnTermLoan,
        interestOnCC: profit.interestOnWorkingCapital,
        depreciation: depr,
        ebit: ebit,
        ebidta: ebidta
      });
    }

    //Return On Investment (ROI) Calculation
    const capitalEmployed = totalProjectCost;
    let totalReturnSum = 0;
    const returnOnInvestmentAnalysis = [];

    for (let i = 0; i < data.loanPeriod; i++) {
      const profit = profitabilityStatement[i];
      const depr = depreciationSchedule[i].totalDepreciationForYear;

      const yearlyReturn =
        profit.profitBeforeTax +
        depr +
        profit.interestOnTermLoan +
        profit.interestOnWorkingCapital;

      totalReturnSum += yearlyReturn;

      returnOnInvestmentAnalysis.push({
        year: profit.year,
        profitBeforeTax: profit.profitBeforeTax,
        depreciation: depr,
        interestOnTermLoan: profit.interestOnTermLoan,
        interestOnCC: profit.interestOnWorkingCapital,
        totalInvestment: yearlyReturn,
        AverageReturn: 0,
        CapitalEmployed: 0,
        ReturnOnInvestment: 0
      });
    }

    const averageReturn = totalReturnSum / data.loanPeriod;
    const finalROI = (averageReturn / capitalEmployed) * 100;

    if (returnOnInvestmentAnalysis.length > 0) {
      returnOnInvestmentAnalysis[0].AverageReturn = averageReturn;
      returnOnInvestmentAnalysis[0].CapitalEmployed = capitalEmployed;
      returnOnInvestmentAnalysis[0].ReturnOnInvestment = finalROI;
    }


    const loanInterestTablesDetail = [];

    for (let i = 0; i < loanCalculation.length; i += 12) {
      const yearChunk = loanCalculation.slice(i, i + 12);

      // 12 mahino ka total nikalna
      const yearPrincipal = yearChunk.reduce((sum, m) => sum + m.principal, 0);
      const yearInterest = yearChunk.reduce((sum, m) => sum + m.interest, 0);
      const totalEMI = yearChunk.reduce((sum, m) => sum + m.emi, 0);

      // Cash Credit Interest (Fixed calculation)
      const ccInterest = Math.round(workingCapitalLoan * (assumptions.particulars.interestRateCashCredit / 100));

      loanInterestTablesDetail.push({
        year: yearChunk[0].date.split('/')[2], // Year extract karna
        openingBalance: Math.round(yearChunk[0].openingBalance),
        emi: Math.round(totalEMI),
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        closingBalance: Math.round(yearChunk[yearChunk.length - 1].closingBalance),
        ccInterest: ccInterest,
        totalInterest: Math.round(yearInterest + ccInterest)
      });
    }

    // --- 2.12 MPBF CALCULATION ---
    const mpbfAnalysis = [];
    for (let i = 0; i < data.loanPeriod; i++) {
      const profit = profitabilityStatement[i] || {};
      const purExp = purchaseCostStatement[i] || {};
      const genExp = generalExpensesStatement[i] || {};

      const inventory = Math.round((purExp.indigenous || 0) / 12);
      const receivables = Math.round((profit.totalA || 0) / 12);
      const cashInHand = Math.round((genExp.totalGeneralExpenses || 0) / 24);
      const totalCurrentAssets = inventory + receivables + cashInHand;

      const creditors = Math.round((purExp.indigenous || 0) / 24);
      const outstandingExp = Math.round(((genExp.salary || 0) + (genExp.rent || 0)) / 12);
      const bankBorrowing = Math.round(workingCapitalLoan);
      const otherCurrentLiabilities = creditors + outstandingExp;
      const totalCurrentLiabilities = otherCurrentLiabilities + bankBorrowing;

      const gap = totalCurrentAssets - otherCurrentLiabilities;
      mpbfAnalysis.push({
        year: profit.year,
        totalCurrentAssets,
        totalCurrentLiabilities,
        bankBorrowing,
        otherCurrentLiabilities,
        mpbfMethod1: gap > 0 ? Math.round(gap * 0.75) : 0,
        mpbfMethod2: Math.round((totalCurrentAssets * 0.75) - otherCurrentLiabilities) > 0 ? Math.round((totalCurrentAssets * 0.75) - otherCurrentLiabilities) : 0
      });
    }

    // --- RATIO ANALYSIS COMPLETE CALCULATION (32 ROWS UPDATED) ---
    const ratioAnalysis = [];
    let cumulativeRepayment = 0;


    for (let i = 0; i < data.loanPeriod; i++) {
      const profit = profitabilityStatement[i];
      const depr = depreciationSchedule[i]?.totalDepreciationForYear || 0;
      const mpbf = mpbfAnalysis[i];
      const currentSales = profit.totalA || 0;
      const currentNetProfit = profit.profitAfterTax || 0;


      // PBIT & Interest
      const pbit = profit.profitBeforeTax + profit.interestOnTermLoan + (profit.interestOnWorkingCapital || 0);
      const intTL_Y = profit.interestOnTermLoan || 0;
      const intCC_Y = profit.interestOnWorkingCapital || 0;
      const totalY = intTL_Y + intCC_Y;

      // Ratios
      const iscr = totalY === 0 ? 0 : pbit / totalY;
      const netProfitToSales = currentSales === 0 ? 0 : (currentNetProfit / currentSales) * 100;

      // Term Loan Balance Logic
      cumulativeRepayment += (costStatement[i] as any).principalRepayment || 0;
      const currentTermLoanBalance = Math.max(0, termLoan - cumulativeRepayment);

      // Assets & Liabilities
      const currentAssets = mpbf.totalCurrentAssets || 0;
      const currentLiabs = mpbf.totalCurrentLiabilities || 0;
      const totalAssets = currentAssets + fixedCapitalInvested;

      const currentRatio = currentLiabs === 0 ? 0 : currentAssets / currentLiabs;

      // Net Worth Calculation
      const totalAccumulatedProfit = profitabilityStatement
        .slice(0, i + 1)
        .reduce((sum, p) => sum + p.profitAfterTax, 0);

      const tnw = (totalProjectCost * 0.10) + totalAccumulatedProfit; // 10% promoter contribution
      const tol = currentTermLoanBalance + currentLiabs;

      ratioAnalysis.push({
        year: profit.year,
        netProfit: currentNetProfit,                      // 1
        interestOnTermLoan: intTL_Y,                      // 2
        interestOnCC: intCC_Y,                            // 3
        provisionForTaxation: profit.provisionForTaxation, // 4
        totalPbit: pbit,                                  // 5
        interestOnTermLoanY: intTL_Y,                     // 6
        interestOnCCY: intCC_Y,                           // 7
        totalInterestY: totalY,                           // 8
        iscr: iscr,                                       // 9
        netProfitXY: currentNetProfit, // 10
        revenueIncome: currentSales,                      // 11
        netProfitToSales: netProfitToSales,               // 12
        pbit: pbit,                                       // 13
        depreciation: depr,                               // 14
        pbdit: pbit + depr,                               // 15
        totalAssets: totalAssets,                         // 16
        profitToTotalAssetsRatio: totalAssets === 0 ? 0 : pbit / totalAssets, // 17
        netSales: currentSales,                           // 18
        termLoanBalance: currentTermLoanBalance,          // 19
        cashCredit: mpbf.bankBorrowing || 0,              // 20
        totalBankBorrowing: currentTermLoanBalance + (mpbf.bankBorrowing || 0), // 21
        netSalesToBankBorrowing: (mpbf.bankBorrowing || 0) === 0 ? 0 : currentSales / mpbf.bankBorrowing, // 22
        currentAssets: currentAssets,                     // 23
        currentLiabilities: currentLiabs,                 // 24
        currentAssetRatio: currentRatio,                  // 25
        netCapitalWorth: currentAssets - currentLiabs,    // 26
        currentRatio: currentRatio,                       // 27
        tnw: tnw,                                         // 28
        tol: tol,                                         // 29
        tolToTnw: tnw === 0 ? 0 : tol / tnw,              // 30
        termLiabilities: currentTermLoanBalance,          // 31
        termLiabilityToTnw: tnw === 0 ? 0 : currentTermLoanBalance / tnw // 32
      });
    }


    // --- SENSITIVITY ANALYSIS CALCULATION ---
    const scenarioSalesDecrease = [];
    const scenarioVariableCostIncrease = [];
    const scenarioFixedCostIncrease = [];

    for (let i = 0; i < data.loanPeriod; i++) {
      const profit = profitabilityStatement[i];
      const purExp = purchaseCostStatement[i] || {};
      const genExp = generalExpensesStatement[i] || {};

      // Common values for calculation
      const sales = profit.totalA || 0;
      const varCostsBase = (purExp.indigenous || 0) + (purExp.freightAndOtherExpenses || 0);
      const fixedCostsBase = genExp.totalGeneralExpenses || 0;
      const depr = genExp.depreciation || 0;
      const interest = profit.interestOnTermLoan + (profit.interestOnWorkingCapital || 0);

      // 1. Scenario: Sales Decrease by 5%
      const s1_sales = Math.round(sales * 0.95);
      const s1_ebitda = s1_sales - (varCostsBase + fixedCostsBase);
      scenarioSalesDecrease.push({
        financialYear: profit.year,
        totalRevenueIncome: s1_sales,
        ebitdaValue: s1_ebitda,
        ebitValue: s1_ebitda - depr,
        profitBeforeTaxValue: (s1_ebitda - depr) - interest
      });
      if (i > 0) {
        currentGrowthFactor = currentGrowthFactor * (1 + currentGrowthFactor)
      }

      // 2. Scenario: Variable Cost Increase by 5%
      const s2_varCosts = Math.round(varCostsBase + varCostsBase * currentGrowthFactor);
      const s2_ebitda = sales - (s2_varCosts + fixedCostsBase);
      scenarioVariableCostIncrease.push({
        financialYear: profit.year,
        totalRevenueIncome: sales,
        ebitdaValue: s2_ebitda,
        ebitValue: s2_ebitda - depr,
        profitBeforeTaxValue: (s2_ebitda - depr) - interest
      });

      // 3. Scenario: Fixed Cost Increase by 5%
      const s3_fixedCosts = Math.round(fixedCostsBase + fixedCostsBase * currentGrowthFactor);
      const s3_ebitda = sales - (varCostsBase + s3_fixedCosts);
      scenarioFixedCostIncrease.push({
        financialYear: profit.year,
        totalRevenueIncome: sales,
        ebitdaValue: s3_ebitda,
        ebitValue: s3_ebitda - depr,
        profitBeforeTaxValue: (s3_ebitda - depr) - interest
      });
    }

    const sensitivityAnalysis = {
      scenarioSalesDecrease,
      scenarioVariableCostIncrease,
      scenarioFixedCostIncrease
    };


    //-------------- Senior Style Balance Sheet Calculation (Exact Rows) -------------
    const projectedBalanceSheet = [];

    // Initial Capital (Promoter's Contribution)
    let currentCapitalBalance = totalProjectCost - totalLoanAmountNeeded;

    for (let i = 0; i < data.loanPeriod; i++) {
      const profit = profitabilityStatement[i];
      const deprYear = depreciationSchedule[i];
      const yearlyLoanData = loanInterestTablesDetail[i] || {};

      // --- LIABILITIES SIDE CALCULATIONS ---
      const profitDuringYear = profit.profitAfterTax || 0;
      const drawings = i === 0 ? 0 : Math.round(profitDuringYear * 0.20);
      const termLoan = yearlyLoanData.closingBalance || 0;
      const cashCredit = workingCapitalLoan || 0;
      const provisionForTax = profit.provisionForTaxation || 0;

      // Current Liabilities (Ex: 5% of Expenses)
      const currentLiabilitiesAndProv = 0;
      const totalLiabilities =
        currentCapitalBalance +
        profitDuringYear -
        drawings +
        termLoan +
        cashCredit +
        currentLiabilitiesAndProv +
        provisionForTax;

      // --- ASSETS SIDE CALCULATIONS ---
      const netFixedAssetsWDV = deprYear ? deprYear.assets.reduce((sum: number, asset: any) => sum + asset.closingBalance, 0) : 0;
      const stockOfWIP = Math.round((purchaseCostStatement[i]?.closingStockOfWIP || 0) + (purchaseCostStatement[i]?.closingStockOfFinishedGoods || 0));
      const sundryDebtors = 0;
      const depositAndAdvance = 0;
      let cashAndBankBalance = totalLiabilities - (netFixedAssetsWDV + stockOfWIP + sundryDebtors + depositAndAdvance);

      if (cashAndBankBalance < 0) cashAndBankBalance = 10000;

      const totalAssets = netFixedAssetsWDV + stockOfWIP + sundryDebtors + depositAndAdvance + cashAndBankBalance;

      projectedBalanceSheet.push({
        year: profit.year,
        // Liabilities Side
        capital: Math.round(currentCapitalBalance),
        addProfitDuringYear: Math.round(profitDuringYear),
        lessDrawings: Math.round(drawings),
        termLoan: Math.round(termLoan),
        cashCredit: Math.round(cashCredit),
        currentLiabilitiesAndProvision: Math.round(currentLiabilitiesAndProv),
        provisionForTax: Math.round(provisionForTax),
        totalLiabilities: Math.round(totalLiabilities),

        // Assets Side
        netFixedAssetsWDV: Math.round(netFixedAssetsWDV),
        stockOfWIP: Math.round(stockOfWIP),
        sundryDebtors: Math.round(sundryDebtors),
        depositAndAdvance: depositAndAdvance,
        cashAndBankBalance: Math.round(cashAndBankBalance),
        totalAssets: Math.round(totalAssets)
      });

      currentCapitalBalance = (currentCapitalBalance + profitDuringYear) - drawings;
    }

    //--------------Break Even Analysis---------------
    const breakEvenAnalysis = [];

    // Profitability Statement se data fetch karke BEA calculate karein
    for (let i = 0; i < profitabilityStatement.length; i++) {
      const p = profitabilityStatement[i];

      // 1. VARIABLE COSTS MAPPING
      const varCosts = {
        purchaseEquipments: p.totalPurchaseEquipment || 0,
        purchaseRawMaterials: p.rawMaterialConsumed || 0,
        freight: p.freight || 0,
        powerFuel: p.powerAndFuel || 0,
        printingStationery: p.printingAndStationery || 0,
        electricityExpenses: p.electricityExpenses || 0,
        miscExpenses: p.miscellaneousExpenses || 0,
        otherExpenses: p.otherExpenses || 0,
        postageCourier: p.postageCourier || 0,
        repairMaintenance: p.repairAndMaintenance || 0,
      };

      // Total Variable Cost Calculation
      const vTotal = Object.values(varCosts).reduce((a, b) => a + b, 0);

      // 2. FIXED COSTS MAPPING
      const fixedCostsData = {
        rent: p.rent || 0,
        salaryWages: p.salary || 0,
        interestTermLoan: p.interestOnTermLoan || 0,
        interestCCLoan: p.interestOnWorkingCapital || 0,
        advertisement: p.advertisement || 0,
        depreciation: p.yearDepreciation || 0,
        staffWelfare: p.staffWelfare || 0,
        transportConvenyance: p.transportAndConveyance || 0,
      };

      // Total Fixed Cost Calculation
      const fTotal = Object.values(fixedCostsData).reduce((a, b) => a + b, 0);

      // 3. BREAK-EVEN METRICS CALCULATION
      const sales = p.totalA || 0; // Revenue from Sales
      const contribution = sales - vTotal; // D = A - B

      // E. P.V Ratio (D/A * 100)
      const pvRatio = sales > 0 ? (contribution / sales) * 100 : 0;

      // F. Break-Even Sales (Fixed Cost / PV Ratio)
      const bepSales = pvRatio > 0 ? (fTotal / (pvRatio / 100)) : 0;

      // G. CASH BREAK-EVEN (Fixed Cost without Depr / PV Ratio)
      const fixedCostWithoutDepr = fTotal - (p.yearDepreciation || 0);
      const cashBep = pvRatio > 0 ? (fixedCostWithoutDepr / (pvRatio / 100)) : 0;

      // Final Object for Database & PDF
      breakEvenAnalysis.push({
        year: p.year,
        // Metrics
        revenueSales: sales,
        variableCostTotal: vTotal,
        fixedCostTotal: fTotal,
        contribution: contribution,
        pvRatio: parseFloat(pvRatio.toFixed(2)),
        breakEvenSales: Math.round(bepSales),
        cashBreakEven: Math.round(cashBep),
        // Fixed Cost Breakup
        ...fixedCostsData,
        fixedCostWithoutDepr: fixedCostWithoutDepr,
        // Variable Cost Breakup
        ...varCosts
      });
    }


    const breakEvenSalesData = [];

    for (let i = 0; i < data.loanPeriod; i++) {
      const profit = profitabilityStatement[i];
      const genExp = generalExpensesStatement[i];
      const purExp = purchaseCostStatement[i];
      const breakEvenAnalysisData = breakEvenAnalysis[i];


      const sales = profit.totalA;
      const variableCosts = profit.totalPurchaseEquipment +
        profit.powerAndFuel +
        profit.printingAndStationery +
        profit.miscellaneousExpenses +
        profit.otherExpenses +
        profit.repairAndMaintenance;

      // 3. Gross Profit (B) = Sales - Variable Costs
      const grossProfit = purExp.grossProfit;
      const fixedCosts = breakEvenAnalysisData.fixedCostTotal;
      const breakEvenSales = grossProfit > 0
        ? Math.round((sales * fixedCosts) / grossProfit)
        : 0;

      breakEvenSalesData.push({
        year: profit.year,
        sales: sales,
        variableCosts: variableCosts,
        grossProfit: grossProfit,
        depreciation: genExp.depreciation,
        interestOnTermLoan: profit.interestOnTermLoan,
        interestOnCC: profit.interestOnWorkingCapital || 0,
        fixedCosts: breakEvenAnalysisData.fixedCostTotal,
        breakEvenSales: breakEvenSales
      });
    }


    //--------------------projectedCashFlowType------------------

    const projectedCashFlow = [];
    let runningCashBalance = 0;

    for (let i = 0; i < profitabilityStatement.length; i++) {
      const profit = profitabilityStatement[i];
      const balanceSheet = projectedBalanceSheet[i];
      const previousBalanceSheet = i > 0 ? projectedBalanceSheet[i - 1] : null;

      // SOURCES [A]
      const pbit = profit.profitBeforeTax + profit.interestOnTermLoan + (profit.interestOnWorkingCapital || 0);
      const depreciation = profit.yearDepreciation;
      const increaseInCapital = i === 0 ? (totalProjectCost * 0.10) : 0;
      const increaseInTermLoan = i === 0 ? termLoan : 0;
      const increaseInCashCredit = i === 0 ? workingCapitalLoan : 0;

      const decreaseInDebtors = i > 0 ? Math.max(0, (previousBalanceSheet?.sundryDebtors || 0) - (balanceSheet?.sundryDebtors || 0)) : 0;
      const decreaseInStock = i > 0 ? Math.max(0, (previousBalanceSheet?.stockOfWIP || 0) - (balanceSheet?.stockOfWIP || 0)) : 0;
      const provisions = 0;
      const decreaseInAdvanceDeposits = 0; // As per your requirement

      const totalA = pbit + depreciation + increaseInCapital + increaseInTermLoan + increaseInCashCredit + decreaseInAdvanceDeposits + decreaseInDebtors + provisions + decreaseInStock;

      // USES [B]
      const increaseInFixedAssets = i === 0 ? fixedCapitalInvested : 0;
      const interestOnBankLoan = profit.interestOnTermLoan + (profit.interestOnWorkingCapital || 0);
      const drawing = i === 0 ? 0 : Math.round(profit.profitAfterTax * 0.20);
      const taxPayment = profit.provisionForTaxation || 0;

      const totalB = increaseInFixedAssets + interestOnBankLoan + drawing + taxPayment;

      const netSurplusDeficit = totalA - totalB;
      const openCashBalance = Math.round(runningCashBalance);
      const closingCashBalance = Math.round(openCashBalance + netSurplusDeficit);

      projectedCashFlow.push({
        year: profit.year,
        pbit,
        depreciation,
        increaseInCapital,
        increaseInTermLoan,
        increaseInCashCredit,
        decreaseInAdvanceDeposits,
        decreaseInDebtors,
        provisions,
        decreaseInStock,
        totalA,
        increaseInFixedAssets,
        interestOnBankLoan,
        drawing,
        taxPayment,
        totalB,
        openCashBalance,
        netSurplusDeficit,
        closingCashBalance
      });

      runningCashBalance = closingCashBalance;
    }

    const financialPosition = [];

    for (let i = 0; i < profitabilityStatement.length; i++) {
      const profit = profitabilityStatement[i];
      const ratio = ratioAnalysis[i];
      const balanceSheet = projectedBalanceSheet[i];

      // Fix: Safe calculation with fallback to 0
      const profitAfterTax = Number(profit.profitAfterTax) || 0;
      const depreciation = Number(profit.yearDepreciation) || 0;
      const cashGeneration = profitAfterTax + depreciation;

      // Safe Balance Sheet values
      const totalAssets = Number(balanceSheet.totalAssets) || 0;
      const netFixedAssets = Number(balanceSheet.netFixedAssetsWDV) || 0;
      const currentLiabilities = Number(balanceSheet.currentLiabilitiesAndProvision) || 0;

      financialPosition.push({
        year: profit.year.toString(),
        netSales: Number(profit.totalA) || 0,
        netProfitAfterTax: profitAfterTax,
        cashGeneration: cashGeneration, // Ab ye NaN nahi aayega
        netWorkingCapital: (totalAssets - netFixedAssets) - currentLiabilities,
        currentRatio: Number(ratio.currentRatio) || 0,
        totalNetWorth: Number(ratio.tnw) || 0,
        tolToTnwRatio: Number(ratio.tolToTnw) || 0,
        termLiabilityToTnwRatio: Number(ratio.termLiabilityToTnw) || 0
      });
    }


    //-----------------------AFPTable------------------
    const AFPTable = [];

    for (let i = 0; i < profitabilityStatement.length; i++) {
      const balanceSheet = projectedBalanceSheet[i];
      const capitalAndReserves = Number(balanceSheet.capital) || 0;
      const longTermLiabilities = Number(balanceSheet.termLoan) || 0;
      const currentLiabilities = (Number(balanceSheet.currentLiabilitiesAndProvision) || 0) + (Number(balanceSheet.cashCredit) || 0);
      const totalLiability = capitalAndReserves + longTermLiabilities + currentLiabilities;

      // Assets Side
      const fixedAssets = Number(balanceSheet.netFixedAssetsWDV) || 0;
      const nonCurrentAssets = 0;
      const currentAssets = (Number(balanceSheet.stockOfWIP) || 0) +
        (Number(balanceSheet.sundryDebtors) || 0) +
        (Number(balanceSheet.depositAndAdvance) || 0) +
        (Number(balanceSheet.cashAndBankBalance) || 0);
      const intangibleAssets = 0;
      const totalAssets = fixedAssets + nonCurrentAssets + currentAssets + intangibleAssets;

      AFPTable.push({
        year: balanceSheet.year.toString(),
        capitalAndReserves,
        longTermLiabilities,
        currentLiabilities,
        totalLiability,
        fixedAssets,
        nonCurrentAssets,
        currentAssets,
        intangibleAssets,
        totalAssets
      });
    }


    //--------------final Assumption------------

    // 1. Dynamic Data Extraction (Loan Period aur Workforce)
    const selectedLoanPeriodText = data.loanDetails?.loanPeriod || "5 Years";
    const loanDurationYearsCount = parseInt(selectedLoanPeriodText.toString().replace(/[^0-9]/g, '')) || 5;
    const employmentPotentialCount = data.businessDetails?.employmentPotential || "10 Above";
    const averageDebtServiceCoverageRatio = averageDSCR || 0;

    // 2. Initialize Arrays (Senior Style)
    const revenueFromSalesSummary = [];
    const totalExpensesSummary = [];
    const taxationProvisionSummary = [];

    // 3. Loop through Profitability Statement and Push Data
    for (const profitabilityItem of profitabilityStatement) {

      // Revenue (Gross Receipts) Table Data Push
      revenueFromSalesSummary.push({
        year: profitabilityItem.year.toString(),
        grossReceipts: Number(profitabilityItem.totalA) || 0
      });

      // Total Expenses Table Data Push
      totalExpensesSummary.push({
        year: profitabilityItem.year.toString(),
        totalExpenditure: Number(profitabilityItem.totalB) || 0
      });

      // Taxation Table Data Push
      taxationProvisionSummary.push({
        year: profitabilityItem.year.toString(),
        taxAmount: Number(profitabilityItem.provisionForTaxation)
      });
    }

    // 4. Final Assumptions Object taiyaar karein
    const finalFinancialAssumptions = {
      incrementInGrossReceipts: data.assumptions?.projectedIncrementReceipts || "125%",
      incrementInExpenditure: data.assumptions?.projectedIncrementExpenditure || "110%"
    };

    // --- 4. PREPARE FINAL DATA ---

    const finalData = {
      ...data,
      userId: session.user.id,
      loanDetails: {
        fixedCapitalInvested,
        workingCapitalInvested,
        totalProjectCost,
        termLoan,
        workingCapitalLoan,
        totalLoanAmountNeeded,
        promotersContribution: totalProjectCost * 0.10,
        averageDSCR: averageDSCR,
      },
      revenueDetails: {
        productName: data.revenueDetails.productName,
        salesType: data.revenueDetails.salesType,
        salesRevenue: data.revenueDetails.salesRevenue,
        totalSalesRevenueAnually: data.revenueDetails.salesRevenue * 12,
        yearlyGrowthRate: yearlyGrowthRate
      },
      costStatement,
      depreciationSchedule,
      purchaseCostStatement,
      generalExpensesStatement,
      profitabilityStatement,
      dscrStatement,
      averageDSCR,
      swotAnalysis,
      actionPlan,
      targetMarket,
      ebidtaAnalysis,
      returnOnInvestmentAnalysis,
      breakEvenSalesData,
      loanCalculation,
      loanInterestTablesDetail,
      mpbfAnalysis,
      sensitivityAnalysis,
      ratioAnalysis,
      projectedBalanceSheet,
      breakEvenAnalysis,
      projectedCashFlow,
      financialPosition,
      AFPTable,
      // finalFinancialAssumptions,
      assumptions: assumptions,
      industryJustifications: industryList




    };

    const project = await ProjectReportModel.create(finalData);
    return NextResponse.json({
      message: "Project Created Successfully",
      data: project
    }, { status: 200 });

  } catch (error: any) {
    // ... error handling remains the same
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues.map((e: any) => ({ field: e.path.join("."), message: e.message })) }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error: " + error }, { status: 500 });
  }
}
