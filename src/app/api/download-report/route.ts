export const runtime = "nodejs"

import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import path from "path"
import { requireAuth } from "@/lib/requireAuth"
import ProjectReportModel from "@/db/models/projectReportModel";
import dbConnect from "@/db/dbConnect"

function addPageTitle(doc: PDFKit.PDFDocument, title: string) {
  doc.addPage();
  doc.fontSize(20).fillColor("#000").text(title, {
    align: "center",
  });
  doc.moveDown(1.5);
}

function drawTableHeader(
  doc: PDFKit.PDFDocument,
  startX: number,
  col1Width: number,
  col2Width: number,
  rowHeight: number
) {
  const tableWidth = col1Width + col2Width;

  doc.fillColor("#eeeeee")
    .rect(startX, doc.y, tableWidth, rowHeight)
    .fill();

  doc.fillColor("#000").fontSize(11);
  doc.text("Field Description", startX + 10, doc.y + 7, { width: col1Width });
  doc.text("Details", startX + col1Width + 10, doc.y - 12, {
    width: col2Width,
  });

  doc
    .strokeColor("#cccccc")
    .moveTo(startX, doc.y + rowHeight)
    .lineTo(startX + tableWidth, doc.y + rowHeight)
    .stroke();

}

function ensureSpace(
  doc: PDFKit.PDFDocument,
  requiredHeight: number,
  onNewPage: () => void
) {
  if (doc.y + requiredHeight > doc.page.height - 50) {
    doc.addPage();
    onNewPage();
  }
}

function drawKeyValueTable(
  doc: PDFKit.PDFDocument,
  data: Record<string, any>,
  options?: {
    title?: string;
  }
) {
  const startX = 50;
  const col1Width = 220;
  const col2Width = 270;
  const rowHeight = 25;
  const tableWidth = col1Width + col2Width;

  if (options?.title) {
    doc.fontSize(16).fillColor("#000").text(options.title);
    doc.moveDown(0.5);
  }



  for (const [key, value] of Object.entries(data)) {

    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());

    const displayValue =
      typeof value === "boolean" ? (value ? "Yes" : "No") : String(value ?? "-");

    const y = doc.y;

    doc
      .strokeColor("#000000")
      .rect(startX, y, col1Width, rowHeight)
      .stroke();

    doc
      .strokeColor("#000000")
      .rect(startX + col1Width, y, col2Width, rowHeight)
      .stroke();


    doc.fillColor("#333").fontSize(10);
    doc
      .font("Helvetica-Bold")
      .text(label, startX + 10, y + 7, {
        width: col1Width - 20,
      });
    doc.text(displayValue, startX + col1Width + 10, y + 7, {
      width: col2Width - 20,
    });

    doc.y = y + rowHeight;
  }
  doc.moveDown(1);
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request)
    await dbConnect()

    const { projectId } = await request.json()
    console.log("project id: ", projectId)
    console.log("user id: ", session.user.id)

    if (!projectId) {
      return NextResponse.json({
        message: "Project Id is required"
      }, { status: 402 })
    }

    const projectData = await ProjectReportModel.findOne({ userId: session.user.id, _id: projectId })
    console.log("project data: " + projectData)

    const fontPath = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      font: fontPath,
    });

    const buffers: Buffer[] = [];
    doc.on("data", (b) => buffers.push(b));

    const pdfDone = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
    });

    // First Page
    doc.fontSize(20).text("Project At A Glance", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(15).text("PROMOTER'S DETAILS", { align: "left" })
    doc.moveDown(0.5);

    drawKeyValueTable(doc, projectData.personalDetails)

    doc.end();
    const pdfBuffer = await pdfDone;

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="business-loan-report.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json({ message: "Failed to generate PDF: " + error }, { status: 500 });
  }
}
