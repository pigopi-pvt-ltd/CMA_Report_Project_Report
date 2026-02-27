import { NextResponse } from "next/server";
import connectDB from "@/db/dbConnect";
import CmaReport from "@/db/models/cmaReportModel";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/requireAuth";

export async function PUT(request: Request) {
    try {
        const session = await requireAuth(request);
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

        const updatedReport = await CmaReport.findOneAndUpdate(
            { _id: reportId, userId: session.user.id },
            { $set: { businessName: body.businessName } },
            { new: true }
        );

        if (!updatedReport) {
            return NextResponse.json(
                { success: false, message: "Report not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "CMA Report updated successfully",
            data: updatedReport,
        });
    } catch (error) {
        console.error("CMA Edit error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
