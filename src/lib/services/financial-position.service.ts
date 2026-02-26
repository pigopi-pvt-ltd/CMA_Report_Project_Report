export function calculateFinancialPosition(
  profitabilityStatement: any[],
  ratioAnalysis: any[],
  projectedBalanceSheet: any[],
  loanPeriod: number
) {
  const financialPosition: any[] = [];

  for (let i = 0; i < loanPeriod; i++) {
    const profit = profitabilityStatement[i];
    const ratio = ratioAnalysis[i];
    const balanceSheet = projectedBalanceSheet[i];

    const profitAfterTax = Number(profit.profitAfterTax) || 0;
    const depreciation = Number(profit.yearDepreciation) || 0;
    const cashGeneration = profitAfterTax + depreciation;

    const totalAssets = Number(balanceSheet.totalAssets) || 0;
    const netFixedAssets = Number(balanceSheet.netFixedAssetsWDV) || 0;
    const currentLiabilities = Number(balanceSheet.currentLiabilitiesAndProvision) || 0;

    financialPosition.push({
      year: profit.year.toString(),
      netSales: Number(profit.totalA) || 0,
      netProfitAfterTax: profitAfterTax,
      cashGeneration: cashGeneration,
      netWorkingCapital: (totalAssets - netFixedAssets) - currentLiabilities,
      currentRatio: Number(ratio.currentRatio) || 0,
      totalNetWorth: Number(ratio.tnw) || 0,
      tolToTnwRatio: Number(ratio.tolToTnw) || 0,
      termLiabilityToTnwRatio: Number(ratio.termLiabilityToTnw) || 0
    });
  }

  return financialPosition;
}
