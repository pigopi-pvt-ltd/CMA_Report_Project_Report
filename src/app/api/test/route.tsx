
export const runtime = "nodejs";

import React from 'react'
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireAuth } from "@/lib/requireAuth";
import ProjectReportModel from "@/db/models/projectReportModel";
import dbConnect from "@/db/dbConnect";
import { ProjectReportPdf } from "@/lib/pdf/projectReportPdf";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    await dbConnect();

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { message: "Project Id is required" },
        { status: 400 }
      );
    }

    const projectData = await ProjectReportModel.findOne({
      userId: session.user.id,
      _id: projectId,
    }).lean();

    if (!projectData) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // 🔹 Render React-PDF → Buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(ProjectReportPdf, {
        personalDetails: projectData.personalDetails,
      })
    );

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="business-loan-report.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
