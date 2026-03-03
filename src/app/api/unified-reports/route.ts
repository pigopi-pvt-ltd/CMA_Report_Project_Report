import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import CmaReport from "@/db/models/cmaReportModel";
import ProjectReportModel from "@/db/models/projectReportModel";
import { NextResponse } from "next/server";
import { generateProjectReport } from "@/lib/services/report-calculation.service";

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request);
    await dbConnect();

    const body = await request.json();
    const { type, ...reportData } = body;

    if (!type) {
      return NextResponse.json({ error: "Report type is required" }, { status: 400 });
    }

    // Add userId to the report data
    const reportWithUser = {
      ...reportData,
      userId: session.user.id
    };

    let newReport;
    let reportTypeName;

    if (type === 'cma') {
      // For CMA reports, calculate all required fields first (same as Project reports)
      const calculatedData = await generateProjectReport(reportWithUser);
      const fullReportData = {
        ...reportWithUser,
        ...calculatedData
      };
      newReport = new CmaReport(fullReportData);
      reportTypeName = 'CMA';
    } else if (type === 'project') {
      // For project reports, calculate all required fields first
      const calculatedData = await generateProjectReport(reportWithUser);
      const fullReportData = {
        ...reportWithUser,
        ...calculatedData
      };
      newReport = new ProjectReportModel(fullReportData);
      reportTypeName = 'Project';
    } else {
      return NextResponse.json({ error: "Invalid report type. Use 'cma' or 'project'" }, { status: 400 });
    }

    await newReport.save();

    return NextResponse.json({ 
      data: { id: newReport._id, ...newReport.toObject() },
      message: `${reportTypeName} Report created successfully` 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireAuth(request);
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("type"); // 'cma', 'project', or 'all'

    let rawReports;
    let reportTypeName;

    if (reportType === 'cma') {
      rawReports = await CmaReport.find({ userId: session.user.id }).sort({ createdAt: -1 });
      reportTypeName = 'CMA';
    } else if (reportType === 'project') {
      rawReports = await ProjectReportModel.find({ userId: session.user.id }).sort({ createdAt: -1 });
      reportTypeName = 'Project';
    } else {
      // Default to all reports if no type specified or 'all' is specified
      const [cmaReports, projectReports] = await Promise.all([
        CmaReport.find({ userId: session.user.id }).sort({ createdAt: -1 }),
        ProjectReportModel.find({ userId: session.user.id }).sort({ createdAt: -1 })
      ]);
      
      // Combine and sort reports by createdAt
      rawReports = [...cmaReports, ...projectReports].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      reportTypeName = 'All';
    }

    const reports = rawReports.map((r: any) => ({
      id: String(r._id),
      name: r.businessName ?? (r.constructor.modelName.toLowerCase().includes('cma') ? "Untitled CMA" : "Untitled"),
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "",
      type: r.constructor.modelName.toLowerCase().includes('cma') ? 'cma' : 'project',
      model: r.constructor.modelName
    }));

    return NextResponse.json({ 
      data: reports, 
      message: `${reportTypeName} Reports fetched successfully` 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}