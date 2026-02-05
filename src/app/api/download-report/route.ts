import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import path from "path"
import { requireAuth } from "@/lib/requireAuth"
import ProjectReportModel from "@/db/models/projectReportModel";
import dbConnect from "@/db/dbConnect"
import { drawPromoterTable, drawDepreciationSchedules, drawCostStatement, drawLoanTable, drawMeansOfFinance, drawProjectCostSummary, drawBusinessTable, drawSalesRevenueTable } from "@/helpers/pdfSections";

const drawHeader = (doc: any, text: string, fontBoldPath: string) => {
  doc.fontSize(22).fillColor("#4154F1").font(fontBoldPath).text(text, { align: "center" });
  doc.moveDown(0.5);
  const y = doc.y;
  const leftX = doc.page.margins.left;
  const rightX = doc.page.width - doc.page.margins.right;

  doc.strokeColor("#4154F1").lineWidth(2).moveTo(leftX, y).lineTo(rightX, y).stroke();
  doc.fillColor("#000000").moveDown(1);

}

const toLabel = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const formatRupees = (value: number | string) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "₹ 0.00";
  return `₹ ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


const formatInMillions = (value: number | string) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return "₹ 0.00M";

  // Divide by 1 million
  const millions = num / 1000000;

  return `₹ ${millions.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}M`;
};

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request)
    await dbConnect()

    const { projectId } = await request.json()
    if (!projectId) return NextResponse.json({ message: "Id required" }, { status: 400 });

    const projectData = await ProjectReportModel.findOne({ userId: session.user.id, _id: projectId });
    if (!projectData) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // --- FONT PATHS ---
    const fontPath = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
    const fontBoldPath = path.join(process.cwd(), "public/fonts/Roboto-Bold.ttf");

    const doc = new PDFDocument({ size: "A4", margin: 20, font: fontPath });
    const buffers: Buffer[] = [];
    doc.on("data", (b) => buffers.push(b));
    const pdfDone = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
    });

    // --- Header ---
    drawHeader(doc, "PROJECT AT A GLANCE", fontBoldPath)

    const leftX = doc.page.margins.left;


    const fonts = { fontPath, fontBoldPath };
    // 1. Promoter
    drawPromoterTable(doc, projectData.personalDetails, fonts);
    doc.moveDown(1);

    // 2. Business
    drawBusinessTable(doc, projectData, fonts, leftX);

    // 3. Loan (New Page)
    doc.addPage();
    drawLoanTable(doc, projectData, formatRupees, fonts);

    // Sales and Revenue Table
    doc.addPage()
    drawSalesRevenueTable(doc, projectData, formatRupees, fonts);
    doc.moveDown(2);

    // 4. Project Cost
    doc.addPage();
    drawHeader(doc, "PROJECT COST", fontBoldPath)
    drawProjectCostSummary(doc, projectData, formatRupees, toLabel, fonts);
    doc.moveDown(1);
    drawMeansOfFinance(doc, projectData.loanDetails, formatRupees, fonts);

    // 5. cost statement Table
    doc.addPage();

    drawCostStatement(doc, projectData, formatInMillions, fonts);

    // 6. Depreciation
    drawDepreciationSchedules(doc, projectData.depreciationSchedule, formatRupees, fonts, leftX);

    doc.end();
    const pdfBuffer = await pdfDone;

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Business_Report.pdf"',
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "PDF Error" }, { status: 500 });
  }
}
