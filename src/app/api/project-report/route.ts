import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import ProjectReportModel from "@/db/models/projectReportModel";
import { projectReportSchema } from "@/Schemas/projectReportSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Value } from "@radix-ui/react-select";

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request)
    console.log(session)
    await dbConnect();
    const body = await request.json()
    const data = projectReportSchema.parse(body)
    const businessReq: Record<string, number | undefined> =
      data.businessRequirements ?? {};

    const monthExp: Record<string, number | undefined> =
      data.monthlyExpenses ?? {};
    // const category = data.personalDetails?.category;
    // const gender = data.personalDetails?.gender;
    let govtMarginPercent = 0.54; // default for General

    // if (gender === "female") {
    //   govtMarginPercent = 0.25;
    // }
    // if (
    //   category === "obc" ||
    //   category === "sc" ||
    //   category === "st"
    // ) {
    //   govtMarginPercent = 0.25;
    // }



    // FIXED CAPITAL
    const fixedCapitalInvested = Object.values(businessReq)
      .filter((value): value is number => typeof value === "number")
      .reduce((sum, value) => sum + value, 0);

    // WORKING CAPITAL
    const workingCapitalInvested = Object.values(monthExp)
      .filter((value): value is number => typeof value === "number")
      .reduce((sum, value) => sum + value, 0);

    const totalProjectCost = fixedCapitalInvested + workingCapitalInvested;
    const marginMoney = totalProjectCost * govtMarginPercent;
    const termLoan = totalProjectCost - marginMoney;
    const workingCapitalLoan = totalProjectCost * 0.36;
    const totalLoanAmountNeeded = workingCapitalLoan + termLoan;

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
        averageDSCR: 1.65,
        

      },
      revenueDetails: {
        productName: data.revenueDetails.productName,
        salesType: data.revenueDetails.salesType,
        salesRevenue: data.revenueDetails.salesRevenue,
        totalSalesRevenueAnually: data.revenueDetails.salesType === "monthly" ? data.revenueDetails.salesRevenue * 12 : data.revenueDetails.salesRevenue
      },
      promotersContribution: totalProjectCost * 0.10
    };

    console.log(finalData)

    const project = await ProjectReportModel.create({
      ...finalData,
    });

    return NextResponse.json({
      message: "Project Created Successfully",
      data: project
    }, { status: 200 })

  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          errors: error.issues.map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json({
      message: "Internal Server Error: " + error
    }, { status: 500 });
  }
}
