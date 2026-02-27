// src/lib/services/growth.service.ts

export function generateCostStatement(
  salesRevenue: number,
  yearlyGrowthRate: number,
  loanPeriod: number,
  getYearlyPrincipal: (yr: number) => number
) {
  const annualSales = salesRevenue * 12;
  let sales = annualSales;

  const costStatement: any[] = [];
  let currentYearLabel = new Date().getFullYear();
  let currentGrowthFactor = 1;

  for (let index = 0; index < loanPeriod; index++) {
    const repaymentAmount = Math.round(getYearlyPrincipal(index + 1) || 0);

    costStatement.push({
      year: currentYearLabel,
      domesticSales: sales,
      subTotal: sales,
      netSales: sales,
      totalGrossIncome: sales,
      principalRepayment: repaymentAmount > 0 ? repaymentAmount : 0,
    });

    currentYearLabel++;

    if (index > 0) {
      currentGrowthFactor = currentGrowthFactor * (1 + yearlyGrowthRate);
    }

    sales = sales + sales * currentGrowthFactor;
  }

  return costStatement;
}