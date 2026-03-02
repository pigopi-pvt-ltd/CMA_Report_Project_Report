import { NextResponse } from "next/server";
import connectDB from "@/db/dbConnect";
import Report from "@/db/models/projectReportModel";

import ProjectReportModel from "@/db/models/projectReportModel";

import mongoose from "mongoose";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("id");

    if (!reportId) {
      return NextResponse.json(
        { success: false, message: "Report id required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Mongo id" },
        { status: 400 }
      );
    }

    await connectDB();

    // Finding whole data related to report according to reportId
    const report = await ProjectReportModel.findById(reportId);

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Report fetched successfully",
      data: report,
    });

  } catch (error) {
    console.error("Fetch single report error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}




export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("id");

    if (!reportId) {
      return NextResponse.json(
        { success: false, message: "Report id required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Mongo id" },
        { status: 400 }
      );
    }

    const body = await request.json();

    await connectDB();

    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      body,
      { new: true }
    );

    if (!updatedReport) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
