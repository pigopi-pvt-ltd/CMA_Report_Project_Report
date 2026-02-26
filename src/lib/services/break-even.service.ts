export function calculateBreakEven(
  profitabilityStatement: any[]
) {
  const breakEvenAnalysis: any[] = [];

  for (let i = 0; i < profitabilityStatement.length; i++) {
    const p = profitabilityStatement[i];

    // 1. VARIABLE COSTS MAPPING
    const varCosts = {
      purchaseEquipments: p.totalPurchaseEquipment || 0,
      purchaseRawMaterials: p.rawMaterialConsumed || 0,
      freight: p.freight || 0,
      powerFuel: p.powerAndFuel || 0,
      printingStationery: p.printingAndStationery || 0,
      electricityExpenses: p.electricityExpenses || 0,
      miscExpenses: p.miscellaneousExpenses || 0,
      otherExpenses: p.otherExpenses || 0,
      postageCourier: p.postageCourier || 0,
      repairMaintenance: p.repairAndMaintenance || 0,
    };

    const vTotal = Object.values(varCosts).reduce((a, b: any) => a + (Number(b) || 0), 0);

    // 2. FIXED COSTS MAPPING
    const fixedCostsData = {
      rent: p.rent || 0,
      salaryWages: p.salary || 0,
      interestTermLoan: p.interestOnTermLoan || 0,
      interestCCLoan: p.interestOnWorkingCapital || 0,
      advertisement: p.advertisement || 0,
      depreciation: p.yearDepreciation || 0,
      staffWelfare: p.staffWelfare || 0,
      transportConvenyance: p.transportAndConveyance || 0,
    };

    const fTotal = Object.values(fixedCostsData).reduce((a, b: any) => a + (Number(b) || 0), 0);

    const sales = p.totalA || 0;
    const contribution = sales - vTotal;
    const pvRatio = sales > 0 ? (contribution / sales) * 100 : 0;
    const bepSales = pvRatio > 0 ? (fTotal / (pvRatio / 100)) : 0;
    const fixedCostWithoutDepr = fTotal - (p.yearDepreciation || 0);
    const cashBep = pvRatio > 0 ? (fixedCostWithoutDepr / (pvRatio / 100)) : 0;

    breakEvenAnalysis.push({
      year: p.year,
      revenueSales: sales,
      variableCostTotal: vTotal,
      fixedCostTotal: fTotal,
      contribution: contribution,
      pvRatio: parseFloat(pvRatio.toFixed(2)),
      breakEvenSales: Math.round(bepSales),
      cashBreakEven: Math.round(cashBep),
      ...fixedCostsData,
      fixedCostWithoutDepr: fixedCostWithoutDepr,
      ...varCosts
    });
  }

  return breakEvenAnalysis;
}
