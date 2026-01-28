import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import ProjectReportModel from "@/db/models/projectReportModel";
import { projectReportZodSchema } from "@/Schemas/projectReportSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Value } from "@radix-ui/react-select";

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request)
    console.log(session)
    await dbConnect();
    const body = await request.json()
    const data = projectReportZodSchema.parse(body)
    const businessReq: Record<string, number | undefined> =
      data.businessRequirements ?? {};

    const monthExp: Record<string, number | undefined> =
      data.monthlyExpenses ?? {};

    // FIXED CAPITAL
    const fixedCapitalInvested = Object.values(businessReq)
      .filter((value): value is number => typeof value === "number")
      .reduce((sum, value) => sum + value, 0);

    // WORKING CAPITAL
    const workingCapitalInvested = Object.values(monthExp)
      .filter((value): value is number => typeof value === "number")
      .reduce((sum, value) => sum + value, 0);

      const totalProjectCost = fixedCapitalInvested + workingCapitalInvested;

    const finalData = {
      ...data,
      loanDetails: {
        fixedCapitalInvested,
        workingCapitalInvested,
        totalProjectCost,
        termLoan: 1200000,
        workingCapitalLoan: 300000,
        totalLoanAmountNeeded: 1500000,
        averageDSCR: 1.65,
      },
    };




    const project = await ProjectReportModel.create({
      ...finalData,
      userId: session.user.id
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
