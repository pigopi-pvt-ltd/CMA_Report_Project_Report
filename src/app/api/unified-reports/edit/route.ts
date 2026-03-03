import { NextResponse } from "next/server";
import connectDB from "@/db/dbConnect";
import CmaReport from "@/db/models/cmaReportModel";
import ProjectReportModel from "@/db/models/projectReportModel";
import mongoose from "mongoose";
import { auth } from "@/lib/auth"; // Your Better-Auth import
import { headers } from "next/headers";
import { generateProjectReport } from "@/lib/services/report-calculation.service";

// --- GET: Fetch data to populate the edit form ---
export async function GET(request: Request) {
  try {
    await connectDB();

    // 1. Better-Auth Session Check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract Query Params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid Report ID" }, { status: 400 });
    }

    // 3. Fetch Report (Security: Must match userId)
    let report;
    const filter = { _id: id, userId: session.user.id };

    if (type === 'cma') {
      report = await CmaReport.findOne(filter);
    } else if (type === 'project') {
      report = await ProjectReportModel.findOne(filter);
    } else {
      // Search in both if type is missing
      report = await CmaReport.findOne(filter) || await ProjectReportModel.findOne(filter);
    }

    if (!report) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: report });

  } catch (error: any) {
    console.error("GET Edit Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// --- PUT: Update existing report data ---
export async function PUT(request: Request) {
  try {
    await connectDB();

    // 1. Better-Auth Session Check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract Params & Body
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    const body = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid Report ID" }, { status: 400 });
    }

    // 3. Update Logic (Security: Must match userId)
    let updatedReport;
    const filter = { _id: id, userId: session.user.id };
    
    // For project and CMA reports, recalculate all fields
    if (type === 'project' || type === 'cma') {
      const calculatedData = await generateProjectReport(body);
      const fullUpdateData = {
        ...body,
        ...calculatedData
      };
      
      const Model = type === 'project' ? ProjectReportModel : CmaReport;
      updatedReport = await Model.findOneAndUpdate(
        filter, 
        { $set: fullUpdateData }, 
        { new: true, runValidators: true }
      );
    } else {
      return NextResponse.json({ success: false, message: "Invalid report type" }, { status: 400 });
    }

    if (!updatedReport) {
      return NextResponse.json({ success: false, message: "Update failed or Unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Report updated successfully", 
      data: updatedReport 
    });

  } catch (error: any) {
    console.error("PUT Edit Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}