import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import path from "path"
import { requireAuth } from "@/lib/requireAuth"
import CmaReport from "@/db/models/cmaReportModel";
import dbConnect from "@/db/dbConnect"
import {
  drawLoanCalculation,
  drawPromoterTable,
  drawDepreciationSchedules,
  drawLoanTable,
  drawMeansOfFinance,
  drawProjectCostSummary,
  drawBusinessTable,
  drawSalesRevenueTable,
  drawProfitabilityStatement,
  drawCalculationOfDSCR,
  drawEBIDTAAnalysis,
  drawReturnOnInvestment,
  drawBreakEvenSales,
  drawComputationOfMPBF,
  drawImportantRatios,
  drawSensitivityAnalysis,
  drawProjectedBalanceSheet,
  drawBreakEvenAnalysis,
  drawCashFlowStatement,
  drawFinancialPosition,
  drawAFPTable,
  drawFinalAssumption,
  drawAssumptionsTable,
  drawCalculationOfInterestOnTermLoan,
  drawLoanInterestTables,
  drawPurchaseCostStatement,
  drawGeneralExpensesTable,
} from "@/helpers/projectReportpdfSections";
import { drawFlexibleTable, TableRow } from "@/helpers/pdfTable";
import { calculateRevenue } from "@/lib/services/revenue.service";

const drawHeader = (doc: any, text: string, fontBoldPath: string) => {
  drawCenteredHeader(doc, text, fontBoldPath);
};

function drawCenteredHeader(doc: any, text: string, fontPath: string) {
  // Save current position
  const currentY = doc.y;

  // Calculate the usable page width (excluding margins)
  const leftMargin = doc.page.margins.left;
  const rightMargin = doc.page.margins.right;
  const usableWidth = doc.page.width - leftMargin - rightMargin;

  // Reset x position to the left margin to ensure proper centering
  doc.x = leftMargin;

  // Set font properties
  doc.fontSize(22).fillColor("#4154F1").font(fontPath);

  // Draw the centered text across the full usable width
  doc.text(text, 0, currentY, {
    width: usableWidth,
    align: "center"
  });

  // Move down a bit after the text
  doc.moveDown(0.5);

  // Draw the underline spanning from left margin to right margin
  const lineY = doc.y;
  doc.strokeColor("#4154F1").lineWidth(2).moveTo(leftMargin, lineY).lineTo(doc.page.width - rightMargin, lineY).stroke();

  // Reset color and move down
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

    const projectData = await CmaReport.findOne({ userId: session.user.id, _id: projectId });
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
    drawHeader(doc, "CMA REPORT AT A GLANCE", fontBoldPath)

    const leftX = doc.page.margins.left;
    const fonts = { fontPath, fontBoldPath };

    // Ensure we have a plain object
    const rawData = projectData.toObject({ flattenMaps: true });

    // FALLBACK: If revenueData is missing (due to previous schema issue), re-calculate it on the fly
    if (!rawData.revenueData || rawData.revenueData.length === 0) {
      rawData.revenueData = calculateRevenue(
        rawData.revenueDetails?.salesRevenue || 0,
        rawData.revenueDetails?.salesType || "monthly",
        rawData.revenueDetails?.yearlyGrowthRate || 0,
        rawData.loanPeriod || 5
      );
    }

    // --- PAGE 1: AT A GLANCE & DETAILS ---
    // Combined section to save pages
    drawPromoterTable(doc, rawData.personalDetails || {}, fonts);
    doc.moveDown(0.5);
    drawBusinessTable(doc, rawData, fonts, leftX);
    doc.addPage();
    doc.moveDown(0.5);
    drawLoanTable(doc, rawData, formatRupees, fonts);

    // --- PAGE 2: SALES & PRODUCTION ---
    doc.addPage();
    drawHeader(doc, "SALES, REVENUE & PRODUCTION", fontBoldPath)
    drawSalesRevenueTable(doc, rawData, formatRupees, fonts);

    // if (rawData.revenueData && rawData.revenueData.length > 0) {
    //   doc.moveDown(1);
    //   doc.font(fontBoldPath).fontSize(12).fillColor("#b91c1c").text("EXPECTED YEARLY REVENUE PROJECTIONS", { underline: true });
    //   doc.moveDown(0.5);
    //   const revRows: TableRow[] = [
    //     [
    //       { text: "YEAR", width: 100, bold: true, color: "#333" },
    //       { text: "ESTIMATED/PROJECTED SALES", width: 300, bold: true, color: "#333", align: "right" }
    //     ],
    //     ...rawData.revenueData.map((r: any) => [
    //       { text: `FY ${r.year || 'N/A'}-${((r.year || 0) + 1) % 100}`, width: 100 },
    //       { text: formatRupees(r.totalRevenue || 0), width: 300, align: "right" }
    //     ])
    //   ];
    //   drawFlexibleTable(doc, revRows, fonts);
    // }

    // --- PAGE 3: PROJECT COST & ASSETS ---
    doc.addPage();
    drawHeader(doc, "PROJECT COST & ASSETS", fontBoldPath)
    drawProjectCostSummary(doc, rawData, formatRupees, toLabel, fonts);
    doc.moveDown(0.5);
    drawMeansOfFinance(doc, rawData.loanDetails, formatRupees, fonts);
    doc.addPage();
    doc.moveDown(0.5);
    drawDepreciationSchedules(doc, rawData.depreciationSchedule || [], formatRupees, fonts, leftX);

    // --- PAGE 4: PROFITABILITY & PERFORMANCE ---
    doc.addPage();
    drawHeader(doc, "PROFITABILITY & PERFORMANCE", fontBoldPath)
    drawProfitabilityStatement(doc, rawData, formatInMillions, fonts);
    doc.moveDown(0.5);
    doc.addPage();
    drawCenteredHeader(doc, "DSCR CALCULATION", fontBoldPath);
    doc.moveDown(0.5);
    drawCalculationOfDSCR(doc, rawData, formatInMillions, fonts);
    doc.moveDown(0.5);
    doc.addPage();
    drawCenteredHeader(doc, "EBITDA ANALYSIS", fontBoldPath);
    doc.moveDown(0.5);
    drawEBIDTAAnalysis(doc, rawData, formatInMillions, fonts);

    // --- PAGE 5: ROI, BEP & INTEREST ---
    doc.addPage();
    drawHeader(doc, "ROI, BEP & INTEREST ANALYSIS", fontBoldPath);
    drawReturnOnInvestment(doc, rawData, formatInMillions, fonts);
    doc.moveDown(0.5);
    doc.addPage();
    drawHeader(doc, "BREAK EVEN SALES", fontBoldPath)
    drawBreakEvenSales(doc, rawData, formatRupees, fonts)
    doc.moveDown(0.5);
    drawCalculationOfInterestOnTermLoan(doc, rawData, formatInMillions, fonts)

    // --- PAGE 6: BANK FINANCE (MPBF) & RATIOS ---
    doc.addPage();
    drawHeader(doc, "BANK FINANCE (MPBF) & RATIOS", fontBoldPath);
    drawComputationOfMPBF(doc, rawData, formatInMillions, fonts);
    doc.moveDown(0.5);
    doc.addPage();
    drawHeader(doc, "CALCULATION OF SOME IMPORTANT RATIOS", fontBoldPath);
    drawImportantRatios(doc, rawData, formatRupees, fonts);

    // --- PAGE 7: SENSITIVITY & BALANCE SHEET ---
    doc.addPage();
    drawHeader(doc, "SENSITIVITY & BALANCE SHEET", fontBoldPath);
    drawSensitivityAnalysis(doc, rawData, formatInMillions, fonts);
    doc.moveDown(0.5);
    doc.addPage();
    drawHeader(doc, "PROJECTED BALANCE SHEET", fontBoldPath);
    drawProjectedBalanceSheet(doc, rawData, formatRupees, fonts);

    // --- PAGE 8: CASH FLOW & POSITION ---
    doc.addPage();
    drawHeader(doc, "CASH FLOW & POSITION", fontBoldPath);
    drawCashFlowStatement(doc, rawData, formatRupees, fonts);
    doc.moveDown(0.5);
    doc.addPage();
    doc.moveDown(0.5);
     drawAFPTable(doc, rawData, formatRupees, fonts);

    // --- PAGE 9: AFP & ASSUMPTIONS ---
    doc.addPage();
    drawHeader(doc, "ASSUMPTIONS", fontBoldPath);
    doc.moveDown(0.5);
    drawAssumptionsTable(doc, rawData, fonts)

    // --- PAGE 10: LOAN REPAYMENT SCHEDULE ---
    doc.addPage();
    drawHeader(doc, "LOAN REPAYMENT SCHEDULE", fontBoldPath)
    drawLoanCalculation(doc, rawData, formatRupees, fonts)

    doc.end();
    const pdfBuffer = await pdfDone;

    const sanitizedName = (projectData.businessName || "Report").replace(/[^a-z0-9]/gi, '_');

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CMA_Report_${sanitizedName}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("PDF_GENERATION_ERROR:", error);
    return NextResponse.json({ message: "PDF Error", details: error.message }, { status: 500 });
  }
}

