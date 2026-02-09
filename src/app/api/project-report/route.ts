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

    // --- 1. CALCULATE FINANCIALS ---
    // const fixedCapitalInvested = Object.values(businessReq)
    //   .filter((value): value is number => typeof value === "number" )
    //   .reduce((sum, value) => sum + value, 0);
    const fixedCapitalInvested = Object.entries(businessReq)
      .filter((value) => {
        // if(value[0]==="workingExpenses" && typeof value[1] === "number")
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


    // // Multipliers nikalna loop mein use karne ke liye
    // const receiptsMultiplier = parseFloat(assumptions.particulars.projectedIncrementReceipts) / 100;
    // const expenditureMultiplier = parseFloat(assumptions.particulars.projectedIncrementExpenditure) / 100;

    // Annual Rate ko dynamic banana (Static 11.10 hata kar)
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
    const reportDate = new Date(); // Aaj ki date

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
      sales = sales * 1.25;
    }


    // --- 2.5 GENERATE DETAILED PURCHASE COST STATEMENT ---
    let rawMaterialAnnual = (businessReq.rawMaterials || 0) + (monthExp.purchaseOfRawMaterials || 0) * 12;
    let purchaseYear = new Date().getFullYear();
    const purchaseCostStatement = [];

    for (let i = 0; i < data.loanPeriod; i++) {
      const currentYearSales = costStatement[i].netSales;

      const indigenous = Math.round(rawMaterialAnnual);

      // 1. Freight & Direct Expenses (PDF logic)
      const freightAndOtherExpenses = Math.round(indigenous * 0.02); // 2% Freight
      const totalDirectExpenses = freightAndOtherExpenses;
      const subTotal = indigenous + totalDirectExpenses;

      // 2. Work In Progress (WIP) Logic - 2% of subtotal
      const openingStockOfWIP = i === 0 ? 0 : Math.round(subTotal * 0.02);
      const subTotalAfterOpeningStock = subTotal + openingStockOfWIP;
      const closingStockOfWIP = Math.round(subTotal * 0.02);

      // 3. Cost of Production
      const totalCostOfProduction = subTotalAfterOpeningStock - closingStockOfWIP;

      // 4. Finished Goods Logic - 3% of COP
      const openingStockOfFinishedGoods = i === 0 ? 0 : Math.round(totalCostOfProduction * 0.03);
      const subTotalAfterOpeningStockFinishedGoods = totalCostOfProduction + openingStockOfFinishedGoods;
      const closingStockOfFinishedGoods = Math.round(totalCostOfProduction * 0.03);

      // 5. Final Cost of Sales & Profit
      const totalCostOfSales = subTotalAfterOpeningStockFinishedGoods - closingStockOfFinishedGoods;
      const grossProfit = currentYearSales - totalCostOfSales;

      purchaseCostStatement.push({
        year: purchaseYear,
        imported: 0,
        indigenous,
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
      // Raw Material growth rate 15% (as per your code)
      rawMaterialAnnual = rawMaterialAnnual * 1.15;
    }





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

    for (let i = 0; i < data.loanPeriod; i++) {
      const growth = Math.pow(1.12, i); // 12% growth logic

      // Helper to calculate monthly to annual with growth
      const calcAnn = (val: number | undefined) => Math.round((val || 0) * 12 * growth);
      const interestOnTermLoan = Math.round(getYearlyInterest(i + 1));
      const interestOnCC = 0;

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

    // --- 2.8 PROFITABILITY STATEMENT CALCULATION LOGIC (FINAL FIX) ---
    const profitabilityStatement: any[] = [];

    for (let i = 0; i < data.loanPeriod; i++) {
      // 1. Income (A)
      const totalA = costStatement[i].netSales || 0;

      // 2. Expenditure (B)
      const genExp = generalExpensesStatement[i];
      const purExp = purchaseCostStatement[i];

      // Pehle har saal ka Interest nikal lo (Jo humne Step 1 mein function banaya tha)
      const interestOnTermLoan = Math.round(getYearlyInterest(i + 1));

      // Total B = Operating Expenses + Raw Material + Freight
      const totalB =
        genExp.totalGeneralExpenses +
        (purExp.indigenous || 0) +
        (purExp.freightAndOtherExpenses || 0);

      // 3. Profit Calculations
      const netCredit = totalA - totalB;

      // Profit Before Tax (PBT) mein se Interest minus karna zaroori hai
      const profitBeforeTax = netCredit - interestOnTermLoan;

      // 4. Tax Logic (30%)
      const provisionForTaxation = profitBeforeTax > 0 ? Math.round(profitBeforeTax * 0.30) : 0;

      // 5. Final Profits
      const profitAfterTax = profitBeforeTax - provisionForTaxation;

      profitabilityStatement.push({
        year: costStatement[i].year,
        totalA,
        totalB,
        netCredit,
        interestOnTermLoan, // Ab ye error nahi dega
        interestOnWorkingCapital: 0,
        profitBeforeTax,
        provisionForTaxation,
        profitAfterTax,
        balanceCarriedOverToBalanceSheet: profitAfterTax
      });
    }
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
      const totalDebtService = repayment + profit.interestOnTermLoan;

      const dscrRatio = totalDebtService === 0 ? 0 : Number((totalCashAccrual / totalDebtService).toFixed(2));

      totalDSCRSum += dscrRatio;

      dscrStatement.push({
        year: costStatement[i].year,
        netProfit: profit.profitAfterTax,
        depreciation: depr,
        interestOnTermLoan: profit.interestOnTermLoan,
        interestOnCC: profit.interestOnWorkingCapital,
        totalCashAccrual,
        loanRepayment: repayment,
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

      const ebit = profit.profitAfterTax + profit.provisionForTaxation + profit.interestOnTermLoan;
      const ebidta = ebit + depr;

      ebidtaAnalysis.push({
        year: profit.year,
        netIncome: profit.profitAfterTax,
        taxExpense: profit.provisionForTaxation,
        interestOnTermLoan: profit.interestOnTermLoan,
        interestOnCC: 0,
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



    //

    const breakEvenAnalysis = [];

    for (let i = 0; i < data.loanPeriod; i++) {
      const profit = profitabilityStatement[i];
      const genExp = generalExpensesStatement[i];
      const purExp = purchaseCostStatement[i];

      // 1. Sales (A)
      const sales = profit.totalA;

      // 2. Variable Costs
      // Raw Material + Freight + Other Direct Costs
      const variableCosts = (purExp.indigenous || 0) + (purExp.freightAndOtherExpenses || 0);

      // 3. Gross Profit (B) = Sales - Variable Costs
      const grossProfit = sales - variableCosts;

      // 4. Fixed Costs (C)
      // Operating Expenses + Interest on Loans (Interest on CC agar hai to add karein)
      const fixedCosts = genExp.totalGeneralExpenses + profit.interestOnTermLoan + (profit.interestOnWorkingCapital || 0);

      // 5. Break Even Sales Formula: (Sales * Fixed Cost) / Gross Profit
      // Division by zero check
      const breakEvenSales = grossProfit > 0
        ? Math.round((sales * fixedCosts) / grossProfit)
        : 0;

      breakEvenAnalysis.push({
        year: profit.year,
        sales: sales,
        variableCosts: variableCosts,
        grossProfit: grossProfit,
        depreciation: genExp.depreciation,
        interestOnTermLoan: profit.interestOnTermLoan,
        interestOnCC: profit.interestOnWorkingCapital || 0,
        fixedCosts: fixedCosts,
        breakEvenSales: breakEvenSales
      });
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




    // --- 4. PREPARE FINAL DATA ---
    // --- 4. PREPARE FINAL DATA (FIXED) ---
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
        totalSalesRevenueAnually: data.revenueDetails.salesRevenue * 12
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
      breakEvenAnalysis,
      loanCalculation,
      loanInterestTablesDetail,
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
