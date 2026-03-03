import { NextResponse } from "next/server";
import connectDB from "@/db/dbConnect";
import CmaReport from "@/db/models/cmaReportModel";
import ProjectReportModel from "@/db/models/projectReportModel";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("id");
    const reportType = searchParams.get("type"); // 'cma' or 'project'

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

    let deletedReport;
    let reportTypeName;

    if (reportType === 'cma') {
      deletedReport = await CmaReport.findOneAndDelete({
        _id: reportId,
      });
      reportTypeName = 'CMA';
    } else if (reportType === 'project') {
      deletedReport = await ProjectReportModel.findOneAndDelete({
        _id: reportId,
      });
      reportTypeName = 'Project';
    } else {
      // If no type specified, try both models
      deletedReport = await CmaReport.findOneAndDelete({
        _id: reportId,
      });

      if (!deletedReport) {
        deletedReport = await ProjectReportModel.findOneAndDelete({
          _id: reportId,
        });
        reportTypeName = 'Project';
      } else {
        reportTypeName = 'CMA';
      }
    }

    if (!deletedReport) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${reportTypeName} Report deleted successfully`,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}