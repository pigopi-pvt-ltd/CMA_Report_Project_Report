import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import CmaReport from "@/db/models/cmaReportModel";
import { requireAuth } from "@/lib/requireAuth";
import { generateProjectReport } from "@/lib/services/report-calculation.service";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    await dbConnect();

    const body = await request.json();

    // 1. Basic required validation for Schema requirements
    const businessName = body.businessName || body.businessDetails?.businessName;
    const businessType = body.businessType || body.industryType; // Fallback if missing

    if (
      !businessName ||
      !body.industryType ||
      !body.loanType ||
      !body.loanPeriod ||
      !body.personalDetails ||
      !body.businessDetails ||
      !body.revenueDetails
    ) {
      return NextResponse.json(
        { message: "Missing required fields (Business Name, Industry, Loan Type, etc.)" },
        { status: 400 }
      );
    }

    // 2. 🔥 CORE CALCULATION ENGINE
    // We pass the body to the engine
    const reportCoreData = await generateProjectReport(body);

    // 3. 🧠 MERGE DATA & CLEANUP
    // Remove _id if it exists to prevent duplicate key errors on create
    const { _id, ...cleanBody } = body;

    const finalData = {
      ...cleanBody,
      businessName,
      businessType: body.businessType || body.industryType, // Ensure it's top level for schema
      userId: session.user.id,
      ...reportCoreData,
      // Ensure nested fields that might be missing in reportCoreData are preserved from body
      loanDetails: {
        ...reportCoreData.loanDetails
      }
    };

    // 4. 💾 SAVE
    // Using findOneAndUpdate with upsert:true if we want to allow editing, 
    // but for now, let's keep it as create or handle the existing ID if the user intends to update.
    const savedData = await CmaReport.create(finalData);

    return NextResponse.json(
      {
        message: "CMA Report Generated & Saved Successfully",
        data: savedData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CMA_REPORT_ERROR:", error);

    // Provide more specific error message if it's a Mongoose validation error
    const message = error.name === "ValidationError"
      ? `Validation Error: ${Object.values(error.errors).map((err: any) => err.message).join(", ")}`
      : error.message;

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
