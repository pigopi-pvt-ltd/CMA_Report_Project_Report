import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import path from "path"
import { requireAuth } from "@/lib/requireAuth"
import ProjectReportModel from "@/db/models/projectReportModel";
import dbConnect from "@/db/dbConnect"
import { drawLoanCalculation, drawPromoterTable, drawDepreciationSchedules, drawCostStatement, drawLoanTable, drawMeansOfFinance, drawProjectCostSummary, drawBusinessTable, drawSalesRevenueTable, drawPurchaseCostStatement, drawGeneralExpensesTable, drawProfitabilityStatement, drawCalculationOfDSCR, drawSWOTAnalysisPage, drawEBIDTAAnalysis, drawReturnOnInvestment, drawActionPlan, drawTargateMarket, drawBreakEvenSales, drawComputationOfMPBF, drawImportantRatios, drawSensitivityAnalysis, drawProjectedBalanceSheet,drawBreakEvenAnalysis,drawCashFlowStatement,drawFinancialPosition,drawAFPTable,drawFinalAssumption, drawAssumptionsTable, drawLoanInterestTables } from "@/helpers/pdfSections";

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
    drawHeader(doc, "COST STATEMENT", fontBoldPath)
    drawCostStatement(doc, projectData, formatInMillions, fonts);
    //  Purchase Cost Statement
    doc.addPage();
    drawPurchaseCostStatement(doc, projectData, formatInMillions, fonts);

    //General, Administrative & Selling Expenses
    doc.addPage();
    drawHeader(doc, "GENERAL, ADMINISTRATIVE & SELLING EXPENSES", fontBoldPath)
    drawGeneralExpensesTable(doc, projectData, formatInMillions, fonts);


    // 6. Depreciation
    drawDepreciationSchedules(doc, projectData.depreciationSchedule, formatRupees, fonts, leftX);

    // 7. Profitability Statement
    doc.addPage();
    drawHeader(doc, " PROJECT PROFITABILITY STATEMENT", fontBoldPath)
    drawProfitabilityStatement(doc, projectData, formatInMillions, fonts);

    //Calculation Of DSCR
    doc.addPage();
    drawHeader(doc, "CALCULATION OF DEBT SERVICE COVERAGE RATIO (DSCR)", fontBoldPath)
    drawCalculationOfDSCR(doc, projectData, formatInMillions, fonts);

    //SWOT Analysis
    doc.addPage();
    drawHeader(doc, "SWOT ANALYSIS", fontBoldPath)
    drawSWOTAnalysisPage(doc, projectData, fonts);


    //Action Plan
    doc.addPage();
    drawHeader(doc, "ACTION PLAN", fontBoldPath);
    drawActionPlan(doc, projectData, fonts);

    // Market Targate
    doc.addPage();
    drawHeader(doc, "Market Targate", fontBoldPath);
    drawTargateMarket(doc, projectData, fonts)

    // EBIDTA Analysis Page
    doc.addPage();
    drawHeader(doc, "EBIDTA ANALYSIS", fontBoldPath);
    drawEBIDTAAnalysis(doc, projectData, formatRupees, fonts);

    //Return on Investment (ROI) Analysis
    doc.addPage();
    drawHeader(doc, "RETURN ON INVESTMENT (ROI) ANALYSIS", fontBoldPath);
    drawReturnOnInvestment(doc, projectData, formatRupees, fonts);

    //--------- breakEvenAnalysis--------------
    doc.addPage();
    drawHeader(doc, "BREAK EVEN SALSE", fontBoldPath)
    drawBreakEvenSales(doc, projectData, formatRupees, fonts)
    //---------Loan Interest Table Detail-------
    doc.addPage();
    drawHeader(doc, "Loan Interest Table Detail", fontBoldPath)
    drawLoanInterestTables(doc, projectData, formatRupees, fonts)
    //---------Computation of MPBF-------
    doc.addPage();
    drawHeader(doc, "Computation of Maximum Permissible Bank Finance (MPBF)", fontBoldPath);
    drawComputationOfMPBF(doc, projectData, formatRupees, fonts);

    //------------drawImportantRatios----------
    doc.addPage();
    drawHeader(doc, "CALCULATION OF SOME IMPORTANT RATIOS", fontBoldPath);
    drawImportantRatios(doc, projectData, formatRupees, fonts);


    //-------------drawSensitivityAnalysis
    doc.addPage();
    drawHeader(doc, "SENSITIVITY ANALYSIS", fontBoldPath);
    drawSensitivityAnalysis(doc, projectData, formatRupees, fonts);
    //----------------drawProjectedBalanceSheet-------------
    doc.addPage();
    drawHeader(doc, "PROJECTED BALANCE SHEET", fontBoldPath);
    drawProjectedBalanceSheet(doc, projectData, formatRupees, fonts);

    //------------BreakEvenAnalysis------------------
    doc.addPage();
    drawHeader(doc, "BREAK EVEN ANALYSIS", fontBoldPath);
    drawBreakEvenAnalysis(doc, projectData, formatRupees, fonts);

    //--------------drawCashFlowStatement
    doc.addPage();
    drawHeader(doc, "CASH FLOW STATEMENT", fontBoldPath);
    drawCashFlowStatement(doc, projectData, formatRupees, fonts);

    doc.addPage();
    drawHeader(doc,"Financial Position",fontBoldPath);
    drawFinancialPosition(doc,projectData,formatRupees,fonts);
    
    drawHeader(doc,"AFP",fontBoldPath);
    drawAFPTable(doc,projectData,formatRupees, fonts);
  //-------------Final Assumption-------------
    doc.addPage();
    drawHeader(doc, "ASSSUMPTION", fontBoldPath)
    drawFinalAssumption(doc, projectData, formatRupees, fonts)
    //-----------Assumption-----------
    doc.addPage();
    drawHeader(doc, "ASSSUMPTION", fontBoldPath)
    drawAssumptionsTable(doc, projectData, fonts)
    

    //-------------LoanCalculation-------------
    doc.addPage();
    drawHeader(doc, "Loan Calculation", fontBoldPath)
    drawLoanCalculation(doc, projectData, formatRupees, fonts)


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
