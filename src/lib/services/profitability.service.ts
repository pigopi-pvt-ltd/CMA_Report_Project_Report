export function calculateProfitability(
  costStatement: any[],
  monthExp: any,
  depreciationSchedule: any[],
  loanData: any,
  workingCapitalLoan: number,
  interestRate: number,
  yearlyGrowthRate: number
) {
  const profitabilityStatement: any[] = [];
  
  // The "Double Division" Catcher (Same as Revenue file)
  let actualGrowthRate = Number(yearlyGrowthRate);
  if (actualGrowthRate > 0 && actualGrowthRate < 0.01) {
    actualGrowthRate = actualGrowthRate * 100;
  } else if (actualGrowthRate >= 1) {
    actualGrowthRate = actualGrowthRate / 100;
  }

  let currentGrowthFactor = 1;

  for (let i = 0; i < costStatement.length; i++) {
    if (i > 0) {
      // now it will correctly apply the growth factor year on year, so if user enters 10% growth, it will be 1.1 for first year, then 1.21 for second year, and so on.
      currentGrowthFactor = currentGrowthFactor * (1 + actualGrowthRate);
    }

    const calcAnn = (val: number | undefined) => Math.round((val || 0) * 12 * currentGrowthFactor);
    const totalA = costStatement[i].totalGrossIncome || 0;

    const yearExp = {
      salary: calcAnn(monthExp.salary),
      totalPurchaseEquipment: calcAnn(monthExp.purchaseOfEquipments),
      powerAndFuel: calcAnn(monthExp.powerAndFuel),
      printingAndStationery: calcAnn(monthExp.printingAndStationery),
      advertisement: calcAnn(monthExp.advertisement),
      miscellaneousExpenses: calcAnn(monthExp.miscellaneousExpenses),
      otherExpenses: calcAnn(monthExp.otherExpenses),
      postageAndCourier: calcAnn(monthExp.postageAndCourier),
      transportAndConveyance: calcAnn(monthExp.transportAndConveyance),
      staffWelfare: calcAnn(monthExp.staffWelfare),
      repairAndMaintenance: calcAnn(monthExp.repairAndMaintenance),
      rent: calcAnn(monthExp.rent),
      electricityExpenses: calcAnn(monthExp.electricityExpenses),
    };

    const interestOnTermLoan = Math.round(loanData.getYearlyInterest(i + 1));
    const interestOnWorkingCapital = Math.round(workingCapitalLoan * interestRate);
    const yearDepreciation = depreciationSchedule[i]?.totalDepreciationForYear || 0;

    const totalB = Object.values(yearExp).reduce((a, b: any) => a + (Number(b) || 0), 0) +
      interestOnWorkingCapital +
      interestOnTermLoan +
      yearDepreciation;

    const netCredit = totalA - totalB;

    const profitBeforeTax = netCredit;
    const provisionForTaxation = profitBeforeTax > 0 ? Math.round(profitBeforeTax * 0.30) : 0;
    const profitAfterTax = profitBeforeTax - provisionForTaxation;

    profitabilityStatement.push({
      year: costStatement[i].year,
      totalGrossIncome: totalA,
      totalA,
      ...yearExp,
      totalB,
      netCredit,
      interestOnTermLoan,
      interestOnWorkingCapital,
      yearDepreciation,
      profitBeforeTax,
      provisionForTaxation,
      profitAfterTax,
      balanceCarriedOverToBalanceSheet: profitAfterTax
    });
  }

  return profitabilityStatement;
}
