import { drawFlexibleTable, TableRow } from "@/helpers/pdfTable";

/**
 * SECTION 1: PROMOTER DETAILS
 */
export const drawPromoterTable = (doc: any, data: any, fonts: any) => {
  const rows: TableRow[] = [
    [{ text: "Full Name", width: 250, bold: true }, { text: data.fullName, width: 300 }],
    [{ text: "Email", width: 250, bold: true }, { text: data.email, width: 300 }],
    [{ text: "Address", width: 250, bold: true }, { text: data.personalAddress, width: 300 }],
    [{ text: "Designation", width: 250, bold: true }, { text: "N/A", width: 300 }],
    [{ text: "Mobile", width: 250, bold: true }, { text: data.mobile, width: 300 }],
    [{ text: "Category", width: 250, bold: true }, { text: data.category.toUpperCase(), width: 300 }],
    [{ text: "Education", width: 250, bold: true }, { text: data.educationQualification, width: 300 }],
    [{ text: "Experience", width: 250, bold: true }, { text: data.workExperience, width: 300 }],
    [{ text: "Gender", width: 250, bold: true }, { text: data.gender, width: 300 }],
  ];
  drawFlexibleTable(doc, rows, { title: "PROMOTER'S DETAILS", ...fonts });
};

/**
 * SECTION 2: BUSINESS DETAILS
 */
export const drawBusinessTable = (doc: any, projectData: any, fonts: any, leftX: any) => {
  const bDetails = projectData.businessDetails;
  const pDetails = projectData.personalDetails;
  const rows: TableRow[] = [
    [{ text: "Business Name", width: 250, bold: true }, { text: bDetails.businessName, width: 300 }],
    [{ text: "Business Type", width: 250, bold: true }, { text: projectData.businessType, width: 300 }],
    [{ text: "Business Industry", width: 250, bold: true }, { text: projectData.industryType, width: 300 }],
    [{ text: "Constitution", width: 250, bold: true }, { text: bDetails.legalConstitution, width: 300 }],
    [{ text: "Employment Potential", width: 250, bold: true }, { text: bDetails.employmentPotential, width: 300 }],
    [{ text: "Contact Number", width: 250, bold: true }, { text: pDetails.businessMobile, width: 300 }],
    [{ text: "Business Start Date", width: 250, bold: true }, { text: bDetails.businessStartDate, width: 300 }]
  ];
  doc.x = leftX
  drawFlexibleTable(doc, rows, { title: "BUSINESS DETAILS", ...fonts });
};

/**
 * SECTION 3: LOAN DETAILS
 */
export const drawLoanTable = (doc: any, projectData: any, formatRupees: Function, fonts: any) => {
  const lDetails = projectData.loanDetails;
  const rows: TableRow[] = [
    [{ text: "Fixed Capital To Be Invested", width: 250, bold: true }, { text: formatRupees(lDetails.fixedCapitalInvested), width: 300 }],
    [{ text: "Working Capital To Be Invested", width: 250, bold: true }, { text: formatRupees(lDetails.workingCapitalInvested), width: 300 }],
    [{ text: "Total Project Cost", width: 250, bold: true }, { text: formatRupees(lDetails.totalProjectCost), width: 300 }],
    [{ text: "Term Loan", width: 250, bold: true }, { text: formatRupees(lDetails.termLoan), width: 300 }],
    [{ text: "Working Capital Loan", width: 250, bold: true }, { text: formatRupees(lDetails.workingCapitalLoan), width: 300 }],
    [{ text: "Total Loan Amount", width: 250, bold: true }, { text: formatRupees(lDetails.totalLoanAmountNeeded), width: 300 }],
    [{ text: "Loan Period", width: 250, bold: true }, { text: `${projectData.loanPeriod} Years`, width: 300 }],
    [{ text: "Type Loan Needed", width: 250, bold: true }, { text: projectData.loanType, width: 300 }],
    [{ text: "Average DSCR", width: 250, bold: true }, { text: "1.65", width: 300 }],
  ];
  drawFlexibleTable(doc, rows, { title: "LOAN DETAILS", ...fonts });
};

/**
 * SECTION: SALES AND REVENUE BREAKDOWN
 */
/**
 * SECTION: SALES & REVENUE (As per Screenshot)
 */
export const drawSalesRevenueTable = (doc: any, projectData: any, formatRupees: Function, fonts: any) => {

  const data = projectData.revenueDetails
  const { fontBoldPath } = fonts;
  const leftX = doc.page.margins.left;
  const rightX = doc.page.width - doc.page.margins.right;

  // --- 1. Header Section ---
  doc.fontSize(18)
    .fillColor("#4154F1")
    .font(fontBoldPath)
    .text("SALES & REVENUE", { align: "center" });

  doc.moveDown(0.2);
  const lineY = doc.y;
  doc.strokeColor("#4154F1")
    .lineWidth(1.5)
    .moveTo(leftX, lineY)
    .lineTo(rightX, lineY)
    .stroke();

  doc.moveDown(1.5);

  // --- 2. Table Construction ---
  const tableRows: TableRow[] = [
    // Product Name Row
    [
      { text: "Name of the Product/Services ?", width: 230, bold: true },
      { text: ":", width: 30, align: 'center' }, // Small empty spacer column
      { text: data.productName, width: 290 }
    ],
  ]
  drawFlexibleTable(doc, tableRows, {
    ...fonts,
    padding: 8,
    borderWidth: 0.5,
    borderColor: "#000000"
  });

  doc.moveDown(1.5)

  // Spacer Row
  // Monthly Basis Header Row
  const salesTable: TableRow[] = [
    [
      {
        text: `Sales Based on ${data.salesType.charAt(0).toUpperCase() + data.salesType.slice(1)
          } Basis`,
        width: 230,
        color: "#b91c1c",
        bold: true
      },
      { text: "", width: 30 },
      { text: "", width: 290 }
    ],
    // Value Row
    [
      {
        text: data.salesType === "monthly" ? "Monthly sales" : "Unit sales", width: 230
      },
      { text: ":", width: 30, align: "center" },
      { text: formatRupees(data.salesRevenue), width: 290 }
    ],
    // Currency Row
    [
      { text: "Currency", width: 230 },
      { text: ":", width: 30, align: "center" },
      { text: "₹", width: 290 }
    ],
  ]
  drawFlexibleTable(doc, salesTable, {
    ...fonts,
    padding: 8,
    borderWidth: 0.5,
    borderColor: "#000000"
  });

  doc.moveDown(1.5)

  // Spacer Row
  // Total Row
  const totalRow: TableRow[] = [
    [
      { text: "Total", width: 230, color: "#b91c1c", bold: true },
      { text: ":", width: 30, align: "center", bold: true },
      {
        text: formatRupees(data.totalSalesRevenueAnually), width: 290, color: "#b91c1c", bold: true
      }
    ]
  ]

  drawFlexibleTable(doc, totalRow, {
    ...fonts,
    padding: 8,
    borderWidth: 0.5,
    borderColor: "#000000"
  });



};
/**
 * SECTION 4: PROJECT COST SUMMARY
 */
export const drawProjectCostSummary = (doc: any, projectData: any, formatRupees: Function, toLabel: Function, fonts: any) => {
  const projectCostRows: TableRow[] = [
    [
      { text: "SUMMARY OF PROJECT COST", width: 230, color: "#b91c1c", align: "center", bold: true },
      { text: "", width: 40 },
      { text: "Amount(Rs.)", width: 280, color: "#b91c1c", align: "center", bold: true }
    ]
  ];

  const reqKeys = ["machinery", "land", "building", "computersAndAccessories", "furnituresAndFixtures", "vehicle", "softwareWebsiteAndApp", "liveStockFarmAnimals", "otherFixedExpenses", "consumablesStocks", "rawMaterials", "workingExpenses"];

  reqKeys.forEach((key) => {
    const val = (projectData.businessRequirements as any).get(key) || 0;
    projectCostRows.push([
      { text: toLabel(key), width: 230 },
      { text: ":", width: 40, align: "center" },
      { text: formatRupees(val), width: 280 }
    ]);
  });

  drawFlexibleTable(doc, projectCostRows, fonts);
  doc.moveDown(1)

  // Final Total Block
  const totalCost: TableRow[] = [
    [{ text: "Fixed capital cost", width: 230 }, { text: ":", width: 40, align: "center" }, { text: formatRupees(projectData.loanDetails.fixedCapitalInvested), width: 280 }],
    [{ text: "Working capital", width: 230 }, { text: ":", width: 40, align: "center" }, { text: formatRupees(projectData.loanDetails.workingCapitalInvested), width: 280 }],
    [{ text: "Total", width: 230, bold: true }, { text: ":", width: 40, align: "center", bold: true }, { text: formatRupees(projectData.loanDetails.totalProjectCost), width: 280, bold: true }]
  ];
  drawFlexibleTable(doc, totalCost, fonts);
};

/**
 * SECTION 5: MEANS OF FINANCE
 */
export const drawMeansOfFinance = (doc: any, lDetails: any, formatRupees: Function, fonts: any) => {
  const rows: TableRow[] = [
    [{ text: "MEANS OF FINANCE", color: "#b91c1c", width: 550, align: "center", bold: true }],
    [{ text: "BANK LOAN", color: "#b91c1c", width: 190, bold: true }, { text: "SHARE", color: "#b91c1c", width: 80, bold: true }, { text: "INTEREST RATE(%)", color: "#b91c1c", width: 140, bold: true }, { text: "AMOUNT", color: "#b91c1c", width: 140, bold: true }],
    [{ text: "TERM LOAN FINANCE", width: 190 }, { text: "54.00%", width: 80 }, { text: "11.10", width: 140 }, { text: formatRupees(lDetails.termLoan), width: 140 }],
    [{ text: "WORKING CAPITAL FINANCE", width: 190 }, { text: "36.00%", width: 80 }, { text: "11.10", width: 140 }, { text: formatRupees(lDetails.workingCapitalLoan), width: 140 }],
    [{ text: "PROMOTERS CONTRIBUTION", width: 190 }, { text: "10.00%", width: 80 }, { text: "NIL", width: 140 }, { text: formatRupees(lDetails.promotersContribution), width: 140 }],
    [{ text: "TOTAL", width: 190, bold: true }, { text: "100.00%", width: 80, bold: true }, { text: "", width: 140 }, { text: formatRupees(lDetails.totalProjectCost), width: 140, bold: true }],
  ];
  drawFlexibleTable(doc, rows, fonts);
};

/**
 * SECTION 6: INCOME TABLE (Projected)
 */

export const drawCostStatement = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const years = projectData.costStatement;
  const srWidth = 30;
  const particularsWidth = 100;
  const dataWidth = 550 - (particularsWidth + srWidth);
  const loanPeriod = projectData.loanPeriod;
  const dynamicFontSize = loanPeriod > 7 ? 7 : 8;

  const incomeTableRows: TableRow[] = [
    // Row 1: Headers
    [
      { text: "Sr No", width: srWidth, color: "#b91c1c", bold: true, fontSize: dynamicFontSize },
      { text: "Particulars", width: particularsWidth, color: "#b91c1c", bold: true, fontSize: dynamicFontSize },
      ...years.map((y: any) => {
        const startYear = y.year || 0;
        const endYearShort = (startYear + 1) % 100;
        const endYearFormatted = String(endYearShort).padStart(2, '0');
        return {
          text: `PROJECTED FY ${startYear} -${endYearFormatted} `,
          width: dataWidth / loanPeriod,
          color: "#b91c1c",
          fontSize: dynamicFontSize,
          align: "center" as const,
          bold: true,
        };
      })
    ],
    // Row 2: Section Header
    [
      { text: "1", width: srWidth, color: "#b91c1c", bold: true, fontSize: dynamicFontSize },
      { text: "Income", width: particularsWidth, color: "#b91c1c", bold: true, fontSize: dynamicFontSize },
      { text: "", width: dataWidth }
    ],
    // Row 3: Sales Header
    [
      { text: "a", width: srWidth, fontSize: dynamicFontSize },
      { text: "Sales (net of returns)", width: particularsWidth, color: "#b91c1c", fontSize: dynamicFontSize },
      { text: "", width: dataWidth }
    ],
    // Row 4: Domestic Sales
    [
      { text: "1", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Domestic Sales", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...years.map((y: any) => ({ text: formatInMillions(y.domesticSales), width: dataWidth / loanPeriod, bold: true, align: "center" as const, fontSize: dynamicFontSize }))
    ],
    // Row 5: Export Sales
    [
      { text: "2", width: srWidth, fontSize: dynamicFontSize },
      { text: "Export Sales", width: particularsWidth, fontSize: dynamicFontSize },
      ...years.map((y: any) => ({ text: y.exportSales ? formatInMillions(y.exportSales) : "N/A", width: dataWidth / loanPeriod, align: "center" as const, fontSize: dynamicFontSize }))
    ],
    // Row 6: Sub-Total
    [
      { text: "3", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Sub-Total", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...years.map((y: any) => ({ text: formatInMillions(y.subTotal), width: dataWidth / loanPeriod, align: "center" as const, fontSize: dynamicFontSize, bold: true }))
    ],
    // Row 7: GST
    [
      { text: "4", width: srWidth, fontSize: dynamicFontSize },
      { text: "Less:GST", width: particularsWidth, fontSize: dynamicFontSize },
      ...years.map((y: any) => ({ text: formatInMillions(y.gst), width: dataWidth / loanPeriod, align: "center" as const, fontSize: dynamicFontSize }))
    ],
    // Row 8: Net Sales
    [
      { text: "5", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Net Sales", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...years.map((y: any) => ({ text: formatInMillions(y.netSales), width: dataWidth / loanPeriod, align: "center" as const, fontSize: dynamicFontSize, bold: true }))
    ],
    // Row 9: Other Income
    [
      { text: "6", width: srWidth, fontSize: dynamicFontSize },
      { text: "Total Other Income", width: particularsWidth, fontSize: dynamicFontSize },
      ...years.map((y: any) => ({ text: formatInMillions(y.totalOtherIncome), width: dataWidth / loanPeriod, align: "center" as const, fontSize: dynamicFontSize }))
    ],
    // Row 10: Total Gross Income
    [
      { text: "7", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Total Gross Income", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...years.map((y: any) => ({ text: formatInMillions(y.totalGrossIncome), width: dataWidth / loanPeriod, align: "center" as const, fontSize: dynamicFontSize, bold: true }))
    ],
    // Section Divider: Cost of Production
    [
      { text: "Cost of Production & Cost of Sales", color: "#b91c1c", width: 550, bold: true, fontSize: 8 }
    ],
    [
      { text: "(Raw Materials Including Stores and other items used in process)", width: 550, fontSize: 8 }
    ],
    // Row 11: Imported
    [
      { text: "1", width: srWidth, fontSize: dynamicFontSize },
      { text: "Imported", width: particularsWidth, fontSize: dynamicFontSize },
      ...years.map(() => ({ text: "N/A", width: dataWidth / loanPeriod, align: "center" as const, fontSize: dynamicFontSize }))
    ],
    // Row 12: Indigenous
    [
      { text: "2", width: srWidth, fontSize: dynamicFontSize },
      { text: "Indigenous", width: particularsWidth, fontSize: dynamicFontSize },
      ...years.map(() => ({ text: "N/A", width: dataWidth / loanPeriod, align: "center" as const, fontSize: dynamicFontSize }))
    ],
    // Row 13: Sub-Total (Cost)
    [
      { text: "3", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Sub-Total", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...years.map(() => ({ text: "N/A", width: dataWidth / loanPeriod, align: "center" as const, fontSize: dynamicFontSize, bold: true }))
    ],
  ];

  drawFlexibleTable(doc, incomeTableRows, { fontSize: dynamicFontSize, ...fonts });
};
/**
 * SECTION 7: DEPRECIATION SCHEDULES
 */
export const drawDepreciationSchedules = (doc: any, schedule: any[], formatRupees: Function, fonts: any, leftX: number) => {
  schedule.forEach((yearData: any, index: number) => {
    if (index % 2 !== 0) doc.x = leftX;
    if (index % 2 === 0) doc.addPage();

    const deprRows: TableRow[] = [
      [
        { text: "Assets", width: 140, color: "#b91c1c", bold: true, fontSize: 8 },
        { text: "Opening Balance", width: 85, color: "#b91c1c", bold: true, fontSize: 8, align: "center" },
        { text: "Addition", width: 60, color: "#b91c1c", bold: true, fontSize: 8, align: "center" },
        { text: "Total", width: 80, color: "#b91c1c", bold: true, fontSize: 8, align: "center" },
        { text: "Rate", width: 40, color: "#b91c1c", bold: true, fontSize: 8, align: "center" },
        { text: "Depreciation", width: 75, color: "#b91c1c", bold: true, fontSize: 8, align: "center" },
        { text: "Closing Balance", width: 70, color: "#b91c1c", bold: true, fontSize: 8, align: "center" },
      ],
      ...yearData.assets.map((asset: any) => [
        { text: asset.assetName, width: 140, fontSize: 8 },
        { text: formatRupees(asset.openingBalance), width: 85, fontSize: 8, align: "center" },
        { text: formatRupees(asset.addition), width: 60, fontSize: 8, align: "center" },
        { text: formatRupees(asset.total), width: 80, fontSize: 8, color: "#b91c1c", align: "center", bold: true },
        { text: asset.rate.toFixed(2), width: 40, fontSize: 8, align: "center" },
        { text: formatRupees(asset.depreciationAmount), width: 75, fontSize: 8, align: "center" },
        { text: formatRupees(asset.closingBalance), width: 70, fontSize: 8, align: "center" },
      ]),
      [{ text: "TOTAL", width: 140, bold: true, fontSize: 8 }, { text: "", width: 85 }, { text: "", width: 60 }, { text: "", width: 80 }, { text: "", width: 40 }, { text: formatRupees(yearData.totalDepreciationForYear), width: 75, bold: true, fontSize: 8, align: "center" }, { text: "", width: 70 }]
    ];

    drawFlexibleTable(doc, deprRows, {
      title: `PROJECTED DEPRECIATION SCHEDULE FOR FY ${yearData.year} -${(yearData.year + 1) % 100} `,
      ...fonts
    });
    doc.moveDown(2);
  });
};
