import { NextResponse } from "next/server";
import connectDB from "@/db/dbConnect";
import Report from "@/db/models/projectReportModel";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
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

    const deleted = await Report.findByIdAndDelete(reportId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
