import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import CmaReportModel from "@/db/models/cmaReportModel";
import { cmaReportSchema } from "@/Schemas/cmaReportSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    // 1️⃣ Auth
    const session = await requireAuth(request);

    // 2️⃣ DB connect
    await dbConnect();

    // 3️⃣ Read body
    const body = await request.json();

    // 4️⃣ Validate (NO calculation)
    const data = cmaReportSchema.parse(body);

    // 5️⃣ Save EXACT user input
    const report = new CmaReportModel({
      userId: session.user.id,

      businessName: data.businessName, // ✅ FIXED

      businessType: data.businessType,
      industryType: data.industryType,
      loanType: data.loanType,

      businessRequirements: data.businessRequirements,
      monthlyExpenses: data.monthlyExpenses,

      revenueDetails: data.revenueDetails,
      loanPeriod: data.loanPeriod,

      personalDetails: data.personalDetails,
      businessDetails: data.businessDetails,
    });

    await report.save();

    return NextResponse.json(
      {
        success: true,
        message: "CMA Report saved successfully",
        reportId: report._id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("CMA REPORT ERROR:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation Error", errors: error },
        { status: 400 }
      );
    }

    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
