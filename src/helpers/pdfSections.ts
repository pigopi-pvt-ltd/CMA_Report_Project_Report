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

/**
 * SECTION 8: PURCHASE COST STATEMENT
 */

export const drawPurchaseCostStatement = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  // Data seedha database se aa raha hai
  const purchaseData = projectData.purchaseCostStatement || [];
  const loanPeriod = projectData.loanPeriod;

  const srWidth = 30;
  const particularsWidth = 150;
  const dataWidth = 550 - (particularsWidth + srWidth);
  const dynamicFontSize = loanPeriod > 7 ? 7 : 8;

  const rows: TableRow[] = [
    // 1. Header Row
    [
      { text: "Sr No", width: srWidth, color: "#b91c1c", bold: true, fontSize: dynamicFontSize },
      { text: "Particulars", width: particularsWidth, color: "#b91c1c", bold: true, fontSize: dynamicFontSize },
      ...purchaseData.map((p: any, i: number) => ({
        text: `${i === 0 ? 'ESTIMATED' : 'PROJECTED'} FY ${p.year}-${(p.year + 1) % 100}`,
        width: dataWidth / loanPeriod,
        color: "#b91c1c",
        bold: true,
        fontSize: dynamicFontSize,
        align: "center"
      }))
    ],
    [
      { text: "b", width: srWidth, fontSize: dynamicFontSize },
      { text: "Other Consumable Spares (Purchase)", color: "#b91c1c", width: 550, bold: true, fontSize: 8 }
    ],
    // 4. Imported
    [
      { text: "4", width: srWidth, fontSize: dynamicFontSize },
      { text: "Imported", width: particularsWidth, fontSize: dynamicFontSize },
      ...purchaseData.map(() => ({ text: "N/A", width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize }))
    ],
    // 5. Indigenous 
    [
      { text: "5", width: srWidth, fontSize: dynamicFontSize },
      { text: "Indigenous", width: particularsWidth, fontSize: dynamicFontSize },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.indigenous), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize }))
    ],
    // 6. Sub-total
    [
      { text: "6", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Sub-total", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.indigenous), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize, bold: true }))
    ],
    // 7. Freight & Other Expenses
    [
      { text: "7", width: srWidth, fontSize: dynamicFontSize },
      { text: "Freight & Other Exp", width: particularsWidth, fontSize: dynamicFontSize },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.freightAndOtherExpenses), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize }))
    ],
    // 8. Total Direct Expenses
    [
      { text: "8", width: srWidth, fontSize: dynamicFontSize },
      { text: "Total Direct Expenses", width: particularsWidth, fontSize: dynamicFontSize },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.totalDirectExpenses), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize }))
    ],
    // 9. Sub-total (Direct)
    [
      { text: "9", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Sub-total", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.subTotal), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize, bold: true }))
    ],
    // 10. Opening stock of W.I.P.
    [
      { text: "10", width: srWidth, fontSize: dynamicFontSize },
      { text: "Add: Opening stock of W.I.P.", width: particularsWidth, fontSize: dynamicFontSize },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.openingStockOfWIP), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize }))
    ],
    // 11. Sub-total After Opening Stock of W.I.P.
    [
      { text: "11", width: srWidth, fontSize: dynamicFontSize },
      { text: "Sub-total After WIP Opening", width: particularsWidth, fontSize: dynamicFontSize },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.subTotalAfterOpeningStock), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize }))
    ],
    // 12. Less: closing stock of W.I.P.
    [
      { text: "12", width: srWidth, fontSize: dynamicFontSize },
      { text: "Less: closing stock of W.I.P.", width: particularsWidth, fontSize: dynamicFontSize },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.closingStockOfWIP), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize }))
    ],
    // 13. Total Cost of Production
    [
      { text: "13", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Total Cost of Production", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.totalCostOfProduction), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize, bold: true }))
    ],
    // 14. Add: Opening Stock of Finished Goods
    [
      { text: "14", width: srWidth, fontSize: dynamicFontSize },
      { text: "Add: Opening Stock of FG", width: particularsWidth, fontSize: dynamicFontSize },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.openingStockOfFinishedGoods), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize }))
    ],
    // 15. Sub-total After FG Opening
    [
      { text: "15", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Sub-total After FG Opening", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.subTotalAfterOpeningStockFinishedGoods), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize, bold: true }))
    ],
    // 16. Less: Closing Stock of Finished Goods
    [
      { text: "16", width: srWidth, fontSize: dynamicFontSize },
      { text: "Less: Closing Stock of FG", width: particularsWidth, fontSize: dynamicFontSize },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.closingStockOfFinishedGoods), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize }))
    ],
    // 17. Total Cost of Sales
    [
      { text: "17", width: srWidth, fontSize: dynamicFontSize, bold: true },
      { text: "Total Cost of Sales", width: particularsWidth, fontSize: dynamicFontSize, bold: true },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.totalCostOfSales), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize, bold: true }))
    ],
    // 18. Gross Profit 
    [
      { text: "18", width: srWidth, color: "#b91c1c", fontSize: dynamicFontSize, bold: true },
      { text: "Gross Profit", width: particularsWidth, color: "#b91c1c", fontSize: dynamicFontSize, bold: true },
      ...purchaseData.map((p: any) => ({ text: formatInMillions(p.grossProfit), width: dataWidth / loanPeriod, align: "center", fontSize: dynamicFontSize, bold: true }))
    ],
  ];

  drawFlexibleTable(doc, rows, { title: "COST OF PRODUCTION & GROSS PROFIT DETERMINATION", ...fonts });
};

export const drawGeneralExpensesTable = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const expensesData = projectData.generalExpensesStatement || [];
  const loanPeriod = projectData.loanPeriod;
  const particularsWidth = 150;
  const dataWidth = 370; // Adjusted for space
  const cellWidth = dataWidth / loanPeriod;

  const rows: any[] = [
    // Header
    [
      { text: "Sr No", width: 30, color: "#b91c1c", bold: true },
      { text: "Particulars", width: particularsWidth, color: "#b91c1c", bold: true },
      ...expensesData.map((e: any, i: any) => ({
        text: `${i === 0 ? 'ESTIMATED' : 'PROJECTED'} FY ${e.year}-${(e.year + 1) % 100}`,
        width: cellWidth,
        color: "#b91c1c",
        bold: true,
        align: "center"
      }))
    ],
    [

      { text: "General, Administrative & Selling Expenses", color: "#b91c1c", width: 550, bold: true, fontSize: 8 }

    ],
    // Salary Row Example
    [
      { text: "1", width: 30 },
      { text: "Salary & Wages", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.salary), width: cellWidth, align: "center" }))
    ],
    [
      { text: "2", width: 30 },
      { text: "Power & Fuel", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.powerAndFuel), width: cellWidth, align: "center" }))
    ],
    [
      { text: "3", width: 30 },
      { text: "Printing & Stationery", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.printingAndStationery), width: cellWidth, align: "center" }))
    ],
    [
      { text: "4", width: 30 },
      { text: "Advertisement", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.advertisement), width: cellWidth, align: "center" }))
    ],
    [
      { text: "5", width: 30 },
      { text: "Miscellaneous Expenses", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.miscellaneousExpenses), width: cellWidth, align: "center" }))
    ],
    [
      { text: "6", width: 30 },
      { text: "Other Expenses", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.otherExpenses), width: cellWidth, align: "center" }))
    ],
    [
      { text: "7", width: 30 },
      { text: "Postage & Courier", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.postageAndCourier), width: cellWidth, align: "center" }))
    ],
    [
      { text: "8", width: 30 },
      { text: "Transport & Conveyance", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.transportAndConveyance), width: cellWidth, align: "center" }))
    ],
    [
      { text: "9", width: 30 },
      { text: "Staff Welfare Expenses", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.staffWelfare), width: cellWidth, align: "center" }))
    ],
    [
      { text: "10", width: 30 },
      { text: "Repair & Maintenance", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.repairAndMaintenance), width: cellWidth, align: "center" }))
    ],
    [
      { text: "11", width: 30 },
      { text: "Depreciation", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.depreciation), width: cellWidth, align: "center" }))

    ],
    [
      { text: "12", width: 30 },
      { text: "Rent", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.rent), width: cellWidth, align: "center" }))
    ],
    [
      { text: "13", width: 30 },
      { text: "Electricity Expenses", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.electricityExpenses), width: cellWidth, align: "center" }))
    ],
    [
      { text: "14", width: 30 },
      { text: "Total General, Administrative & Selling Expenses", width: particularsWidth },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.totalGeneralExpenses), width: cellWidth, align: "center" }))
    ],
    [
      { text: "15", width: 30, color: "#b91c1c", bold: true },
      { text: "Operating Profit before Interest", width: particularsWidth, color: "#b91c1c", bold: true },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.operatingProfit), width: cellWidth, align: "center", color: "#b91c1c", bold: true }))
    ],
    [
      { text: "Finance Charges", color: "#b91c1c", width: 550, bold: true, fontSize: 8 }
    ],
    [
      { text: "1", width: 30, color: "#b91c1c", bold: true },
      { text: "Interest on Term Loan", width: particularsWidth, color: "#b91c1c", bold: true },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.interestOnTermLoan), width: cellWidth, align: "center" }))
    ],
    [
      { text: "2", width: 30, color: "#b91c1c", bold: true },
      { text: "Interest on CC", width: particularsWidth, color: "#b91c1c", bold: true },
      ...expensesData.map((e: any) => ({ text: formatInMillions(e.interestOnCC), width: cellWidth, align: "center" }))
    ],
    [{ text: "3", width: 30, color: "#b91c1c", bold: true },
    { text: "Total Finance Charges", width: particularsWidth, color: "#b91c1c", bold: true },
    ...expensesData.map((e: any) => ({ text: formatInMillions(e.totalFinanceCharges), width: cellWidth, align: "center" }))
    ]
  ];

  drawFlexibleTable(doc, rows, { title: "GENERAL, ADMINISTRATIVE & SELLING EXPENSES", ...fonts });
};

export const drawProfitabilityStatement = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const years = projectData.costStatement || [];
  const profitData = projectData.profitabilityStatement || [];
  const genExpData = projectData.generalExpensesStatement || [];
  const purchaseData = projectData.purchaseCostStatement || [];
  const loanPeriod = projectData.loanPeriod || 5;

  const particularsWidth = 200;
  const dataWidth = 540 - particularsWidth;
  const cellWidth = dataWidth / loanPeriod;
  const fontSize = 8;

  // --- HEADER ROW ---
  const headerRow = [
    { text: "Particulars", width: particularsWidth, color: "#b91c1c", bold: true, fontSize },
    ...profitData.map((p: any, i: number) => ({
      text: `${i === 0 ? 'ESTIMATED' : 'PROJECTED'} FY ${p.year}-${(p.year + 1) % 100}`,
      width: cellWidth, color: "#b91c1c", bold: true, align: "center", fontSize
    }))
  ];

  // --- PART 1: INCOME & EXPENDITURE ---
  const firstPartRows: any[] = [
    headerRow,
    [{ text: "INCOME", color: "#b91c1c", width: 540, bold: true, fontSize: 8 }],
    [{ text: "REVENUE INCOME / GROSS SALES", width: particularsWidth, bold: true }, ...profitData.map((p: any) => ({ text: formatInMillions(p.totalA || 0), width: cellWidth, align: "center", bold: true }))],
    [{ text: "TOTAL (A)", width: particularsWidth, bold: true, color: "#b91c1c" }, ...profitData.map((p: any) => ({ text: formatInMillions(p.totalA || 0), width: cellWidth, align: "center", bold: true }))],

    // [{ text: "EXPENDITURE", color: "#b91c1c", width: 540, bold: true, fontSize: 8 }],
    // General Expenses se data utha rahe hain
    [{ text: "Salary & Wages", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.salary || 0), width: cellWidth, align: "center" }))],
    [{ text: "Total Purchase of Equipments", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.totalPurchaseOfEquipments || 0), width: cellWidth, align: "center" }))],
    [{ text: "Frieght", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: "N/A", width: cellWidth, align: "center" }))],
    [{ text: "Power & Fuel", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.powerAndFuel || 0), width: cellWidth, align: "center" }))],
    [{ text: "Interest on Loan (Term + WC)", width: particularsWidth }, ...profitData.map((p: any) => ({ text: formatInMillions((p.interestOnTermLoan || 0) + (p.interestOnWorkingCapital || 0)), width: cellWidth, align: "center" }))],
    [{ text: "Interest on CC Loan", width: particularsWidth }, ...profitData.map((p: any) => ({ text: formatInMillions(p.interestOnCC || 0), width: cellWidth, align: "center" }))],
    [{ text: "Printing & Stationery", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.printingAndStationery || 0), width: cellWidth, align: "center" }))],
    [{ text: "Advertisement", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.advertisement || 0), width: cellWidth, align: "center" }))],
    [{ text: "Miscellaneous Expenses", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.miscellaneousExpenses || 0), width: cellWidth, align: "center" }))],
    [{ text: "Other Expenses", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.otherExpenses || 0), width: cellWidth, align: "center" }))],
    [{ text: "Postage & Courier", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.postageAndCourier || 0), width: cellWidth, align: "center" }))],
    [{ text: "Transport & Conveyance", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.transportAndConveyance || 0), width: cellWidth, align: "center" }))],
    [{ text: "Staff Welfare Expenses", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.staffWelfare || 0), width: cellWidth, align: "center" }))],
    [{ text: "Repair & Maintenance", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.repairAndMaintenance || 0), width: cellWidth, align: "center" }))],
    [{ text: "Depreciation", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.depreciation || 0), width: cellWidth, align: "center" }))],
    [{ text: "Rent", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.rent || 0), width: cellWidth, align: "center" }))],
    [{ text: "Electricity Expenses", width: particularsWidth }, ...genExpData.map((g: any) => ({ text: formatInMillions(g.electricityExpenses || 0), width: cellWidth, align: "center" }))],
    // Purchase Statement se data
    [{ text: "Total Purchase of Raw Materials", width: particularsWidth }, ...purchaseData.map((pd: any) => ({ text: formatInMillions(pd.indigenous || 0), width: cellWidth, align: "center" }))],

    [
      { text: "TOTAL (B)", width: particularsWidth, bold: true, color: "#b91c1c" },
      ...profitData.map((p: any) => ({ text: formatInMillions(p.totalB || 0), width: cellWidth, align: "center", bold: true }))
    ],
    [{ text: "NET CREDIT [A-B]", width: particularsWidth, bold: true, color: "#b91c1c" },
    ...profitData.map((p: any) => ({ text: formatInMillions(p.netCredit || 0), width: cellWidth, align: "center", bold: true, color: "#b91c1c" }))
    ],
  ];

  drawFlexibleTable(doc, firstPartRows, { ...fonts, fontSize });

  doc.addPage();

  // --- PART 2: STOCK & TAX ---
  const secondPartRows: any[] = [
    headerRow,
    [{ text: "Opening Stock", width: particularsWidth }, ...profitData.map(() => ({ text: "N/A", width: cellWidth, align: "center" }))],
    [{ text: "Closing stock", width: particularsWidth }, ...profitData.map(() => ({ text: "N/A", width: cellWidth, align: "center" }))],
    [{ text: "Stock Adjustment", width: particularsWidth }, ...profitData.map(() => ({ text: "N/A", width: cellWidth, align: "center" }))],
    [{ text: "Profit before Tax", width: particularsWidth }, ...profitData.map((p: any) => ({ text: formatInMillions(p.profitBeforeTax || 0), width: cellWidth, align: "center", bold: true }))],
    [{ text: "Provision for Taxation", width: particularsWidth }, ...profitData.map((p: any) => ({ text: formatInMillions(p.provisionForTaxation || 0), width: cellWidth, align: "center" }))],
    [{ text: "Profit after Taxation", width: particularsWidth, bold: true, color: "#b91c1c" }, ...profitData.map((p: any) => ({ text: formatInMillions(p.profitAfterTax || 0), width: cellWidth, align: "center", bold: true }))],
    [{ text: "Bal carried over to Balance Sheet", width: particularsWidth, bold: true }, ...profitData.map((p: any) => ({ text: formatInMillions(p.balanceCarriedOverToBalanceSheet || 0), width: cellWidth, align: "center", bold: true }))],
  ];

  drawFlexibleTable(doc, secondPartRows, { ...fonts, fontSize });
};


export const drawCalculationOfDSCR = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const dscrData = projectData.dscrStatement || [];
  const avgDSCR = projectData.averageDSCR || 0;
  const loanPeriod = projectData.loanPeriod || 5;

  const srWidth = 50;
  const particularsWidth = 120;
  const dataWidth = 540 - (particularsWidth + srWidth);
  const cellWidth = dataWidth / loanPeriod;
  const fontSize = 8;

  const rows: any[] = [
    // --- Header Row ---
    [
      { text: "Year", width: srWidth, color: "#b91c1c", bold: true, fontSize },
      { text: "Particulars", width: particularsWidth, color: "#b91c1c", bold: true, fontSize },
      ...dscrData.map((d: any, i: number) => ({
        text: `${i === 0 ? 'ESTIMATED' : 'PROJECTED'} FY ${d.year}-${(d.year + 1) % 100}`,
        width: cellWidth, color: "#b91c1c", bold: true, align: "center", fontSize
      }))
    ],

    // --- Part 1: Cash Accruals (X) ---
    [{ text: "A.", width: srWidth }, { text: "Net Profit After Tax", width: particularsWidth }, ...dscrData.map((d: any) => ({ text: formatInMillions(d.netProfit), width: cellWidth, align: "center" }))],
    [{ text: "B.", width: srWidth }, { text: "Add: Depreciation", width: particularsWidth }, ...dscrData.map((d: any) => ({ text: formatInMillions(d.depreciation), width: cellWidth, align: "center" }))],
    [{ text: "C.", width: srWidth }, { text: "Add: Interest on Term Loan", width: particularsWidth }, ...dscrData.map((d: any) => ({ text: formatInMillions(d.interestOnTermLoan), width: cellWidth, align: "center" }))],
    [{ text: "D.", width: srWidth }, { text: "Interest on Cash Credit", width: particularsWidth }, ...dscrData.map((d: any) => ({ text: formatInMillions(d.interestOnCC), width: cellWidth, align: "center" }))],
    [
      { text: "Total", width: srWidth, bold: true },
      { text: "[X]", width: particularsWidth, bold: true, color: "#b91c1c" },
      ...dscrData.map((d: any) => ({ text: formatInMillions(d.totalCashAccrual), width: cellWidth, bold: true, align: "center", color: "#b91c1c" }))
    ],

    // --- Part 2: Debt Service (Y) ---
    [{ text: "E.", width: srWidth }, { text: "Installment of Term Loan", width: particularsWidth }, ...dscrData.map((d: any) => ({ text: formatInMillions(d.installmentOfTermLoan), width: cellWidth, align: "center" }))],
    [{ text: "F.", width: srWidth }, { text: "Interest on Term Loan", width: particularsWidth }, ...dscrData.map((d: any) => ({ text: formatInMillions(d.interestOnTermLoan), width: cellWidth, align: "center" }))],
    [{ text: "G.", width: srWidth }, { text: "Interest on Cash Cradit", width: particularsWidth }, ...dscrData.map((d: any) => ({ text: formatInMillions(d.interestOnCC), width: cellWidth, align: "center" }))],
    [
      { text: "Total ", width: srWidth, color: "#b91c1c", bold: true },
      { text: "[Y]", width: particularsWidth, bold: true, color: "#b91c1c" },
      ...dscrData.map((d: any) => ({ text: formatInMillions(d.totalDebtService), width: cellWidth, bold: true, align: "center", color: "#b91c1c" }))
    ],

    // --- Part 3: DSCR Ratio ---
    [
      { text: "DSCR", width: srWidth },
      { text: "[X]/[Y]", width: particularsWidth, color: "#b91c1c", bold: true },
      ...dscrData.map((d: any) => ({
        text: d.dscrRatio.toFixed(2),
        width: cellWidth,
        align: "center"
      }))
    ],

    // --- Part 4: Average DSCR ---
    [
      { text: "Average DSCR", width: srWidth },
      { text: "", width: particularsWidth },
      {
        text: avgDSCR.toFixed(2),
        width: dataWidth,
        align: "center"
      }
    ]
  ];

  drawFlexibleTable(doc, rows, { ...fonts, fontSize });
};

// --- SWOT Analysis Page ---
export const drawSWOTAnalysisPage = (doc: any, projectData: any, fonts: any) => {
  const { fontBoldPath, fontPath } = fonts;

  const data = {
    strengths: projectData?.swotAnalysis?.strengths || [],
    weaknesses: projectData?.swotAnalysis?.weaknesses || [],
    opportunities: projectData?.swotAnalysis?.opportunities || [],
    threats: projectData?.swotAnalysis?.threats || []
  };

  const startX = 40;
  let startY = doc.y + 10;
  const boxWidth = 245;
  const gap = 15;

  const drawSwotBox = (title: string, items: string[], x: number, y: number, color: string) => {
    doc.fillColor(color).font(fontBoldPath).fontSize(11).text(title, x, y);

    let currentY = y + 18;

    if (items.length === 0) {
      doc.rect(x, currentY, boxWidth, 22).fill("#f3f4f6");
      doc.fillColor("#9ca3af").font(fontPath).fontSize(8)
        .text("No data available in database", x + 8, currentY + 7);
      return;
    }

    items.forEach((item: string) => {
      doc.rect(x, currentY, boxWidth, 22).fill(color);
      doc.fillColor("#FFFFFF").font(fontPath).fontSize(8)
        .text(`->  ${item}`, x + 8, currentY + 7, { width: boxWidth - 15, lineBreak: false });
      currentY += 23;
    });
  };

  drawSwotBox("STRENGTHS", data.strengths, startX, startY, "#1D8CF8");
  drawSwotBox("WEAKNESSES", data.weaknesses, startX + boxWidth + gap, startY, "#E14E5E");

  const row1MaxItems = Math.max(data.strengths.length, data.weaknesses.length);
  const row1Height = row1MaxItems > 0 ? (row1MaxItems * 23) + 30 : 60;

  const nextRowY = startY + row1Height + 20;

  drawSwotBox("OPPORTUNITIES", data.opportunities, startX, nextRowY, "#2DCE89");
  drawSwotBox("THREATS", data.threats, startX + boxWidth + gap, nextRowY, "#11CDEF");

  doc.moveDown(2);
};
//--Action Plan Page ---
export const drawActionPlan = (doc: any, projectData: any, fonts: any) => {
  console.log("Drawing Action Plan with data:", projectData);
  const businessName = projectData.businessDetails?.businessName || "Business";
  const plan = projectData.actionPlan;

  doc.fontSize(12).fillColor("#FF0000")
    .text(`Action Plan for ${businessName}`, { align: "left" });
  doc.moveDown(0.5);

  const renderSection = (title: string, items: string[], index: number) => {
    if (!items || items.length === 0) return;

    doc.fontSize(11).fillColor("#000000")
      .text(`${index}. ${title}`);
    doc.moveDown(0.5);

    doc.fontSize(10);
    items.forEach(item => {
      doc.text(`•  ${item}`, { indent: 15 });
      doc.moveDown(0.3);
    });
    doc.moveDown(0.8);
  };

  renderSection("Leverage Strengths", plan?.leverageStrengths || [], 1);
  renderSection("Improve Weaknesses", plan?.improveWeaknesses || [], 2);
  renderSection("Capitalize on Opportunities", plan?.capitalizeOpportunities || [], 3);
  renderSection("Mitigate Threats", plan?.mitigateThreats || [], 4);
};
// ----Targate Market ----
export const drawTargateMarket = (doc: any, projectData: any, fonts: any) => {
  const marketData = projectData.targetMarket || [];

  const srWidth = 40;
  const customerWidth = 380;
  const shareWidth = 120;
  const fontSize = 10;

  const rows: any[] = [
    // --- Header Row ---
    [
      { text: "Sr No.", width: srWidth, color: "#b91c1c", bold: true, fontSize },
      { text: "Target Customer", width: customerWidth, color: "#b91c1c", bold: true, fontSize },
      { text: "Expected Share in Sales", width: shareWidth, color: "#b91c1c", bold: true, align: "center", fontSize }
    ],

    // --- Data Rows ---
    ...marketData.map((item: any) => [
      { text: item.srNo.toString(), width: srWidth, fontSize },
      { text: item.targetCustomer, width: customerWidth, fontSize, align: "left" },
      { text: item.expectedShare, width: shareWidth, fontSize, align: "center" }
    ])
  ];

  // fonts.normal/bold ka use karke table draw karein
  drawFlexibleTable(doc, rows, { ...fonts, fontSize });
};
// --- EBIDTA Analysis Page ---
export const drawEBIDTAAnalysis = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const ebidtaData = projectData.ebidtaAnalysis || [];
  const loanPeriod = projectData.loanPeriod || 5;
  const particularsWidth = 150;
  const dataWidth = 370;
  const srNoWidth = 30; // Sr No के लिए अलग विड्थ

  const rows: any[] = [
    // Header Row - Sr No + Particulars + Years
    [
      { text: "Sr No", width: srNoWidth, color: "#b91c1c", bold: true },
      { text: "Particulars", width: particularsWidth, color: "#b91c1c", bold: true },
      ...ebidtaData.map((e: any, i: number) => ({
        text: `${i === 0 ? 'ESTIMATED' : 'PROJECTED'} FY ${e.year}-${(e.year + 1) % 100}`,
        width: dataWidth / loanPeriod, color: "#b91c1c", bold: true, align: "center"
      }))
    ],
    // Net Income Row
    [
      { text: "1", width: srNoWidth },
      { text: "Net Income", width: particularsWidth, bold: true },
      ...ebidtaData.map((e: any) => ({ text: formatInMillions(e.netIncome), width: dataWidth / loanPeriod, align: "center" }))
    ],
    // Tax Expense Row
    [
      { text: "2", width: srNoWidth },
      { text: "Tax Expense", width: particularsWidth, bold: true },
      ...ebidtaData.map((e: any) => ({ text: formatInMillions(e.taxExpense), width: dataWidth / loanPeriod, align: "center" }))
    ],
    // Interest on Term Loan Row
    [
      { text: "3", width: srNoWidth },
      { text: "Interest on Term Loan", width: particularsWidth, bold: true },
      ...ebidtaData.map((e: any) => ({ text: formatInMillions(e.interestOnTermLoan), width: dataWidth / loanPeriod, align: "center" }))
    ],
    // Interest on Cash Credit Row
    [
      { text: "4", width: srNoWidth },
      { text: "Interest on Cash Credit", width: particularsWidth, bold: true },
      ...ebidtaData.map((e: any) => ({ text: formatInMillions(e.interestOnCC), width: dataWidth / loanPeriod, align: "center" }))
    ],
    // Depreciation Row
    [
      { text: "5", width: srNoWidth },
      { text: "Depreciation", width: particularsWidth, bold: true },
      ...ebidtaData.map((e: any) => ({ text: formatInMillions(e.depreciation), width: dataWidth / loanPeriod, align: "center" }))
    ],
    // Amortization Row
    [
      { text: "6", width: srNoWidth },
      { text: "Amortization", width: particularsWidth, bold: true },
      ...ebidtaData.map((e: any) => ({ text: "N/A", width: dataWidth / loanPeriod, align: "center" }))
    ],
    // EBIDTA Row (Total)
    [
      { text: "", width: srNoWidth, color: "#b91c1c", bold: true },
      { text: "EBIDTA", width: particularsWidth, color: "#b91c1c", bold: true },
      ...ebidtaData.map((e: any) => ({ text: formatInMillions(e.ebidta), width: dataWidth / loanPeriod, align: "center", color: "#b91c1c", bold: true }))
    ],
    // EBIT Row (Total)
    [
      { text: "", width: srNoWidth, color: "#b91c1c", bold: true },
      { text: "EBIT", width: particularsWidth, color: "#b91c1c", bold: true },
      ...ebidtaData.map((e: any) => ({ text: formatInMillions(e.ebit), width: dataWidth / loanPeriod, align: "center", color: "#b91c1c", bold: true }))
    ]
  ];

  drawFlexibleTable(doc, rows, { title: "EBIDTA ANALYSIS", ...fonts });
};
export const drawReturnOnInvestment = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const roiData = projectData.returnOnInvestmentAnalysis || [];
  const loanPeriod = projectData.loanPeriod || 5;
  const particularsWidth = 150;
  const dataWidth = 370;
  const fontSize = 8;

  doc.fontSize(8).fillColor("#000000");
  doc.text("1. Return on Investment = Average Return / Capital Employed x 100", { bullet: true });
  doc.text("2. Return = Profit Before Tax + Depreciation + Interest on Term Loan + Interest on Cash Credit", { bullet: true });
  doc.text("3. Capital Employed = Cost of Project", { bullet: true });
  doc.moveDown(1);

  const rows: any[] = [
    [
      { text: "Particulars", width: particularsWidth, color: "#b91c1c", bold: true, fontSize },
      ...roiData.map((r: any, i: number) => ({
        text: `${i === 0 ? 'ESTIMATED' : 'PROJECTED'} FY ${r.year}-${(r.year + 1) % 100}`,
        width: dataWidth / loanPeriod, color: "#b91c1c", bold: true, align: "center", fontSize
      }))
    ],
    [
      { text: "Profit Before Tax", width: particularsWidth, bold: true },
      ...roiData.map((r: any) => ({ text: formatInMillions(r.profitBeforeTax), width: dataWidth / loanPeriod, align: "center", fontSize }))
    ],
    [
      { text: "Depreciation", width: particularsWidth, bold: true },
      ...roiData.map((r: any) => ({ text: formatInMillions(r.depreciation), width: dataWidth / loanPeriod, align: "center", fontSize }))
    ],
    [
      { text: "Interest on Term Loan", width: particularsWidth, bold: true },
      ...roiData.map((r: any) => ({ text: formatInMillions(r.interestOnTermLoan), width: dataWidth / loanPeriod, align: "center", fontSize }))
    ],
    [
      { text: "Interest on Cash Credit", width: particularsWidth, bold: true },
      ...roiData.map((r: any) => ({ text: formatInMillions(r.interestOnCC), width: dataWidth / loanPeriod, align: "center", fontSize }))
    ],
    [
      { text: "Total", width: particularsWidth, bold: true },
      ...roiData.map((r: any) => ({ text: formatInMillions(r.totalInvestment), width: dataWidth / loanPeriod, align: "center", fontSize }))
    ],
    [
      { text: "Average Return", width: particularsWidth, bold: true },
      ...roiData.map((r: any) => ({
        text: r.AverageReturn ? formatInMillions(r.AverageReturn) : "N/A",
        width: dataWidth / loanPeriod, align: "center", fontSize
      }))
    ],
    [
      { text: "Capital Employed", width: particularsWidth, bold: true },
      ...roiData.map((r: any) => ({
        text: r.CapitalEmployed ? formatInMillions(r.CapitalEmployed) : "N/A",
        width: dataWidth / loanPeriod, align: "center", fontSize
      }))
    ],
    [
      { text: "Return on Investment (ROI)", width: particularsWidth, bold: true, color: "#b91c1c" },
      ...roiData.map((r: any) => ({
        text: r.ReturnOnInvestment ? r.ReturnOnInvestment.toFixed(2) + "%" : "---",
        width: dataWidth / loanPeriod, align: "center", fontSize, bold: true
      }))
    ]
  ];

  drawFlexibleTable(doc, rows, { title: "RETURN ON INVESTMENT ANALYSIS", ...fonts });
}


//---------BreakEvenSales------------
export const drawBreakEvenSales = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const beData = projectData.breakEvenAnalysis || [];
  const loanPeriod = projectData.loanPeriod || 5;

  const srWidth = 50;
  const particularsWidth = 150;
  const dataWidth = 540 - (particularsWidth + srWidth);
  const cellWidth = dataWidth / loanPeriod;
  const fontSize = 8;

  const rows: any[] = [
    [
      { text: "Year", width: srWidth, color: "#b91c1c", bold: true, fontSize },
      { text: "Particulars", width: particularsWidth, color: "#b91c1c", bold: true, fontSize },
      ...beData.map((d: any, i: number) => ({
        text: `${i === 0 ? 'ESTIMATED' : 'PROJECTED'} FY ${d.year}-${(d.year + 1) % 100}`,
        width: cellWidth, color: "#b91c1c", bold: true, align: "center", fontSize
      }))
    ],

    [{ text: "1", width: srWidth }, { text: "Revenue Income / Gross Sales (A)", width: particularsWidth, color: "#b91c1c", bold: true }, ...beData.map((d: any) => ({ text: formatInMillions(d.sales), width: cellWidth, align: "center" }))],
    [{ text: "2", width: srWidth }, { text: "Variable Costs", width: particularsWidth, color: "#b91c1c", bold: true }, ...beData.map((d: any) => ({ text: formatInMillions(d.variableCosts), width: cellWidth, align: "center" }))],
    [{ text: "3", width: srWidth }, { text: "Gross Profit (B)", width: particularsWidth, color: "#b91c1c", bold: true }, ...beData.map((d: any) => ({ text: formatInMillions(d.grossProfit), width: cellWidth, align: "center" }))],
    [{ text: "4", width: srWidth }, { text: "Other Costs", width: particularsWidth, color: "#b91c1c", bold: true }, ...beData.map(() => ({ text: "N/A", width: cellWidth, align: "center" }))],
    [{ text: "5", width: srWidth }, { text: "Depreciation", width: particularsWidth, color: "#b91c1c", bold: true }, ...beData.map((d: any) => ({ text: formatInMillions(d.depreciation), width: cellWidth, align: "center" }))],
    [{ text: "6", width: srWidth }, { text: "Interest on Term Loan", width: particularsWidth, color: "#b91c1c", bold: true }, ...beData.map((d: any) => ({ text: formatInMillions(d.interestOnTermLoan), width: cellWidth, align: "center" }))],
    [{ text: "7", width: srWidth }, { text: "Interest on CC Loan", width: particularsWidth, color: "#b91c1c", bold: true }, ...beData.map((d: any) => ({ text: formatInMillions(d.interestOnCC || 0), width: cellWidth, align: "center" }))],
    
    [
      { text: "Total", width: srWidth, bold: true },
      { text: "Total Fixed Cost (C)", width: particularsWidth, bold: true, color: "#b91c1c" },
      ...beData.map((d: any) => ({ text: formatInMillions(d.fixedCosts), width: cellWidth, bold: true, align: "center", color: "#b91c1c" }))
    ],

    [
      { text: "BEP", width: srWidth, bold: true },
      { text: "Break Even Sales (A*C)/B", width: particularsWidth, color: "#b91c1c", bold: true },
      ...beData.map((d: any) => ({
        text: formatInMillions(d.breakEvenSales),
        width: cellWidth,
        align: "center",
        bold: true
      }))
    ]
  ];

  drawFlexibleTable(doc, rows, { ...fonts, fontSize });
};


//-------------calculationOfInterestOnTermLoan------------------
export const drawCalculationOfInterestOnTermLoan = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const profitability = projectData.profitabilityStatement || [];
  const loanPeriod = projectData.loanPeriod || 5;

  const particularsWidth = 180;
  const dataWidth = 540 - particularsWidth;
  const cellWidth = dataWidth / loanPeriod;
  const fontSize = 8;

  // --- Table 1: Loan Amortization (Opening to Closing) ---
  const colWidths = [60, 96, 96, 96, 96, 96];
  const table1Rows: any[] = [
    [
      { text: "YEAR", width: colWidths[0], color: "#b91c1c", bold: true, fontSize },
      { text: "OPENING BALANCE", width: colWidths[1], color: "#b91c1c", bold: true, fontSize },
      { text: "EMI", width: colWidths[2], color: "#b91c1c", bold: true, fontSize },
      { text: "PRINCIPAL", width: colWidths[3], color: "#b91c1c", bold: true, fontSize },
      { text: "INTEREST", width: colWidths[4], color: "#b91c1c", bold: true, fontSize },
      { text: "CLOSING BALANCE", width: colWidths[5], color: "#b91c1c", bold: true, fontSize }
    ],
    ...profitability.map((d: any) => [
      { text: d.year.toString(), width: colWidths[0], fontSize },
      { text: formatInMillions(d.openingBal || 0), width: colWidths[1], fontSize, align: "center" },
      { text: formatInMillions(d.totalEmiYearly || 0), width: colWidths[2], fontSize, align: "center" },
      { text: formatInMillions(d.principalRepaid || 0), width: colWidths[3], fontSize, align: "center" },
      { text: formatInMillions(d.interestOnTermLoan || 0), width: colWidths[4], fontSize, align: "center" },
      { text: formatInMillions(d.closingBal || 0), width: colWidths[5], fontSize, align: "center" }
    ])
  ];

  drawFlexibleTable(doc, table1Rows, { ...fonts, fontSize });

  doc.moveDown(2);

  // --- Table 2: Interest Summary ---
  const table2Rows: any[] = [
    [
      { text: "", width: particularsWidth },
      ...profitability.map((d: any, i: number) => ({
        text: i === 0 ? 'ESTIMATED' : 'PROJECTED',
        width: cellWidth, color: "#b91c1c", bold: true, align: "center", fontSize
      }))
    ],
    [
      { text: "PARTICULARS", width: particularsWidth, color: "#b91c1c", bold: true, fontSize },
      ...profitability.map((d: any) => ({
        text: `FY ${d.year}-${(d.year + 1) % 100}`,
        width: cellWidth, color: "#b91c1c", bold: true, align: "center", fontSize
      }))
    ],
    [
      { text: "TERM LOAN INTEREST", width: particularsWidth, color: "#b91c1c", bold: true },
      ...profitability.map((d: any) => ({ text: formatInMillions(d.interestOnTermLoan), width: cellWidth, align: "center" }))
    ],
    [
      { text: "CASH CREDIT INTEREST", width: particularsWidth, color: "#b91c1c", bold: true },
      ...profitability.map((d: any) => ({ text: formatInMillions(d.interestOnWorkingCapital || 0), width: cellWidth, align: "center" }))
    ],
    [
      { text: "TOTAL INTEREST", width: particularsWidth, color: "#b91c1c", bold: true },
      ...profitability.map((d: any) => ({
        text: formatInMillions(d.interestOnTermLoan + (d.interestOnWorkingCapital || 0)),
        width: cellWidth,
        align: "center",
        bold: true
      }))
    ]
  ];

  drawFlexibleTable(doc, table2Rows, { ...fonts, fontSize });
};