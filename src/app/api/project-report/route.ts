import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import ProjectReportModel from "@/db/models/projectReportModel";
import { projectReportSchema } from "@/Schemas/projectReportSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request)
    await dbConnect();
    const body = await request.json()
    const data = projectReportSchema.parse(body)

    const businessReq: Record<string, number | undefined> = data.businessRequirements ?? {};
    const monthExp: Record<string, number | undefined> = data.monthlyExpenses ?? {};
    const govtMarginPercent = 0.54;

    // --- 1. CALCULATE FINANCIALS ---
    const fixedCapitalInvested = Object.values(businessReq)
      .filter((value): value is number => typeof value === "number")
      .reduce((sum, value) => sum + value, 0);

    const workingCapitalInvested = Object.values(monthExp)
      .filter((value): value is number => typeof value === "number")
      .reduce((sum, value) => sum + value, 0);

    const totalProjectCost = fixedCapitalInvested + workingCapitalInvested;
    const termLoan = totalProjectCost * govtMarginPercent;
    const workingCapitalLoan = totalProjectCost * 0.36;
    const totalLoanAmountNeeded = workingCapitalLoan + termLoan;

    // --- 2. GENERATE COST STATEMENT ---
    const annualSales = data.revenueDetails.salesRevenue * 12

    let sales = annualSales;
    const costStatement = [];
    let currentYearLabel = new Date().getFullYear();

    for (let index = 0; index < data.loanPeriod; index++) {
      costStatement.push({
        year: currentYearLabel,
        domesticSales: sales,
        subTotal: sales,
        netSales: sales,
        totalGrossIncome: sales,
      });
      currentYearLabel++;
      sales = sales + (sales * 0.25); // 35% growth rate found earlier
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
        averageDSCR: 1.65,
      },
      revenueDetails: {
        productName: data.revenueDetails.productName,
        salesType: data.revenueDetails.salesType,
        salesRevenue: data.revenueDetails.salesRevenue,
        totalSalesRevenueAnually: data.revenueDetails.salesRevenue * 12
      },
      costStatement,
      depreciationSchedule // Added the new schedule here
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
