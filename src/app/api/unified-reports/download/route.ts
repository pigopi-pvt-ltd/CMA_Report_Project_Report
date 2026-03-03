import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import { requireAuth } from "@/lib/requireAuth";
import CmaReport from "@/db/models/cmaReportModel";
import ProjectReportModel from "@/db/models/projectReportModel";
import dbConnect from "@/db/dbConnect";
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
  drawCostStatement,
  drawSWOTAnalysisPage,
  drawActionPlan,
  drawTargateMarket,
  drawLoanInterestTables as drawLoanInterestTablesOriginal
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
    const session = await requireAuth(request);
    await dbConnect();

    const { projectId, reportType } = await request.json();
    if (!projectId) return NextResponse.json({ message: "Id required" }, { status: 400 });
    if (!reportType) return NextResponse.json({ message: "Report type required (cma or project)" }, { status: 400 });

    let reportData;
    let reportTypeName;
    let rawData: any;

    if (reportType === 'cma') {
      reportData = await CmaReport.findOne({ userId: session.user.id, _id: projectId });
      reportTypeName = 'CMA';
    } else if (reportType === 'project') {
      reportData = await ProjectReportModel.findOne({ userId: session.user.id, _id: projectId });
      reportTypeName = 'Project';
    } else {
      return NextResponse.json({ message: "Invalid report type. Use 'cma' or 'project'" }, { status: 400 });
    }

    if (!reportData) return NextResponse.json({ message: "Not found" }, { status: 404 });

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

    // Ensure we have a plain object
    rawData = reportData.toObject({ flattenMaps: true });

    // Check if we have all the required calculated data
    const requiredFields = [
      'revenueData', 'profitabilityStatement', 'costStatement', 'depreciationSchedule',
      'dscrStatement', 'loanCalculation', 'projectedBalanceSheet', 'projectedCashFlow'
    ];
    
    const missingFields = requiredFields.filter(field => 
      !rawData[field] || (Array.isArray(rawData[field]) && rawData[field].length === 0)
    );

    // If any critical calculated data is missing, re-calculate everything
    if (missingFields.length > 0) {
      console.log(`Missing fields in CMA report: ${missingFields.join(', ')}. Re-calculating...`);
      
      try {
        // Import the calculation service dynamically
        const { generateProjectReport } = await import("@/lib/services/report-calculation.service");
        const calculatedData = await generateProjectReport(rawData);
        
        // Merge the calculated data
        rawData = {
          ...rawData,
          ...calculatedData
        };
        
        console.log('Successfully recalculated missing CMA data');
      } catch (calcError) {
        console.error('Failed to recalculate CMA data:', calcError);
        // Continue with whatever data we have
      }
    }

    const leftX = doc.page.margins.left;
    const fonts = { fontPath, fontBoldPath };

    if (reportType === 'cma') {
      // CMA Report PDF generation
      drawHeader(doc, "CMA REPORT AT A GLANCE", fontBoldPath);

      // --- PAGE 1: AT A GLANCE & DETAILS ---
      drawPromoterTable(doc, rawData.personalDetails || {}, fonts);
      doc.moveDown(0.5);
      drawBusinessTable(doc, rawData, fonts, leftX);
      doc.addPage();
      doc.moveDown(0.5);
      drawLoanTable(doc, rawData, formatRupees, fonts);

      // --- PAGE 2: SALES & PRODUCTION ---
      doc.addPage();
      drawHeader(doc, "SALES, REVENUE & PRODUCTION", fontBoldPath);
      drawSalesRevenueTable(doc, rawData, formatRupees, fonts);

      // --- PAGE 3: PROJECT COST & ASSETS ---
      doc.addPage();
      drawHeader(doc, "PROJECT COST & ASSETS", fontBoldPath);
      drawProjectCostSummary(doc, rawData, formatRupees, toLabel, fonts);
      doc.moveDown(0.5);
      drawMeansOfFinance(doc, rawData.loanDetails, formatRupees, fonts);
      doc.addPage();
      doc.moveDown(0.5);
      drawDepreciationSchedules(doc, rawData.depreciationSchedule || [], formatRupees, fonts, leftX);

      // --- PAGE 4: PROFITABILITY & PERFORMANCE ---
      doc.addPage();
      drawHeader(doc, "PROFITABILITY & PERFORMANCE", fontBoldPath);
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
      drawHeader(doc, "BREAK EVEN SALES", fontBoldPath);
      drawBreakEvenSales(doc, rawData, formatRupees, fonts);
      doc.moveDown(0.5);
      drawCalculationOfInterestOnTermLoan(doc, rawData, formatInMillions, fonts);

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
      drawAssumptionsTable(doc, rawData, fonts);

      // --- PAGE 10: LOAN REPAYMENT SCHEDULE ---
      doc.addPage();
      drawHeader(doc, "LOAN REPAYMENT SCHEDULE", fontBoldPath);
      drawLoanCalculation(doc, rawData, formatRupees, fonts);
    } else {
      // Project Report PDF generation
      drawHeader(doc, "PROJECT AT A GLANCE", fontBoldPath);

      // 1. Promoter
      drawPromoterTable(doc, rawData.personalDetails, fonts);
      doc.moveDown(1);

      // 2. Business
      drawBusinessTable(doc, rawData, fonts, leftX);

      // 3. Loan (New Page)
      doc.addPage();
      drawLoanTable(doc, rawData, formatRupees, fonts);

      // Sales and Revenue Table
      doc.addPage();
      drawSalesRevenueTable(doc, rawData, formatRupees, fonts);
      doc.moveDown(2);

      // 4. Project Cost
      doc.addPage();
      drawHeader(doc, "PROJECT COST", fontBoldPath);
      drawProjectCostSummary(doc, rawData, formatRupees, toLabel, fonts);
      doc.moveDown(1);
      drawMeansOfFinance(doc, rawData.loanDetails, formatRupees, fonts);

      // 5. cost statement Table
      doc.addPage();
      drawHeader(doc, "COST STATEMENT", fontBoldPath);
      drawCostStatement(doc, rawData, formatRupees, fonts);
      //  Purchase Cost Statement
      doc.addPage();
      drawPurchaseCostStatement(doc, rawData, formatInMillions, fonts);

      //General, Administrative & Selling Expenses
      doc.addPage();
      drawHeader(doc, "GENERAL, ADMINISTRATIVE & SELLING EXPENSES", fontBoldPath);
      drawGeneralExpensesTable(doc, rawData, formatInMillions, fonts);

      // 6. Depreciation
      drawDepreciationSchedules(doc, rawData.depreciationSchedule, formatRupees, fonts, leftX);

      // 7. Profitability Statement
      doc.addPage();
      drawHeader(doc, " PROJECT PROFITABILITY STATEMENT", fontBoldPath);
      drawProfitabilityStatement(doc, rawData, formatInMillions, fonts);

      //Calculation Of DSCR
      doc.addPage();
      drawHeader(doc, "CALCULATION OF DEBT SERVICE COVERAGE RATIO (DSCR)", fontBoldPath);
      drawCalculationOfDSCR(doc, rawData, formatInMillions, fonts);

      //SWOT Analysis
      doc.addPage();
      drawHeader(doc, "SWOT ANALYSIS", fontBoldPath);
      drawSWOTAnalysisPage(doc, rawData, fonts);

      //Action Plan
      doc.addPage();
      drawHeader(doc, "ACTION PLAN", fontBoldPath);
      drawActionPlan(doc, rawData, fonts);

      // Market Targate
      doc.addPage();
      drawHeader(doc, "Market Targate", fontBoldPath);
      drawTargateMarket(doc, rawData, fonts);

      // EBIDTA Analysis Page
      doc.addPage();
      drawHeader(doc, "EBIDTA ANALYSIS", fontBoldPath);
      drawEBIDTAAnalysis(doc, rawData, formatInMillions, fonts);

      //Return on Investment (ROI) Analysis
      doc.addPage();
      drawHeader(doc, "RETURN ON INVESTMENT (ROI) ANALYSIS", fontBoldPath);
      drawReturnOnInvestment(doc, rawData, formatRupees, fonts);

      //--------- breakEvenAnalysis--------------
      doc.addPage();
      drawHeader(doc, "BREAK EVEN SALES", fontBoldPath);
      drawBreakEvenSales(doc, rawData, formatRupees, fonts);
      //---------Loan Interest Table Detail-------
      doc.addPage();
      drawHeader(doc, "Loan Interest Table Detail", fontBoldPath);
      drawLoanInterestTablesOriginal(doc, rawData, formatRupees, fonts);
      //---------Computation of MPBF-------
      doc.addPage();
      drawHeader(doc, "Computation of Maximum Permissible Bank Finance (MPBF)", fontBoldPath);
      drawComputationOfMPBF(doc, rawData, formatRupees, fonts);

      //------------drawImportantRatios----------
      doc.addPage();
      drawHeader(doc, "CALCULATION OF SOME IMPORTANT RATIOS", fontBoldPath);
      drawImportantRatios(doc, rawData, formatRupees, fonts);

      //-------------drawSensitivityAnalysis
      doc.addPage();
      drawHeader(doc, "SENSITIVITY ANALYSIS", fontBoldPath);
      drawSensitivityAnalysis(doc, rawData, formatRupees, fonts);
      //----------------drawProjectedBalanceSheet-------------
      doc.addPage();
      drawHeader(doc, "PROJECTED BALANCE SHEET", fontBoldPath);
      drawProjectedBalanceSheet(doc, rawData, formatRupees, fonts);

      //------------BreakEvenAnalysis------------------
      doc.addPage();
      drawHeader(doc, "BREAK EVEN ANALYSIS", fontBoldPath);
      drawBreakEvenAnalysis(doc, rawData, formatRupees, fonts);

      //--------------drawCashFlowStatement
      doc.addPage();
      drawHeader(doc, "CASH FLOW STATEMENT", fontBoldPath);
      drawCashFlowStatement(doc, rawData, formatRupees, fonts);

      doc.addPage();
      drawHeader(doc, "Financial Position", fontBoldPath);
      drawFinancialPosition(doc, rawData, formatRupees, fonts);
      doc.x = leftX;
      drawHeader(doc, "AFP", fontBoldPath);
      drawAFPTable(doc, rawData, formatRupees, fonts);
      //-------------Final Assumption-------------
      doc.addPage();
      drawHeader(doc, "ASSSUMPTION", fontBoldPath);
      drawFinalAssumption(doc, rawData, formatRupees, fonts, leftX);
      //-----------Assumption-----------
      doc.addPage();
      drawHeader(doc, "ASSSUMPTION", fontBoldPath);
      drawAssumptionsTable(doc, rawData, fonts);

      //-------------LoanCalculation-------------
      doc.addPage();
      drawHeader(doc, "Loan Calculation", fontBoldPath);
      drawLoanCalculation(doc, rawData, formatRupees, fonts);
    }

    doc.end();
    const pdfBuffer = await pdfDone;

    const sanitizedName = (reportData.businessName || "Report").replace(/[^a-z0-9]/gi, '_');

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportTypeName}_Report_${sanitizedName}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("PDF_GENERATION_ERROR:", error);
    return NextResponse.json({ message: "PDF Error", details: error.message }, { status: 500 });
  }
}