export function calculateBalanceSheet(
  initialCapitalBalance: number,
  profitabilityStatement: any[],
  depreciationSchedule: any[],
  loanCalculation: any[],
  workingCapitalLoan: number,
  purchaseCostStatement: any[]
) {
  const projectedBalanceSheet: any[] = [];
  let currentCapitalBalance = initialCapitalBalance;

  for (let i = 0; i < profitabilityStatement.length; i++) {
    const profit = profitabilityStatement[i];
    const deprYear = depreciationSchedule[i];

    // Get year-end loan balance from loanCalculation
    // loanCalculation is monthly, so we take index (i+1)*12 - 1
    const yearlyLoanData = loanCalculation[(i + 1) * 12 - 1] || {};

    // --- LIABILITIES SIDE CALCULATIONS ---
    const profitDuringYear = profit.profitAfterTax || 0;
    const drawings = i === 0 ? 0 : Math.round(profitDuringYear * 0.20);
    const termLoanBalance = yearlyLoanData.closingBalance || 0;
    const cashCredit = workingCapitalLoan || 0;
    const provisionForTax = profit.provisionForTaxation || 0;

    const currentLiabilitiesAndProv = 0;
    const totalLiabilities =
      currentCapitalBalance +
      profitDuringYear -
      drawings +
      termLoanBalance +
      cashCredit +
      currentLiabilitiesAndProv +
      provisionForTax;

    // --- ASSETS SIDE CALCULATIONS ---
    const netFixedAssetsWDV = deprYear ? deprYear.assets.reduce((sum: number, asset: any) => sum + asset.closingBalance, 0) : 0;
    const stockOfWIP = Math.round((purchaseCostStatement[i]?.closingStockOfWIP || 0) + (purchaseCostStatement[i]?.closingStockOfFinishedGoods || 0));
    const sundryDebtors = 0;
    const depositAndAdvance = 0;
    let cashAndBankBalance = totalLiabilities - (netFixedAssetsWDV + stockOfWIP + sundryDebtors + depositAndAdvance);

    if (cashAndBankBalance < 0) cashAndBankBalance = 10000;

    const totalAssets = netFixedAssetsWDV + stockOfWIP + sundryDebtors + depositAndAdvance + cashAndBankBalance;

    projectedBalanceSheet.push({
      year: profit.year,
      capital: Math.round(currentCapitalBalance),
      addProfitDuringYear: Math.round(profitDuringYear),
      lessDrawings: Math.round(drawings),
      termLoan: Math.round(termLoanBalance),
      cashCredit: Math.round(cashCredit),
      currentLiabilitiesAndProvision: Math.round(currentLiabilitiesAndProv),
      provisionForTax: Math.round(provisionForTax),
      totalLiabilities: Math.round(totalLiabilities),
      netFixedAssetsWDV: Math.round(netFixedAssetsWDV),
      stockOfWIP: Math.round(stockOfWIP),
      sundryDebtors: Math.round(sundryDebtors),
      depositAndAdvance: depositAndAdvance,
      cashAndBankBalance: Math.round(cashAndBankBalance),
      totalAssets: Math.round(totalAssets)
    });

    currentCapitalBalance = (currentCapitalBalance + profitDuringYear) - drawings;
  }

  return projectedBalanceSheet;
}
