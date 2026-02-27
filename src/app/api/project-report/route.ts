import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import ProjectReportModel from "@/db/models/projectReportModel";
import { NextResponse } from "next/server";
import { generateProjectReport } from "@/lib/services/report-calculation.service";

export async function POST(request: Request) {
  try {
    await dbConnect();

    // 🔐 AUTH
    const session = await requireAuth(request);

    // 📥 BODY
    const body = await request.json();

    // 🔥 CORE CALCULATION ENGINE
    const reportCoreData = await generateProjectReport(body);

    const finalData = {
      ...body,
      userId: session.user.id,
      ...reportCoreData
    };

    // 💾 SAVE
    const project = await ProjectReportModel.create(finalData);

    return NextResponse.json(
      {
        message: "Project Report Generated Successfully",
        data: project
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("🔥 PROJECT REPORT ERROR:", error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
