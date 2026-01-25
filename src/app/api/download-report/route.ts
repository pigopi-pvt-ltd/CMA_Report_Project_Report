export const runtime = "nodejs"

import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import path from "path"
import { businessRequirementsKeyEnum } from "@/Schemas/projectReportSchema"

// 🔹 MOCK DATA (replace later with real request data)
const reportData = {
  legalBusinessName: "ABC Enterprises",
  businessType: "Manufacturing",
  selectYourIndustry: "manufacturing",
  loanType: "mudra",
  machinery: true,
  nameOfTheProductServices: "Industrial Machine Parts",
  salesType: "salesBasedOnMonthlyBasis",
  monthlySalesRevenue: "₹5,00,000",
  loanPeriodYears: "5",
  fullName: "Anik Rawat",
  emailAddress: "anik@example.com",
  mobileNumber: "9876543210",
  businessMobile: "9876543211",
  personalAddress: "Dehradun, Uttarakhand",
  businessAddress: "Industrial Area, Dehradun",
  gender: "male",
  category: "general",
  educationQualification: "graduate",
  workExperience: "23Years",
  nameOfBusinessFirm: "ABC Enterprises Pvt Ltd",
  legalConstitution: "privateLtd",
  employmentPotential: "5To10",
  whenDidYouStartTheBusiness: "612MonthsAgo",
}


type FixedCapitalKey = typeof FIXED_CAPITAL_KEYS[number]

function isFixedCapitalKey(key: string): key is FixedCapitalKey {
  return FIXED_CAPITAL_KEYS.includes(key as FixedCapitalKey)
}



const FIXED_CAPITAL_KEYS = [
  "machinery",
  "land",
  "building",
  "computersAndAccessories",
  "furnituresAndFixtures",
  "vehicle",
  "softwareWebsiteAndApp",
  "liveStockFarmAnimals",
  "otherFixedExpenses",
  "consumablesStocks",
  "rawMaterials",
  "workingExpenses",
] as const

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const additionalDetails = {


      fixedCapital: Object.entries(data.data).reduce(
        (total, [key, value]) => {
          if (
            isFixedCapitalKey(key) &&
            value === true
          ) {
            return total + 10_000
          }
          return total
        },
        0
      )

    }

    console.log(additionalDetails)
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

    // --- TITLE ---
    doc.fontSize(20).text("Business Loan Application Report", { align: "center" });
    doc.moveDown(1.5);

    // --- TABLE CONFIGURATION ---
    const startX = 50;
    const col1Width = 220;
    const col2Width = 270;
    const rowHeight = 25;
    const tableWidth = col1Width + col2Width;

    // Helper for Table Headers
    const drawTableHeader = () => {
      doc.fillColor("#eeeeee")
        .rect(startX, doc.y, tableWidth, rowHeight)
        .fill();

      doc.fillColor("#000000").fontSize(11);
      doc.text("Field Description", startX + 10, doc.y + 7, { width: col1Width });
      doc.text("Details", startX + col1Width + 10, doc.y - 12, { width: col2Width });

      doc.moveTo(startX, doc.y + 13).lineTo(startX + tableWidth, doc.y + 13).stroke();
    };

    drawTableHeader();

    // Iterate through data
    Object.entries(data.data).forEach(([key, value], index) => {
      // Check for page overflow
      if (doc.y + rowHeight > 750) {
        doc.addPage();
        drawTableHeader();
      }

      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());

      const displayValue = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);

      const currentY = doc.y;

      // Draw Zebra Stripes
      if (index % 2 === 0) {
        doc.fillColor("#f9f9f9").rect(startX, currentY, tableWidth, rowHeight).fill();
      }

      // Draw Cell Text
      doc.fillColor("#333333").fontSize(10);
      doc.text(label, startX + 10, currentY + 7, { width: col1Width - 20 });
      doc.text(displayValue, startX + col1Width + 10, currentY + 7, { width: col2Width - 20 });

      // Draw Horizontal Line
      doc.strokeColor("#dddddd")
        .moveTo(startX, currentY + rowHeight)
        .lineTo(startX + tableWidth, currentY + rowHeight)
        .stroke();

      doc.y = currentY + rowHeight;
    });

    // Draw Vertical Borders
    const tableBottom = doc.y;
    doc.strokeColor("#000000")
      .rect(startX, 110, tableWidth, tableBottom - 110) // Adjustment for header start
      .stroke();

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
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
