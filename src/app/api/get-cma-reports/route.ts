import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import CmaReport from "@/db/models/cmaReportModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await requireAuth(request);
        await dbConnect();

        const rawReports = await CmaReport.find({ userId: session.user.id }).sort({ createdAt: -1 });

        const reports = rawReports.map((r: any) => ({
            id: String(r._id),
            name: r.businessName ?? "Untitled CMA",
            createdAt: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "",
        }));

        return NextResponse.json({ data: reports, message: "CMA Reports fetched successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching CMA reports:", error);
        return NextResponse.json({ error: "Failed to fetch CMA reports" }, { status: 500 });
    }
}
