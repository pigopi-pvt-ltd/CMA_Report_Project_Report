import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import CmaReport from "@/db/models/cmaReportModel";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
        const session = await requireAuth(request);
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
        }

        const deletedReport = await CmaReport.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!deletedReport) {
            return NextResponse.json({ error: "Report not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "CMA Report deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting CMA report:", error);
        return NextResponse.json({ error: "Failed to delete CMA report" }, { status: 500 });
    }
}
