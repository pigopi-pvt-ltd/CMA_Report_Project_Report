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
export const drawBusinessTable = (doc: any, projectData: any, fonts: any) => {
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

export const drawSalesRevenueTable = (doc: any, projectData: any, formatRupees: Function, fonts: any) => {

  const data = projectData.revenueDetails
  const { fontBoldPath } = fonts;
  const leftX = doc.page.margins.left;
  const rightX = doc.page.width - doc.page.margins.right;

  // --- 1. Header Section ---
  
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
 * SECTION 7: DEPRECIATION SCHEDULES
 */
export const drawDepreciationSchedules = (doc: any, schedule: any[], formatRupees: Function, fonts: any, leftX: number) => {
  schedule.forEach((yearData: any, index: number) => {
    // Check if there's enough space on the current page for the next table
    // Approximate height needed: header (1 line) + assets rows + totals row + some buffer
    const estimatedRowsCount = (yearData.assets?.length || 0) + 5; // Assets + headers + totals + buffer
    const estimatedRowHeight = 20; // Approximate height per row
    const estimatedTableHeight = estimatedRowsCount * estimatedRowHeight;
    const estimatedHeaderHeight = 40; // Space for both headers
    const estimatedTotalHeight = estimatedTableHeight + estimatedHeaderHeight;
    
    // Check remaining page space (accounting for margins)
    const currentPageY = doc.y;
    const pageHeight = doc.page.height;
    const bottomMargin = doc.page.margins.bottom;
    const availableHeight = pageHeight - currentPageY - bottomMargin;
    
    // If not enough space, add a new page
    if (availableHeight < estimatedTotalHeight && index > 0) {
      doc.addPage();
    } else if (index > 0) {
      // If it's not the first item and there's space, add some spacing
      doc.moveDown(1);
    }
    
    // Create centered, single-line title for "YEAR X DEPRECIATION" using proper centering
    const yearTitleText = `YEAR ${index + 1} DEPRECIATION`;
    
    // Calculate the usable page width (excluding margins)
    const leftMargin1 = doc.page.margins.left;
    const rightMargin1 = doc.page.margins.right;
    const usableWidth1 = doc.page.width - leftMargin1 - rightMargin1;
    
    // Reset x position to the left margin to ensure proper centering
    doc.x = leftMargin1;
    
    // Set font properties for year title
    doc.fontSize(10).fillColor("#b91c1c").font(fonts.fontBoldPath);
    
    // Draw the centered year title across the full usable width
    doc.text(yearTitleText, 0, doc.y, { 
      width: usableWidth1,
      align: "center",
      underline: true
    });
    
    doc.moveDown(0.5);

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

    // Create centered, single-line title using proper centering
    const scheduleTitleText = `DEPRECIATION SCHEDULE - FY ${yearData.year}-${(yearData.year + 1) % 100}`;
    
    // Calculate the usable page width (excluding margins)
    const leftMargin2 = doc.page.margins.left;
    const rightMargin2 = doc.page.margins.right;
    const usableWidth2 = doc.page.width - leftMargin2 - rightMargin2;
    
    // Reset x position to the left margin to ensure proper centering
    doc.x = leftMargin2;
    
    // Set font properties
    doc.fontSize(16).fillColor("#000000").font(fonts.fontBoldPath || "Helvetica-Bold");
    
    // Draw the centered text across the full usable width
    doc.text(scheduleTitleText, 0, doc.y, { 
      width: usableWidth2,
      align: "center" 
    });
    
    doc.moveDown(0.5);
    
    drawFlexibleTable(doc, deprRows, { ...fonts });
    doc.moveDown(2);
  });
};



export const drawProfitabilityStatement = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const years = projectData.costStatement || [];
  const profitData = projectData.profitabilityStatement || [];
  // const genExpData = projectData.generalExpensesStatement || [];
  // const purchaseData = projectData.purchaseCostStatement || [];
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
    [{ text: "Salary & Wages", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.salary || 0), width: cellWidth, align: "center" }))],
    [{ text: "Total Purchase of Equipments", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.totalPurchaseEquipment|| 0), width: cellWidth, align: "center" }))],
    [{ text: "Frieght", width: particularsWidth }, ...profitData.map((g: any) => ({ text: "N/A", width: cellWidth, align: "center" }))],
    [{ text: "Power & Fuel", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.powerAndFuel || 0), width: cellWidth, align: "center" }))],
    [{ text: "Interest on Loan (Term + WC)", width: particularsWidth }, ...profitData.map((p: any) => ({ text: formatInMillions((p.interestOnTermLoan || 0) + (p.interestOnCC || 0)), width: cellWidth, align: "center" }))],
    [{ text: "Interest on CC Loan", width: particularsWidth }, ...profitData.map((p: any) => ({ text: formatInMillions(p.interestOnWorkingCapital || 0), width: cellWidth, align: "center" }))],
    [{ text: "Printing & Stationery", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.printingAndStationery || 0), width: cellWidth, align: "center" }))],
    [{ text: "Advertisement", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.advertisement || 0), width: cellWidth, align: "center" }))],
    [{ text: "Miscellaneous Expenses", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.miscellaneousExpenses || 0), width: cellWidth, align: "center" }))],
    [{ text: "Other Expenses", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.otherExpenses || 0), width: cellWidth, align: "center" }))],
    [{ text: "Postage & Courier", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.postageAndCourier || 0), width: cellWidth, align: "center" }))],
    [{ text: "Transport & Conveyance", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.transportAndConveyance || 0), width: cellWidth, align: "center" }))],
    [{ text: "Staff Welfare Expenses", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.staffWelfare || 0), width: cellWidth, align: "center" }))],
    [{ text: "Repair & Maintenance", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.repairAndMaintenance || 0), width: cellWidth, align: "center" }))],
    [{ text: "Depreciation", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.yearDepreciation || 0), width: cellWidth, align: "center" }))],
    [{ text: "Rent", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.rent || 0), width: cellWidth, align: "center" }))],
    [{ text: "Electricity Expenses", width: particularsWidth }, ...profitData.map((g: any) => ({ text: formatInMillions(g.electricityExpenses || 0), width: cellWidth, align: "center" }))],
    // Purchase Statement se data
    [{ text: "Total Purchase of Raw Materials", width: particularsWidth }, ...profitData.map((pd: any) => ({ text: 'N/A', width: cellWidth, align: "center" }))],

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
// --- EBIDTA Analysis Page ---
export const drawEBIDTAAnalysis = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const ebidtaData = projectData.ebidtaAnalysis || [];
  const loanPeriod = projectData.loanPeriod || 5;
  const particularsWidth = 150;
  const dataWidth = 370;
  const srNoWidth = 30; 

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
  const beData = projectData.breakEvenSalesData || [];
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
      ...profitability.map((d: any) => ({ text: formatInMillions(d.interestOnCC || 0), width: cellWidth, align: "center" }))
    ],
    [
      { text: "TOTAL INTEREST", width: particularsWidth, color: "#b91c1c", bold: true },
      ...profitability.map((d: any) => ({
        text: formatInMillions(d.interestOnTermLoan + (d.interestOnCC || 0)),
        width: cellWidth,
        align: "center",
        bold: true
      }))
    ]
  ];

  drawFlexibleTable(doc, table2Rows, { ...fonts, fontSize });
};

export const drawComputationOfMPBF = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const mpbfData = projectData.mpbfAnalysis || [];
  const loanPeriod = projectData.loanPeriod || 5;

  const particularsWidth = 180;
  const dataWidth = 540 - particularsWidth;
  const cellWidth = dataWidth / loanPeriod;
  const fontSize = 8;

  const rows: any[] = [
    // Header Row: Estimated/Projected
    [
      { text: "", width: particularsWidth },
      ...mpbfData.map((d: any, i: number) => ({
        text: i === 0 ? 'ESTIMATED' : 'PROJECTED',
        width: cellWidth, color: "#b91c1c", bold: true, align: "center", fontSize
      }))
    ],
    // Year Header: FY 2024-25 style
    [
      { text: "PARTICULARS", width: particularsWidth, color: "#b91c1c", bold: true, fontSize },
      ...mpbfData.map((d: any) => ({
        text: `FY ${d.year}-${(d.year + 1) % 100}`,
        width: cellWidth, color: "#b91c1c", bold: true, align: "center", fontSize
      }))
    ],

    // Data Rows
    [{ text: "TOTAL CURRENT ASSETS (a)", width: particularsWidth, color: "#b91c1c", bold: true }, ...mpbfData.map((d: any) => ({ text: formatInMillions(d.totalCurrentAssets), width: cellWidth, align: "center" }))],
    [{ text: "TOTAL CURRENT LIABILITIES (b)", width: particularsWidth, color: "#b91c1c", bold: true }, ...mpbfData.map((d: any) => ({ text: formatInMillions(d.totalCurrentLiabilities), width: cellWidth, align: "center" }))],
    [{ text: "BANK BORROWING (c)", width: particularsWidth, color: "#b91c1c", bold: true }, ...mpbfData.map((d: any) => ({ text: formatInMillions(d.bankBorrowing), width: cellWidth, align: "center" }))],
    [{ text: "TOTAL CURRENT LIABILITIES (OTHER THAN BANK BORROWINGS) (b)-(c)", width: particularsWidth, color: "#b91c1c", bold: true }, ...mpbfData.map((d: any) => ({ text: formatInMillions(d.otherCurrentLiabilities), width: cellWidth, align: "center" }))],

    // Method 1 Section
    [{ text: "MPBF METHOD-1", width: particularsWidth, color: "#b91c1c", bold: true, fontSize: 9, fill: "#f3f4f6" }, ...mpbfData.map(() => ({ text: "", width: cellWidth, fill: "#f3f4f6" }))],
    [{ text: "MAXIMUM PERMISSIBLE BANK FINANCE (METHOD-1)", width: particularsWidth, color: "#b91c1c", bold: true }, ...mpbfData.map((d: any) => ({ text: formatInMillions(d.mpbfMethod1), width: cellWidth, align: "center", bold: true }))],

    // Method 2 Section
    [{ text: "MPBF METHOD-2", width: particularsWidth, color: "#b91c1c", bold: true, fontSize: 9, fill: "#f3f4f6" }, ...mpbfData.map(() => ({ text: "", width: cellWidth, fill: "#f3f4f6" }))],
    [{ text: "MAXIMUM PERMISSIBLE BANK FINANCE (METHOD-2)", width: particularsWidth, color: "#b91c1c", bold: true }, ...mpbfData.map((d: any) => ({ text: formatInMillions(d.mpbfMethod2), width: cellWidth, align: "center", bold: true }))]
  ];

  drawFlexibleTable(doc, rows, { ...fonts, fontSize });
};

export const drawImportantRatios = (doc: any, projectData: any, formatrupee: Function, fonts: any) => {
  const ratioData = projectData.ratioAnalysis || [];
  const loanPeriod = projectData.loanPeriod || 5;

  const particularsWidth = 190;
  const dataWidth = 540 - particularsWidth;
  const cellWidth = dataWidth / loanPeriod;
  const fontSize = 8; // Aapki requirement ke hisaab se fixed

  // Formatter for ratios
  const f = (val: any) => (val != null && !isNaN(val)) ? Number(val).toFixed(2) : "0.00";

  // Sabse pehle header define kar lete hain jo har page par repeat hoga
  const tableHeader = [
    { text: "PARTICULARS", width: particularsWidth, color: "#b91c1c", bold: true, fontSize },
    ...ratioData.map((d: any) => ({
      text: `FY ${d.year}-${(d.year + 1) % 100}`,
      width: cellWidth, color: "#b91c1c", bold: true, align: "center", fontSize
    }))
  ];

  // Saari 32 Rows ka data
  const allRows: any[] = [
    // --- Section 1: Profitability ---
    [{ text: "Net Profit", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.netProfit), width: cellWidth, align: "center" }))],
    [{ text: "INTEREST ON TERM LOAN", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.interestOnTermLoan), width: cellWidth, align: "center" }))],
    [{ text: "INTEREST ON CASH CREDIT", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.interestOnCC), width: cellWidth, align: "center" }))],
    [{ text: "PROVISION OF TAXATION", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.provisionForTaxation), width: cellWidth, align: "center" }))],
    [{ text: "TOTAL (X) (PBIT)", width: particularsWidth, bold: true }, ...ratioData.map((d: any) => ({ text: formatrupee(d.totalPbit), width: cellWidth, align: "center", bold: true }))],

    // --- Section 2: Interest Coverage ---
    [{ text: "INTREST ON TERM LOAN Y", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.interestOnTermLoanY), width: cellWidth, align: "center" }))],
    [{ text: "INTEREST ON CASH CREDIT Y", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.interestOnCCY), width: cellWidth, align: "center" }))],
    [{ text: "TOTAL (Y)", width: particularsWidth, bold: true }, ...ratioData.map((d: any) => ({ text: formatrupee(d.totalInterestY), width: cellWidth, align: "center", bold: true }))],
    [{ text: "ISCR (X/Y)", width: particularsWidth, bold: true, fill: "#f3f4f6" }, ...ratioData.map((d: any) => ({ text: f(d.iscr), width: cellWidth, align: "center", bold: true, fill: "#f3f4f6" }))],
    [{ text: "Net Profit X/Y", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: f(d.netProfitXY), width: cellWidth, align: "center" }))],

    // --- Section 3: Sales & Operating ---
    [{ text: "REVENUE INCOME / GROSS SALES", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.revenueIncome), width: cellWidth, align: "center" }))],
    [{ text: "NET PROFIT/ SALES %", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: f(d.netProfitToSales), width: cellWidth, align: "center" }))],
    [{ text: "PBIT", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.pbit), width: cellWidth, align: "center" }))],
    [{ text: "DEPRECIATION", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.depreciation), width: cellWidth, align: "center" }))],
    [{ text: "PBDIT", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.pbdit), width: cellWidth, align: "center" }))],

    // --- Section 4: Assets ---
    [{ text: "Total Assets", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.totalAssets), width: cellWidth, align: "center" }))],
    [{ text: "Profit to Total Assets Ratio", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: f(d.profitToTotalAssetsRatio), width: cellWidth, align: "center" }))],
    [{ text: "NET SALES (O)", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.netSales), width: cellWidth, align: "center" }))],

    // --- Section 5: Borrowings ---
    [{ text: "TERM LOAN", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.termLoanBalance), width: cellWidth, align: "center" }))],
    [{ text: "CASH CREDIT", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.cashCredit), width: cellWidth, align: "center" }))],
    [{ text: "TOTAL BANK BORROWING (P)", width: particularsWidth, bold: true }, ...ratioData.map((d: any) => ({ text: formatrupee(d.totalBankBorrowing), width: cellWidth, align: "center", bold: true }))],
    [{ text: "NET SALES/ BANK BORROWING", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: f(d.netSalesToBankBorrowing), width: cellWidth, align: "center" }))],

    // --- Section 6: Liquidity ---
    [{ text: "CURRENT ASSETS", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.currentAssets), width: cellWidth, align: "center" }))],
    [{ text: "CURRENT LIABILITIES", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.currentLiabilities), width: cellWidth, align: "center" }))],
    [{ text: "CURRENT ASSET RATIO", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: f(d.currentAssetRatio), width: cellWidth, align: "center" }))],
    [{ text: "Net Capital Worth", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.netCapitalWorth), width: cellWidth, align: "center" }))],
    [{ text: "Current Ratio", width: particularsWidth, bold: true, fill: "#f3f4f6" }, ...ratioData.map((d: any) => ({ text: f(d.currentRatio), width: cellWidth, align: "center", bold: true, fill: "#f3f4f6" }))],

    // --- Section 7: Solvency ---
    [{ text: "TNW", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.tnw), width: cellWidth, align: "center" }))],
    [{ text: "TOL", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.tol), width: cellWidth, align: "center" }))],
    [{ text: "TOL/TNW", width: particularsWidth, bold: true }, ...ratioData.map((d: any) => ({ text: f(d.tolToTnw), width: cellWidth, align: "center", bold: true }))],
    [{ text: "Term Liabilities", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: formatrupee(d.termLiabilities), width: cellWidth, align: "center" }))],
    [{ text: "Term Liability/TNW", width: particularsWidth }, ...ratioData.map((d: any) => ({ text: f(d.termLiabilityToTnw), width: cellWidth, align: "center" }))]
  ];

  // --- LOGIC TO SPLIT AND DRAW ---
  const firstPageRows = [tableHeader, ...allRows.slice(0, 18)];
  const secondPageRows = [tableHeader, ...allRows.slice(18)];

  // Draw Page 1
  if (doc.y > 300) doc.addPage();
  doc.fillColor("#b91c1c").fontSize(10).text("IMPORTANT RATIO ANALYSIS (PART-I)", { align: "center", bold: true });
  doc.moveDown(0.5);
  drawFlexibleTable(doc, firstPageRows, { ...fonts, fontSize, padding: 3 });

  // Draw Page 2
  doc.addPage();
  doc.fillColor("#b91c1c").fontSize(10).text("IMPORTANT RATIO ANALYSIS (PART-II)", { align: "center", bold: true });
  doc.moveDown(0.5);
  drawFlexibleTable(doc, secondPageRows, { ...fonts, fontSize, padding: 3 });
};

export const drawSensitivityAnalysis = (doc: any, projectData: any, formatInMillions: Function, fonts: any) => {
  const sensitivity = projectData?.sensitivityAnalysis;
  if (!sensitivity) return;

  const loanPeriod = projectData.loanPeriod || 5;
  const particularsWidth = 180;
  const totalWidth = 540;
  const cellWidth = (totalWidth - particularsWidth) / loanPeriod;
  const dynamicFontSize = loanPeriod > 7 ? 7 : 8;

  const scenarios = [
    { title: "Scenario 1", subtitle: "Decrease in Sales/Revenue by 5%", data: sensitivity.scenarioSalesDecrease },
    { title: "Scenario 2", subtitle: "Increase in Variable Cost 5%", data: sensitivity.scenarioVariableCostIncrease },
    { title: "Scenario 3", subtitle: "Increase in Fixed Cost (other than Depreciation) 5%", data: sensitivity.scenarioFixedCostIncrease }
  ];

  scenarios.forEach((scen) => {
    if (!scen.data || scen.data.length === 0) return;

    if (doc.y > 550) doc.addPage();

    // --- ERROR FIX: String ki jagah direct fonts.bold/regular use kiya hai ---
    doc.moveDown(1);

    // Yahan fonts.bold wo path hai jo senior ne bheja hai, system isse crash nahi karega
    if (fonts?.bold) doc.font(fonts.bold);

    doc.fillColor("#b91c1c")
      .fontSize(10)
      .text(scen.title, 20);

    if (fonts?.regular) doc.font(fonts.regular);

    doc.fillColor("#374151")
      .fontSize(9)
      .text(scen.subtitle);

    doc.moveDown(0.5);

    const rows: TableRow[] = [
      [
        { text: "PARTICULARS", width: particularsWidth, color: "#b91c1c", bold: true, fontSize: dynamicFontSize },
        ...scen.data.map((d: any, i: number) => ({
          text: `${i === 0 ? 'ESTIMATED' : 'PROJECTED'} FY ${d.financialYear}`,
          width: cellWidth,
          color: "#b91c1c",
          bold: true,
          fontSize: dynamicFontSize,
          align: "center" as const
        }))
      ],
      [
        { text: "Revenue Income / Gross Sales", width: particularsWidth, fontSize: dynamicFontSize },
        ...scen.data.map((d: any) => ({
          text: formatInMillions(d.totalRevenueIncome),
          width: cellWidth,
          align: "center" as const,
          fontSize: dynamicFontSize
        }))
      ],
      [
        { text: "EBITDA", width: particularsWidth, fontSize: dynamicFontSize },
        ...scen.data.map((d: any) => ({
          text: formatInMillions(d.ebitdaValue),
          width: cellWidth,
          align: "center" as const,
          fontSize: dynamicFontSize
        }))
      ],
      [
        { text: "EBIT", width: particularsWidth, fontSize: dynamicFontSize },
        ...scen.data.map((d: any) => ({
          text: formatInMillions(d.ebitValue),
          width: cellWidth,
          align: "center" as const,
          fontSize: dynamicFontSize
        }))
      ],
      [
        { text: "Profit Before Tax", width: particularsWidth, fontSize: dynamicFontSize, bold: true, color: "#b91c1c" },
        ...scen.data.map((d: any) => ({
          text: formatInMillions(d.profitBeforeTaxValue),
          width: cellWidth,
          align: "center" as const,
          fontSize: dynamicFontSize,
          bold: true,
          color: "#b91c1c"
        }))
      ]
    ];

    drawFlexibleTable(doc, rows, {
      fontSize: dynamicFontSize,
      startX: 30,
      ...fonts // Iske andar fonts.fontPath aur fonts.fontBoldPath ja rahe hain
    });

    doc.moveDown(1.5);
  });
};


export const drawProjectedBalanceSheet = (doc: any, projectData: any, formatRupee: Function, fonts: any) => {
  const balanceSheetData = projectData.projectedBalanceSheet || [];
  if (balanceSheetData.length === 0) return;

  const loanPeriod = balanceSheetData.length;
  const particularsWidth = 185;
  const totalWidth = 540;
  const cellWidth = (totalWidth - particularsWidth) / loanPeriod;
  const dynamicFontSize = loanPeriod > 5 ? 7 : 8;

  // 1. Header Logic (Estimated vs Projected)
  const headerStatusRow = [
    { text: "", width: particularsWidth },
    ...balanceSheetData.map((d: any, index: number) => ({
      text: index === 0 ? "ESTIMATED" : "PROJECTED",
      width: cellWidth,
      color: "#b91c1c",
      bold: true,
      fontSize: dynamicFontSize - 1,
      align: "center"
    }))
  ];

  // 2. Year Header
  const yearHeaderRow = [
    { text: "YEARS", width: particularsWidth, color: "#b91c1c", bold: true, fontSize: dynamicFontSize },
    ...balanceSheetData.map((d: any) => ({
      text: `FY ${d.year}`,
      width: cellWidth,
      color: "#b91c1c",
      bold: true,
      fontSize: dynamicFontSize,
      align: "center"
    }))
  ];

  // 3. Merged Data Rows (Liabilities + Assets)
  const TableRows: any[] = [
    headerStatusRow,
    yearHeaderRow,
    // LIABILITIES SECTION
    [{ text: "LIABILITIES", width: totalWidth, color: "#b91c1c", bold: true, fontSize: dynamicFontSize }],
    [{ text: "Capital", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.capital || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Add:- Profit During year", width: particularsWidth, fontSize: dynamicFontSize, italic: true }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.addProfitDuringYear || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Less:- Drawings", width: particularsWidth, fontSize: dynamicFontSize, italic: true }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.lessDrawings || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Term Loan", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.termLoan || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Cash Credit", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.cashCredit || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Current Liabilities & Provision", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.currentLiabilitiesAndProvision || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Provision For Tax", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.provisionForTax || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "TOTAL LIABILITIES", width: particularsWidth, fontSize: dynamicFontSize, bold: true, color: "#b91c1c" }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.totalLiabilities || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize, bold: true, color: "#b91c1c" }))],

    // ASSETS SECTION (Merged directly below)
    [{ text: "ASSETS", color: "#b91c1c", width: totalWidth, bold: true, fontSize: dynamicFontSize }],
    [{ text: "Net Fixed Assets (W.D.V.)", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.netFixedAssetsWDV || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Stock of W.I.P. & Finished Product", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.stockOfWIP || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Sundry Debtors", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.sundryDebtors || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Deposit & Advance", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.depositAndAdvance || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "Cash & Bank Balance", width: particularsWidth, fontSize: dynamicFontSize }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.cashAndBankBalance || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize }))],
    [{ text: "TOTAL ASSETS", width: particularsWidth, fontSize: dynamicFontSize, bold: true, color: "#b91c1c" }, ...balanceSheetData.map((d: any) => ({ text: formatRupee(d.totalAssets || 0), width: cellWidth, align: "center", fontSize: dynamicFontSize, bold: true, color: "#1e293b" }))]
  ];

  // // Heading & Final Table Draw
  // if (doc.y > 500) doc.addPage();
  // doc.fillColor("#b91c1c").fontSize(11).text("PROJECTED BALANCE SHEET", 30);
  // doc.moveDown(0.5);

  // Flexible table ko ab merged data pass ho raha hai
  drawFlexibleTable(doc, TableRows, { fontSize: dynamicFontSize, ...fonts });
};


export const drawCashFlowStatement = (doc: any, projectData: any, formatRupee: Function, fonts: any) => {
  const cashFlowData = projectData.projectedCashFlow || [];
  const particularsWidth = 200; // Thoda bada rakha hai pure naam ke liye
  const totalWidth = 530;
  const cellWidth = (totalWidth - particularsWidth) / cashFlowData.length;

  if (doc.y > 650) doc.addPage();
  doc.fillColor("#b91c1c").fontSize(11).text("PROJECTED CASH FLOW STATEMENT", 30);
  doc.moveDown(0.5);

  const headerRow = [{ text: "Particulars", width: particularsWidth, bold: true }, ...cashFlowData.map((d: any) => ({ text: `FY ${d.year}`, width: cellWidth, align: "center", bold: true, color: "#b91c1c" }))];

  const rows: any[] = [
    headerRow,
    [{ text: "SOURCES OF FUNDS (A)", width: totalWidth, bold: true, color: "#b91c1c" }],
    [{ text: "PBIT", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.pbit), width: cellWidth, align: "center" }))],
    [{ text: "Depreciation", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.depreciation), width: cellWidth, align: "center" }))],
    [{ text: "Increase In Capital", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.increaseInCapital), width: cellWidth, align: "center" }))],
    [{ text: "Increase In Term Loan", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.increaseInTermLoan), width: cellWidth, align: "center" }))],
    [{ text: "Increase in Cash Credit", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.increaseInCashCredit), width: cellWidth, align: "center" }))],
    [{ text: "Decrease In Advance Deposits", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.decreaseInAdvanceDeposits), width: cellWidth, align: "center" }))],
    [{ text: "Decrease In Debtors", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.decreaseInDebtors), width: cellWidth, align: "center" }))],
    [{ text: "Provisions", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.provisions), width: cellWidth, align: "center" }))],
    [{ text: "Decrease In Stock", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.decreaseInStock), width: cellWidth, align: "center" }))],
    [{ text: "Total [A]", width: particularsWidth, bold: true }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.totalA), width: cellWidth, align: "center", bold: true }))],

    [{ text: "APPLICATION OF FUNDS (B)", width: totalWidth, bold: true, color: "#b91c1c" }],
    [{ text: "Increase in Fixed Assets", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.increaseInFixedAssets), width: cellWidth, align: "center" }))],
    [{ text: "Interest on Bank Loan", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.interestOnBankLoan), width: cellWidth, align: "center" }))],
    [{ text: "Drawing", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.drawing), width: cellWidth, align: "center" }))],
    [{ text: "Tax Payment", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.taxPayment), width: cellWidth, align: "center" }))],
    [{ text: "Total [B]", width: particularsWidth, bold: true }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.totalB), width: cellWidth, align: "center", bold: true }))],

    [{ text: "CASH POSITION", width: totalWidth, bold: true, color: "#b91c1c" }],
    [{ text: "Open Cash Balance", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.openCashBalance), width: cellWidth, align: "center" }))],
    [{ text: "Net Surplus / Deficit [A-B]", width: particularsWidth }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.netSurplusDeficit), width: cellWidth, align: "center" }))],
    [{ text: "Closing Cash Balance", width: particularsWidth, bold: true, color: "#b91c1c" }, ...cashFlowData.map((d: any) => ({ text: formatRupee(d.closingCashBalance), width: cellWidth, align: "center", bold: true }))]
  ];

  drawFlexibleTable(doc, rows, { fontSize: 8, ...fonts, padding: 3 });
};

export const drawFinancialPosition = (doc: any, projectData: any, formatRupee: Function, fonts: any) => {
  const financialData = projectData.financialPosition || [];
  const particularsWidth = 200;
  const totalWidth = 530;
  const cellWidth = (totalWidth - particularsWidth) / financialData.length;
  const dynamicFontSize = 8;



  doc.fillColor("#b91c1c").fontSize(11).text("FINANCIAL POSITION", 30, doc.y, { bold: true });

  const rows: any[] = [
    // Header
    [{ text: "Particulars", width: particularsWidth, bold: true }, ...financialData.map((d: any) => ({ text: `FY ${d.year}`, width: cellWidth, align: "center", bold: true, color: "#b91c1c" }))],

    // Data Rows
    [{ text: "Net Sales", width: particularsWidth }, ...financialData.map((d: any) => ({ text: formatRupee(d.netSales), width: cellWidth, align: "center" }))],
    [{ text: "Net Profit After Tax", width: particularsWidth }, ...financialData.map((d: any) => ({ text: formatRupee(d.netProfitAfterTax), width: cellWidth, align: "center" }))],
    [{ text: "Cash Generation", width: particularsWidth }, ...financialData.map((d: any) => ({ text: formatRupee(d.cashGeneration), width: cellWidth, align: "center" }))],
    [{ text: "Net Working Capital", width: particularsWidth }, ...financialData.map((d: any) => ({ text: formatRupee(d.netWorkingCapital), width: cellWidth, align: "center" }))],
    [{ text: "Current Ratio", width: particularsWidth }, ...financialData.map((d: any) => ({ text: d.currentRatio.toFixed(2), width: cellWidth, align: "center" }))],
    [{ text: "TNW (Total Net Worth)", width: particularsWidth, bold: true }, ...financialData.map((d: any) => ({ text: formatRupee(d.totalNetWorth), width: cellWidth, align: "center", bold: true }))],
    [{ text: "TOL/TNW", width: particularsWidth }, ...financialData.map((d: any) => ({ text: d.tolToTnwRatio.toFixed(2), width: cellWidth, align: "center" }))],
    [{ text: "Term Liability/TNW", width: particularsWidth }, ...financialData.map((d: any) => ({ text: d.termLiabilityToTnwRatio.toFixed(2), width: cellWidth, align: "center" }))]
  ];

  drawFlexibleTable(doc, rows, { fontSize: dynamicFontSize, ...fonts, padding: 4 });

};

export const drawAFPTable = (doc: any, projectData: any, formatRupee: Function, fonts: any) => {
  const afpData = projectData.AFPTable || [];
  const particularsWidth = 200;
  const totalWidth = 530;
  const cellWidth = (totalWidth - particularsWidth) / afpData.length;

  if (doc.y > 600) doc.addPage();

  doc.fillColor("#b91c1c").fontSize(11).text("ANALYSIS OF FINANCIAL POSITION (AFP)", 30, doc.y, { bold: true });
  doc.moveDown(0.5);

  const rows: any[] = [
    // Header
    [{ text: "Particulars", width: particularsWidth, bold: true }, ...afpData.map((d: any) => ({ text: `FY ${d.year}`, width: cellWidth, align: "center", bold: true, color: "#b91c1c" }))],

    // Rows
    [{ text: "Capital and Reserves", width: particularsWidth }, ...afpData.map((d: any) => ({ text: formatRupee(d.capitalAndReserves), width: cellWidth, align: "center" }))],
    [{ text: "Long Term Liabilities", width: particularsWidth }, ...afpData.map((d: any) => ({ text: formatRupee(d.longTermLiabilities), width: cellWidth, align: "center" }))],
    [{ text: "Current Liabilities", width: particularsWidth }, ...afpData.map((d: any) => ({ text: formatRupee(d.currentLiabilities), width: cellWidth, align: "center" }))],
    [{ text: "Total Liability", width: particularsWidth, bold: true }, ...afpData.map((d: any) => ({ text: formatRupee(d.totalLiability), width: cellWidth, align: "center", bold: true }))],

    [{ text: "Fixed Assets", width: particularsWidth }, ...afpData.map((d: any) => ({ text: formatRupee(d.fixedAssets), width: cellWidth, align: "center" }))],
    [{ text: "Non-Current Assets", width: particularsWidth }, ...afpData.map((d: any) => ({ text: formatRupee(d.nonCurrentAssets), width: cellWidth, align: "center" }))],
    [{ text: "Current Assets", width: particularsWidth }, ...afpData.map((d: any) => ({ text: formatRupee(d.currentAssets), width: cellWidth, align: "center" }))],
    [{ text: "Intangible Assets", width: particularsWidth }, ...afpData.map((d: any) => ({ text: formatRupee(d.intangibleAssets), width: cellWidth, align: "center" }))],
    [{ text: "Total Assets", width: particularsWidth, bold: true }, ...afpData.map((d: any) => ({ text: formatRupee(d.totalAssets), width: cellWidth, align: "center", bold: true }))]
  ];

  drawFlexibleTable(doc, rows, { fontSize: 8, ...fonts, padding: 4 });
};
export const drawAssumptionsTable = (doc: any, projectData: any, fonts: any) => {
  const assumptions = projectData.assumptions?.particulars || {};
  const industryList = projectData.assumptions?.industryJustifications || [];
  const fontSize = 8;

  // --- TABLE 1: PARTICULARS (Top Table) ---
  const colWidth1 = 540 / 4; // 4 Columns equal width
  const table1Rows: any[] = [
    [
      { text: "Particulars", width: 540, color: "#b91c1c", bold: true, fontSize, colSpan: 4 }
    ],
    [
      { text: "Projected Increment in Gross receipts", width: colWidth1, color: "#b91c1c", bold: true, fontSize },
      { text: "Projected Increment in Expenditure", width: colWidth1, color: "#b91c1c", bold: true, fontSize },
      { text: "Interest rate for Term loan (in %)", width: colWidth1, color: "#b91c1c", bold: true, fontSize },
      { text: "Interest Rate for Cash Credit (in %)", width: colWidth1, color: "#b91c1c", bold: true, fontSize }
    ],
    [
      { text: assumptions.projectedIncrementReceipts || "135%", width: colWidth1, fontSize },
      { text: assumptions.projectedIncrementExpenditure || "112%", width: colWidth1, fontSize },
      { text: (assumptions.interestRateTermLoan || 11.1).toString(), width: colWidth1, fontSize },
      { text: (assumptions.interestRateCashCredit || 11.1).toString(), width: colWidth1, fontSize }
    ]
  ];

  drawFlexibleTable(doc, table1Rows, { ...fonts, fontSize });

  doc.moveDown(2); // Thoda gap dono tables ke beech mein

  // --- TABLE 2: INDUSTRY JUSTIFICATION (Bottom Table) ---
  const industryColWidths = [100, 130, 130, 180];
  const table2Rows: any[] = [
    [
      { text: "Industry", width: industryColWidths[0], color: "#b91c1c", bold: true, fontSize },
      { text: "Projected Increment in Gross Receipts", width: industryColWidths[1], color: "#b91c1c", bold: true, fontSize },
      { text: "Projected Increment in Expenditure", width: industryColWidths[2], color: "#b91c1c", bold: true, fontSize },
      { text: "Justification", width: industryColWidths[3], color: "#b91c1c", bold: true, fontSize }
    ],
    ...industryList.map((item: any) => [
      { text: item.industry, width: industryColWidths[0], color: "#b91c1c", bold: true, fontSize },
      { text: item.receiptsIncrement, width: industryColWidths[1], fontSize },
      { text: item.expenditureIncrement, width: industryColWidths[2], fontSize },
      { text: item.justification, width: industryColWidths[3], fontSize }
    ])
  ];

  drawFlexibleTable(doc, table2Rows, { ...fonts, fontSize });
};

export const drawBreakEvenAnalysis = (doc: any, projectData: any, formatRupee: Function, fonts: any) => {
  const beaData = projectData.breakEvenAnalysis || [];
  if (beaData.length === 0) return;

  const particularsWidth = 180;
  const totalWidth = 530;
  const cellWidth = (totalWidth - particularsWidth) / beaData.length;
  const dynamicFontSize = 8; // Font size standard rakha hai

  // 1. Common Header (Jo har section ke upar repeat ho sakta hai ya split point check karega)
  const getHeaderRows = () => [
    [{ text: "Year", width: particularsWidth, bold: true }, ...beaData.map((d: any, i: number) => ({ text: i === 0 ? "ESTIMATED" : "PROJECTED", width: cellWidth, align: "center", bold: true, color: "#b91c1c" }))],
    [{ text: "", width: particularsWidth }, ...beaData.map((d: any) => ({ text: `FY ${d.year}`, width: cellWidth, align: "center", bold: true, color: "#b91c1c" }))]
  ];

  // --- Page Start Check ---
  if (doc.y > 700) doc.addPage();
  doc.fillColor("#b91c1c").fontSize(11).text("BREAK EVEN ANALYSIS", { align: "center" });


  // SECTION 1: METRICS
  const metricsRows: any[] = [
    ...getHeaderRows(),
    [{ text: "BREAK-EVEN METRICS", width: totalWidth, bold: true, color: "#b91c1c", align: "center" }],
    [{ text: "A. Revenue/Sales", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.revenueSales), width: cellWidth, align: "center" }))],
    [{ text: "B. Variable Cost", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.variableCostTotal), width: cellWidth, align: "center" }))],
    [{ text: "C. Fixed Cost", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.fixedCostTotal), width: cellWidth, align: "center" }))],
    [{ text: "D. Contribution (A-B)", width: particularsWidth, bold: true }, ...beaData.map((d: any) => ({ text: formatRupee(d.contribution), width: cellWidth, align: "center", bold: true }))],
    [{ text: "E. P.V Ratio (D/A*100)", width: particularsWidth }, ...beaData.map((d: any) => ({ text: `${d.pvRatio}`, width: cellWidth, align: "center" }))],
    [{ text: "F. Break-Even (C/E*100)", width: particularsWidth, bold: true }, ...beaData.map((d: any) => ({ text: formatRupee(d.breakEvenSales), width: cellWidth, align: "center", bold: true }))],
    [{ text: "G. CASH BREAK-EVEN", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.cashBreakEven), width: cellWidth, align: "center" }))]
  ];
  drawFlexibleTable(doc, metricsRows, { fontSize: dynamicFontSize, ...fonts, padding: 3 });

  // --- Check space before Fixed Costs ---
  // Agar 150 units se kam jagah hai to naye page par jao
  if (doc.y > 650) {
    doc.addPage();
  }

  // SECTION 2: FIXED COSTS
  const fixedCostRows: any[] = [
    [{ text: "FIXED COSTS", width: totalWidth, bold: true, color: "#b91c1c" }],
    [{ text: "Rent", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.rent), width: cellWidth, align: "center" }))],
    [{ text: "Salary & Wages", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.salaryWages), width: cellWidth, align: "center" }))],
    [{ text: "Interest on Term Loan", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.interestTermLoan), width: cellWidth, align: "center" }))],
    [{ text: "Interest on CC Loan", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.interestCCLoan), width: cellWidth, align: "center" }))],
    [{ text: "Advertisement", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.advertisement), width: cellWidth, align: "center" }))],
    [{ text: "Depreciation", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.depreciation), width: cellWidth, align: "center" }))],
    [{ text: "Staff Welfare", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.staffWelfare), width: cellWidth, align: "center" }))],
    [{ text: "Transport & Convenyance", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.transportConvenyance), width: cellWidth, align: "center" }))],
    [{ text: "Total", width: particularsWidth, bold: true }, ...beaData.map((d: any) => ({ text: formatRupee(d.fixedCostTotal), width: cellWidth, align: "center", bold: true }))],
    [{ text: "Total (without depreciation)", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.fixedCostWithoutDepr), width: cellWidth, align: "center" }))]
  ];
  drawFlexibleTable(doc, fixedCostRows, { fontSize: dynamicFontSize, ...fonts, padding: 3 });

  // --- Check space before Variable Costs ---
  if (doc.y > 650) {
    doc.addPage();

  }

  // SECTION 3: VARIABLE COSTS
  const variableCostRows: any[] = [
    [{ text: "VARIABLE COSTS", width: totalWidth, bold: true, color: "#b91c1c" }],
    [{ text: "Purchase of Equipments", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.purchaseEquipments), width: cellWidth, align: "center" }))],
    [{ text: "Purchase of Raw Materials", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.purchaseRawMaterials), width: cellWidth, align: "center" }))],
    [{ text: "Freight", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.freight), width: cellWidth, align: "center" }))],
    [{ text: "Power & Fuel", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.powerFuel), width: cellWidth, align: "center" }))],
    [{ text: "Printing & Stationery", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.printingStationery), width: cellWidth, align: "center" }))],
    [{ text: "Electricity Expenses", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.electricityExpenses), width: cellWidth, align: "center" }))],
    [{ text: "Misc Expenses", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.miscExpenses), width: cellWidth, align: "center" }))],
    [{ text: "Other Expenses", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.otherExpenses), width: cellWidth, align: "center" }))],
    [{ text: "Postage & Courier", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.postageCourier), width: cellWidth, align: "center" }))],
    [{ text: "Repair & Maintenance", width: particularsWidth }, ...beaData.map((d: any) => ({ text: formatRupee(d.repairMaintenance), width: cellWidth, align: "center" }))],
    [{ text: "Total", width: particularsWidth, bold: true }, ...beaData.map((d: any) => ({ text: formatRupee(d.variableCostTotal), width: cellWidth, align: "center", bold: true }))]
  ];
  drawFlexibleTable(doc, variableCostRows, { fontSize: dynamicFontSize, ...fonts, padding: 3 });
};



export const drawFinalAssumption = (doc: any, projectData: any, formatRupee: Function, fonts: any, leftX: number) => {
  const profitability = projectData?.profitabilityStatement || [];
  const assumptions = projectData?.assumptions?.particulars || {};

  // Dynamic Values
  const loanPeriod = projectData?.loanPeriod || "5";
  const averageDSCR = projectData?.averageDSCR || "0.00";
  const employmentPotential = projectData?.loanDetails?.employmentPotential || "10 Above";

  const tableWidth = 530;
  const particularsWidth = 160;
  const cellWidth = profitability.length > 0 ? (tableWidth - particularsWidth) / profitability.length : 0;

  // --- 1. INCREMENT TABLE ---
  const incrementRows: any[][] = [
    [
      { text: "Particulars", width: particularsWidth, bold: true, fillColor: "#b91c1c" },
      { text: "Assumed Percentage", width: tableWidth - particularsWidth, align: "center", bold: true, fillColor: "#b91c1c" }
    ],
    [
      { text: "Projected Increment in Gross receipts", width: particularsWidth },
      { text: assumptions.projectedIncrementReceipts , width: tableWidth - particularsWidth, align: "center" }
    ],
    [
      { text: "Projected Increment in Expenditure", width: particularsWidth },
      { text: assumptions.projectedIncrementExpenditure , width: tableWidth - particularsWidth, align: "center" }
    ]
  ];
  drawFlexibleTable(doc, incrementRows, { ...fonts });

  doc.moveDown(1);
  doc.x = leftX
  if (fonts?.regular) doc.font(fonts.regular).fontSize(10);
  doc.text(`The entire projection is based on the assumption that the sales for ${loanPeriod} years will be growing as per the industry standards.`);
  doc.moveDown(1.5);

  // --- 2. REVENUE FROM SALES ---
  if (profitability.length > 0) {
    const revenueRows: any[][] = [
      [
        { text: "", width: particularsWidth, bold: true, fillColor: "#b91c1c" },
        ...profitability.map((p: any, i: number) => ({
          text: i === 0 ? "ESTIMATED" : "PROJECTED",
          width: cellWidth, align: "center", bold: true, fillColor: "#b91c1c", fontSize: 7
        }))
      ],
      [
        { text: "PARTICULARS", width: particularsWidth, bold: true, fillColor: "#b91c1c" },
        ...profitability.map((p: any) => ({
          text: `FY ${p.year}`, width: cellWidth, align: "center", bold: true, fillColor: "#b91c1c", fontSize: 8
        }))
      ],
      [
        { text: "Gross Receipts/Turnover", width: particularsWidth },
        ...profitability.map((p: any) => ({ text: formatRupee(p.totalA || 0), width: cellWidth, align: "center", fontSize: 8 }))
      ]
    ];
    drawFlexibleTable(doc, revenueRows, { title: "REVENUE FROM SALES", ...fonts });
    doc.moveDown(1.5);
  }

  // --- 3. TOTAL EXPENSES ---
  if (profitability.length > 0) {
    const expenseRows: any[][] = [
      [
        { text: "", width: particularsWidth, bold: true, fillColor: "#b91c1c" },
        ...profitability.map((p: any, i: number) => ({
          text: i === 0 ? "ESTIMATED" : "PROJECTED",
          width: cellWidth, align: "center", bold: true, fillColor: "#b91c1c", fontSize: 7
        }))
      ],
      [
        { text: "PARTICULARS", width: particularsWidth, bold: true, fillColor: "#b91c1c" },
        ...profitability.map((p: any) => ({
          text: `FY ${p.year}`, width: cellWidth, align: "center", bold: true, fillColor: "#b91c1c", fontSize: 8
        }))
      ],
      [
        { text: "Total Expenses", width: particularsWidth },
        ...profitability.map((p: any) => ({ text: formatRupee(p.totalB || 0), width: cellWidth, align: "center", fontSize: 8 }))
      ]
    ];
    doc.x = leftX
    drawFlexibleTable(doc, expenseRows, { title: "TOTAL EXPENSE FOR THE FIRM DURING THE PROJECTION YEARS WILL BE AS FOLLOWS", ...fonts });
    doc.moveDown(1.5);
  }

  // --- 4. PROVISION FOR TAXATION ---
  if (profitability.length > 0) {
    const taxRows: any[][] = [
      [
        { text: "", width: particularsWidth, bold: true, fillColor: "#b91c1c" },
        ...profitability.map((p: any, i: number) => ({
          text: i === 0 ? "ESTIMATED" : "PROJECTED",
          width: cellWidth, align: "center", bold: true, fillColor: "#b91c1c", fontSize: 7
        }))
      ],
      [
        { text: "PARTICULARS", width: particularsWidth, bold: true, fillColor: "#b91c1c" },
        ...profitability.map((p: any) => ({
          text: `FY ${p.year}`, width: cellWidth, align: "center", bold: true, fillColor: "#b91c1c", fontSize: 8
        }))
      ],
      [
        { text: "Provision for Taxation", width: particularsWidth },
        ...profitability.map((p: any) => ({ text: formatRupee(p.provisionForTaxation || 0), width: cellWidth, align: "center", fontSize: 8 }))
      ]
    ];
    doc.x = leftX
    drawFlexibleTable(doc, taxRows, { title: "PROVISION FOR TAXATION ARE AS FOLLOWS", ...fonts });
    doc.x = leftX
    doc.moveDown(0.5);
    doc.fontSize().fillColor("#060707").text("*Since the tax provision aligns with the 30% corporate tax rate.");
    doc.moveDown(1.5);
  }
  doc.x = leftX
  // --- 5. BUSINESS TEAM MEMBERS ---
  const employmentRows: any[][] = [
    [{ text: "Business Team Members", width: tableWidth, bold: true, fillColor: "#b91c1c", color: "#b91c1c" }],
    [{ text: `The company initially plans to recruit ${employmentPotential} employees. As the business grows, the workforce will be expanded accordingly, with the anticipated rise in salary expenses already factored into the financial projections.`, width: tableWidth, align: 'justify' }]
  ];
  drawFlexibleTable(doc, employmentRows, { ...fonts });

  // --- 6. CONCLUSION ---
  doc.moveDown(2);
  if (fonts?.bold) doc.font(fonts.bold).fontSize(11).fillColor("#b91c1c").text("CONCLUSION");
  doc.moveDown(0.5);
  if (fonts?.regular) doc.font(fonts.regular).fontSize(10).fillColor("black");
  doc.x = leftX
  const conclusionText = `A detailed analysis of the Debt Service Coverage Ratio (DSCR) reveals an average ratio of ${averageDSCR}, which indicates the unit's ability to service its debt obligations based on the projected financials.`;
  doc.text(conclusionText, { width: tableWidth, align: 'justify' });
};


export const drawLoanInterestTables = (doc: any, projectData: any, formatrupee: Function, fonts: any) => {
  const loanData = projectData.loanCalculation || [];
  const fontSize = 8;
  const colWidth = 540 / 6;

  // --- 1. PREPARE YEARLY DATA ---
  const yearlyRows = [];
  for (let i = 0; i < loanData.length; i += 12) {
    const chunk = loanData.slice(i, i + 12);
    const yearLabel = chunk[0].date.split('/')[2];

    const yearPrincipal = chunk.reduce((s: number, m: any) => s + m.principal, 0);
    const yearInterest = chunk.reduce((s: number, m: any) => s + m.interest, 0);

    yearlyRows.push([
      { text: yearLabel, width: colWidth, fontSize },
      { text: `₹${chunk[0].openingBalance.toLocaleString()}`, width: colWidth, fontSize },
      { text: `₹${(chunk[0].emi * 12).toLocaleString()}`, width: colWidth, fontSize },
      { text: `₹${yearPrincipal.toLocaleString()}`, width: colWidth, fontSize },
      { text: `₹${yearInterest.toLocaleString()}`, width: colWidth, fontSize },
      { text: `₹${chunk[chunk.length - 1].closingBalance.toLocaleString()}`, width: colWidth, fontSize }
    ]);
  }

  // --- 2. RENDER TABLE 1 (REPAYMENT) ---
  const table1Header = [
    [
      { text: "YEAR", width: colWidth, color: "#b91c1c", bold: true, fontSize },
      { text: "OPENING BALANCE", width: colWidth, color: "#b91c1c", bold: true, fontSize },
      { text: "EMI", width: colWidth, color: "#b91c1c", bold: true, fontSize },
      { text: "PRINCIPAL", width: colWidth, color: "#b91c1c", bold: true, fontSize },
      { text: "INTEREST", width: colWidth, color: "#b91c1c", bold: true, fontSize },
      { text: "CLOSING BALANCE", width: colWidth, color: "#b91c1c", bold: true, fontSize }
    ],
    ...yearlyRows
  ];

  drawFlexibleTable(doc, table1Header, { ...fonts, fontSize });
  doc.moveDown(2);

  // --- 3. RENDER TABLE 2 (INTEREST SUMMARY) ---
  const summaryWidth = 540 / (yearlyRows.length + 1);

  // Logic for CC Interest (Fixed based on Working Capital Loan)
  const ccInterestYearly = (projectData.loanDetails.workingCapitalLoan * (projectData.assumptions?.particulars?.interestRateCashCredit / 100));

  const summaryRows = [
    [
      { text: "PARTICULARS", width: summaryWidth, color: "#b91c1c", bold: true, fontSize },
      ...yearlyRows.map(r => ({ text: `FY ${r[0].text}`, width: summaryWidth, color: "#b91c1c", bold: true, fontSize }))
    ],
    [
      { text: "TERM LOAN INTEREST", width: summaryWidth, fontSize, bold: true, color: "#b91c1c" },
      ...yearlyRows.map(r => ({ text: `₹${(parseFloat(r[4].text.replace(/[^0-9.-]+/g, "")) / 1000).toFixed(1)}K`, width: summaryWidth, fontSize }))
    ],
    [
      { text: "CASH CREDIT INTEREST", width: summaryWidth, fontSize, bold: true, color: "#b91c1c" },
      ...yearlyRows.map(() => ({ text: `₹${(ccInterestYearly / 1000).toFixed(1)}K`, width: summaryWidth, fontSize }))
    ],
    [
      { text: "TOTAL INTEREST", width: summaryWidth, fontSize, bold: true, color: "#b91c1c" },
      ...yearlyRows.map(r => {
        const tlInt = parseFloat(r[4].text.replace(/[^0-9.-]+/g, ""));
        return { text: `₹${((tlInt + ccInterestYearly) / 1000).toFixed(1)}K`, width: summaryWidth, fontSize, bold: true };
      })
    ]
  ];

  drawFlexibleTable(doc, summaryRows, { ...fonts, fontSize });

  // --- 4. RENDER NOTES SECTION (Now safely at the bottom) ---
  doc.x = 72;
  // doc.moveDown(2); 

  doc.fontSize(8).fillColor("#000000");
  const notesOptions = { align: 'left', width: 500 };
  doc.fontSize(8).fillColor("#000000");
  doc.text(`1. Repayment term has been considered to be in equally monthly installment starting from ${loanData[0]?.date}`, notesOptions);
  doc.text(`2. Term Loan Interest has been considered @ ${projectData.assumptions?.particulars?.interestRateTermLoan} % p.a.`, notesOptions);
  doc.text(`3. Cash Credit Interest has been considered @ ${projectData.assumptions?.particulars?.interestRateCashCredit} % p.a.`, notesOptions);
  doc.moveDown(1);


};

export const drawLoanCalculation = (doc: any, projectData: any, formatrupee: Function, fonts: any) => {
  const loanScheduleArray = projectData.loanCalculation || [];
  if (loanScheduleArray.length === 0) return;

  const boldFontFamily = fonts?.bold;
  const regularFontFamily = fonts?.regular;



  const startXCoordinate = 30;
  let currentYCoordinate = 50;
  const summaryBoxWidth = 250;
  const standardRowHeight = 20;

  // --- 1. TERM LOAN VALUE (FROM LOAN DETAILS) ---

  const termLoanFromDetails = projectData.termLoan || (loanScheduleArray[0]?.openingBalance) || 0;
  currentYCoordinate += 30;

  // --- 2. SUMMARY BOXES ---
  const drawSummaryBox = (x: number, y: number, title: string, rows: [string, string][]) => {
    doc.rect(x, y, summaryBoxWidth, standardRowHeight).fill("#0f172a");
    if (boldFontFamily) doc.font(boldFontFamily);
    doc.fillColor("#ffffff").fontSize(9).text(title, x, y + 6, { width: summaryBoxWidth, align: "center" });

    let rowY = y + standardRowHeight;
    rows.forEach(([label, value]) => {
      doc.rect(x, rowY, summaryBoxWidth, standardRowHeight).strokeColor("#e5e7eb").lineWidth(0.5).stroke();
      if (regularFontFamily) doc.font(regularFontFamily);
      doc.fillColor("#374151").fontSize(8).text(label, x + 8, rowY + 6);
      doc.text(value, x + 120, rowY + 6, { width: 120, align: "center" });
      rowY += standardRowHeight;
    });
    return rowY;
  };

  const totalInterest = loanScheduleArray.reduce((s: number, e: any) => s + (e.interest || 0), 0);

  const inputRows: [string, string][] = [
    ["Term Loan Amount", `${formatrupee(termLoanFromDetails)}`],
    ["Interest Rate", `${projectData.interestRate || '11.1'}%`],
    ["Loan Tenure", `${projectData.loanPeriod || '5 Years'}`],
    ["Repayment Start", loanScheduleArray[0]?.date || 'N/A']
  ];

  const summaryRows: [string, string][] = [
    ["Monthly EMI", `${formatrupee(Math.round(loanScheduleArray[0]?.emi || 0))}`],
    ["Total EMIs", `${loanScheduleArray.length}`],
    ["Total Interest", `${formatrupee(Math.round(totalInterest))}`],
    ["Total Payable", `${formatrupee(Math.round(Number(termLoanFromDetails) + totalInterest))}`]
  ];

  const boxBottomY = drawSummaryBox(startXCoordinate, currentYCoordinate, "LOAN DETAILS", inputRows);
  drawSummaryBox(startXCoordinate + 265, currentYCoordinate, "REPAYMENT OVERVIEW", summaryRows);

  currentYCoordinate = boxBottomY + 40;

  // --- 3. TABLE SECTION (DATA PRINTING) ---
  if (boldFontFamily) doc.font(boldFontFamily);
  doc.fontSize(11).fillColor("#b91c1c").text("ANNEXURE: MONTHLY REPAYMENT SCHEDULE", startXCoordinate, currentYCoordinate);
  currentYCoordinate += 20;

  const colWidths = [35, 65, 85, 75, 75, 75, 95];

  const drawHeader = (yPos: number) => {
    doc.rect(startXCoordinate, yPos, 505, 18).fill("#f3f4f6").stroke("#e5e7eb");
    doc.fillColor("#b91c1c").fontSize(7);
    let xPos = startXCoordinate;
    const headers = ["MONTH", "DATE", "OPENING BAL", "EMI", "PRINCIPAL", "INTEREST", "CLOSING BAL"];
    headers.forEach((h, i) => {
      doc.text(h, xPos, yPos + 5, { width: colWidths[i], align: "center" });
      xPos += colWidths[i];
    });
    return yPos + 18;
  };

  currentYCoordinate = drawHeader(currentYCoordinate);

  // --- 4. LOOP FOR TABLE DATA ---
  loanScheduleArray.forEach((row: any) => {
    // Page break logic
    if (currentYCoordinate + 20 > doc.page.height - 50) {
      doc.addPage();
      currentYCoordinate = 50;
      currentYCoordinate = drawHeader(currentYCoordinate);
    }

    if (regularFontFamily) doc.font(regularFontFamily);
    doc.fillColor("#374151").fontSize(7);

    let xData = startXCoordinate;
    const values = [
      row.month.toString(),
      row.date || "-",
      formatrupee(row.openingBalance || 0),
      formatrupee(row.emi || 0),
      formatrupee(row.principal || 0),
      formatrupee(row.interest || 0),
      formatrupee(row.closingBalance || 0)
    ];

    values.forEach((val, i) => {
      doc.text(val, xData, currentYCoordinate + 5, {
        width: colWidths[i],
        align: "center"
      });
      xData += colWidths[i];
    });

    // Row Line
    doc.moveTo(startXCoordinate, currentYCoordinate + 18)
      .lineTo(startXCoordinate + 505, currentYCoordinate + 18)
      .strokeColor("#eeeeee").lineWidth(0.5).stroke();

    currentYCoordinate += 18;
  });

  doc.y = currentYCoordinate;
};