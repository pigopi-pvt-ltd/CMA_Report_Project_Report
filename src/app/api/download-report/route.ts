export const runtime = "nodejs"

import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import path from "path"
import { requireAuth } from "@/lib/requireAuth"
import ProjectReportModel from "@/db/models/projectReportModel";
import dbConnect from "@/db/dbConnect"

// --- NEW FLEXIBLE TABLE TYPES & FUNCTION ---
type TableCell = {
  text: string | number | boolean;
  color?: string;
  width?: number;
  align?: "left" | "center" | "right";
};
type TableRow = TableCell[];

function drawFlexibleTable(
  doc: PDFKit.PDFDocument,
  rows: TableRow[],
  options?: { title?: string; fontSize?: number; rowHeight?: number }
) {
  const startX = 20;
  const rowHeight = options?.rowHeight || 25;
  const fontSize = options?.fontSize || 10;

  if (options?.title) {
    doc.fontSize(16).fillColor("#000000").text(options.title);
    doc.moveDown(0.5);
  }

  rows.forEach((row) => {
    let currentX = startX;
    const y = doc.y;

    // Page break check
    if (y + rowHeight > doc.page.height - 50) {
      doc.addPage();
    }

    row.forEach((cell) => {
      const colWidth = cell.width || 100;
      const displayValue = typeof cell.text === "boolean" ? (cell.text ? "Yes" : "No") : String(cell.text ?? "-");

      doc.strokeColor("#000000").lineWidth(0.5).rect(currentX, y, colWidth, rowHeight).stroke();
      doc.fillColor(cell.color || "#333333").fontSize(fontSize);
      doc.text(displayValue, currentX + 8, y + 7, { width: colWidth - 16, align: cell.align || "left" });

      currentX += colWidth;
    });
    doc.y = y + rowHeight;
  });
  doc.moveDown(0.5);
}

// Helper to convert camelCase to Title Case labels
const toLabel = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const formatRupees = (value: number) => `₹ ${value.toLocaleString("en-IN")}`;

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request)
    await dbConnect()

    const { projectId } = await request.json()
    if (!projectId) return NextResponse.json({ message: "Id required" }, { status: 400 });

    const projectData = await ProjectReportModel.findOne({ userId: session.user.id, _id: projectId });
    if (!projectData) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const fontPath = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
    const doc = new PDFDocument({ size: "A4", margin: 20, font: fontPath });
    const buffers: Buffer[] = [];
    doc.on("data", (b) => buffers.push(b));
    const pdfDone = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
    });

    // --- Header ---
    doc.fontSize(22).fillColor("#4154F1").text("PROJECT REPORT", { align: "center" });
    doc.moveDown(0.5);
    const y = doc.y
    const leftX = doc.page.margins.left;
    const rightX = doc.page.width - doc.page.margins.right;

    doc
      .strokeColor("#4154F1")
      .lineWidth(2)
      .moveTo(leftX, y)
      .lineTo(rightX, y)
      .stroke();
    doc.fillColor("#000000").moveDown(0.5);

    // --- Section 1: Promoter Details ---
    const pDetails = projectData.personalDetails;
    const promoterRows: TableRow[] = [
      [{ text: "Full Name", width: 250 }, { text: pDetails.fullName, width: 300 }],
      [{ text: "Email", width: 250 }, { text: pDetails.email, width: 300 }],
      [{ text: "Address", width: 250 }, { text: pDetails.personalAddress, width: 300 }],
      [{ text: "Designation", width: 250 }, { text: "N/A", width: 300 }],
      [{ text: "Mobile", width: 250 }, { text: pDetails.mobile, width: 300 }],
      [{ text: "Category", width: 250 }, { text: pDetails.category.toUpperCase(), width: 300 }],
      [{ text: "Education", width: 250 }, { text: pDetails.educationQualification, width: 300 }],
      [{ text: "Experience", width: 250 }, { text: pDetails.workExperience, width: 300 }],
      [{ text: "Gender", width: 250 }, { text: pDetails.gender, width: 300 }],
    ];
    drawFlexibleTable(doc, promoterRows, { title: "PROMOTER'S DETAILS" });

    doc.x = doc.page.margins.left;

    // --- Section 2: Business Details ---
    const bDetails = projectData.businessDetails;
    const businessRows: TableRow[] = [
      [{ text: "Business Name", width: 250 }, { text: bDetails.businessName, width: 300 }],
      [{ text: "Business Type", width: 250 }, { text: projectData.businessType, width: 300 }],
      [{ text: "Business Industry", width: 250 }, { text: projectData.industryType, width: 300 }],
      [{ text: "Constitution", width: 250 }, { text: bDetails.legalConstitution, width: 300 }],
      [{ text: "Industry", width: 250 }, { text: projectData.industryType, width: 300 }],
      [{ text: "Employment Potential", width: 250 }, { text: bDetails.employmentPotential, width: 300 }],
      [{ text: "Contact Number", width: 250 }, { text: pDetails.businessMobile, width: 300 }],
      [{ text: "Business Start Date", width: 250 }, { text: bDetails.businessStartDate, width: 300 }]
    ];
    drawFlexibleTable(doc, businessRows, { title: "BUSINESS DETAILS" });

    // --- Section 3: Loan Details (Page 2) ---
    doc.addPage();
    const lDetails = projectData.loanDetails;
    const loanRows: TableRow[] = [
      [{ text: "Fixed Capital To Be Invested", width: 250 }, { text: formatRupees(lDetails.fixedCapitalInvested), width: 300 }],
      [{ text: "Working Capital To Be Invested", width: 250 }, { text: formatRupees(lDetails.workingCapitalInvested), width: 300 }],
      [{ text: "Total Project Cost", width: 250 }, { text: formatRupees(lDetails.totalProjectCost), width: 300 }],
      [{ text: "Term Loan", width: 250 }, { text: formatRupees(lDetails.termLoan), width: 300 }],
      [{ text: "Working Capital Loan", width: 250 }, { text: formatRupees(lDetails.workingCapitalLoan), width: 300 }],
      [{ text: "Total Loan Amount", width: 250 }, { text: formatRupees(lDetails.totalLoanAmountNeeded), width: 300 }],
      [{ text: "Loan Period", width: 250 }, { text: `${projectData.loanPeriod} Years`, width: 300 }],
      [{ text: "Type  Loan Needed", width: 250 }, { text: formatRupees(projectData.loanType), width: 300 }],
      [{ text: "Average DSCR", width: 250 }, { text: "1.65", width: 300 }],
    ];
    drawFlexibleTable(doc, loanRows, { title: "LOAN DETAILS" });

    doc.addPage();
    // --- Header ---
    doc.fontSize(22).fillColor("#4154F1").text("PROJECT COST", { align: "center" });
    doc.moveDown(0.5);
    doc.strokeColor("#4154F1").lineWidth(2).moveTo(leftX, doc.y).lineTo(rightX, doc.y).stroke();
    doc.fillColor("#000000").moveDown(1);

    const projectCostRows: TableRow[] = [
      [
        { text: "SUMMARY OF PROJECT COST", width: 230, color: "#b91c1c", align: "center" },
        { text: "", width: 40 },
        { text: "Amount(Rs.)", width: 280, color: "#b91c1c", align: "center" }
      ]
    ];

    // Map through the keys we want to show from Business Requirements
    const reqKeys = ["machinery", "land", "building", "computersAndAccessories", "furnituresAndFixtures", "vehicle", "softwareWebsiteAndApp", "liveStockFarmAnimals", "otherFixedExpenses"];

    reqKeys.forEach((key) => {
      const val = (projectData.businessRequirements as any).get(key) || 0;
      projectCostRows.push([
        { text: toLabel(key), width: 230 },
        { text: ":", width: 40, align: "center" },
        { text: formatRupees(val), width: 280 }
      ]);
    });

    // Map through Monthly Expenses (Working Capital)
    const expKeys = ["consumablesStocks", "rawMaterials", "workingExpenses"];
    expKeys.forEach((key) => {
      // Logic check: if using custom keys or standard map
      const val = (projectData.monthlyExpenses as any).get(key) || (projectData as any)[key] || 0;
      projectCostRows.push([
        { text: toLabel(key), width: 230 },
        { text: ":", width: 40, align: "center" },
        { text: formatRupees(val), width: 280 }
      ]);
    });
    drawFlexibleTable(doc, projectCostRows);

    doc.moveDown(1.5)
    // Final Summary Block(The bottom part of your image)
    // projectCostRows.push([{ text: "", width: 550, rowHeight: 15 } as any]); // Spacer

    const totalCost: TableRow[] = []

    totalCost.push([
      { text: "Fixed capital cost", width: 230 },
      { text: ":", width: 40, align: "center" },
      { text: formatRupees(projectData.loanDetails.fixedCapitalInvested), width: 280 }
    ]);
    totalCost.push([
      { text: "Working capital", width: 230 },
      { text: ":", width: 40, align: "center" },
      { text: formatRupees(projectData.loanDetails.workingCapitalInvested), width: 280 }
    ]);
    totalCost.push([
      { text: "Total", width: 230 },
      { text: ":", width: 40, align: "center" },
      { text: formatRupees(projectData.loanDetails.totalProjectCost), width: 280, color: "#000" } // Bold simulated by color
    ]);


    drawFlexibleTable(doc, totalCost);
    doc.moveDown(1.5)

    const meansOfFinance: TableRow[] = [
      [{ text: "MEANS OF FINANCE", color: "#b91c1c", width: 550, align: "center" }],
      [{ text: "BANK LOAN", color: "#b91c1c", width: 190 }, { text: "SHARE", color: "#b91c1c", width: 80 }, { text: "INTEREST RATE(%)", color: "#b91c1c", width: 140 }, { text: "AMOUNT", color: "#b91c1c", width: 140 }],
      [{ text: "TERM LOAN FINANCE", color: "#000", width: 190 }, { text: "54.00%", width: 80 }, { text: "11.10", width: 140 }, { text: lDetails.termLoan, width: 140 }],
      [{ text: "WORKING CAPITAL FINANCE", color: "#000", width: 190 }, { text: "36.00%", width: 80 }, { text: "11.10", width: 140 }, { text: lDetails.workingCapitalLoan, width: 140 }],
      [{ text: "PROMOTERS CONTRIBUTION", color: "#000", width: 190 }, { text: "10.00%", width: 80 }, { text: "NIL", width: 140 }, { text: lDetails.promotersContribution, width: 140 }],
      [{ text: "TOTAL", color: "#000", width: 190 }, { text: "100.00%", width: 80 }, { text: "", width: 140 }, { text: lDetails.totalProjectCost, width: 140 }],
    ];
    drawFlexibleTable(doc, meansOfFinance);

    // --- Section 4: Cost Statement (Projection Table) ---
    doc.addPage();
    doc.fontSize(16).fillColor("#000000").text("YEARLY COST STATEMENT (24% GROWTH RATE)");
    doc.moveDown(0.5);

    const costRows: TableRow[] = [
      // Header with 3 columns
      [
        { text: "Year", width: 100 },
        { text: "Domestic Sales", width: 225 },
        { text: "Gross Income", width: 225 }
      ]
    ];

    // Populate from the costStatement array generated in your DB
    projectData.costStatement.forEach((item: any) => {
      costRows.push([
        { text: item.year, width: 100 },
        { text: formatRupees(item.domesticSales), width: 225, color: "#16a34a" },
        { text: formatRupees(item.totalGrossIncome), width: 225 }
      ]);
    });

    drawFlexibleTable(doc, costRows);

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
