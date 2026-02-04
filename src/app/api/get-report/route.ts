import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import ProjectReportModel from "@/db/models/projectReportModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await requireAuth(request);
    await dbConnect();

    const rawReports = await ProjectReportModel.find({ userId: session.user.id });

    const reports = rawReports.map((r: any) => ({
      id: String(r._id),
      name: r.businessName ?? "Untitled",
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "",
    }));

    console.log("Fetched reports:", reports);

    return NextResponse.json({ data: reports, message: "Reports fetched successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}