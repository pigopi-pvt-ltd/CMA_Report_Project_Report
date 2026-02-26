export function calculateAFP(
  projectedBalanceSheet: any[]
) {
  const AFPTable: any[] = [];

  for (let i = 0; i < projectedBalanceSheet.length; i++) {
    const balanceSheet = projectedBalanceSheet[i];

    // Liabilities Side
    const capitalAndReserves = Number(balanceSheet.capital) || 0;
    const longTermLiabilities = Number(balanceSheet.termLoan) || 0;
    const currentLiabilities = (Number(balanceSheet.currentLiabilitiesAndProvision) || 0) + (Number(balanceSheet.cashCredit) || 0);
    const totalLiability = capitalAndReserves + longTermLiabilities + currentLiabilities;

    // Assets Side
    const fixedAssets = Number(balanceSheet.netFixedAssetsWDV) || 0;
    const nonCurrentAssets = 0;
    const currentAssets = (Number(balanceSheet.stockOfWIP) || 0) +
      (Number(balanceSheet.sundryDebtors) || 0) +
      (Number(balanceSheet.depositAndAdvance) || 0) +
      (Number(balanceSheet.cashAndBankBalance) || 0);
    const intangibleAssets = 0;
    const totalAssets = fixedAssets + nonCurrentAssets + currentAssets + intangibleAssets;

    AFPTable.push({
      year: balanceSheet.year.toString(),
      capitalAndReserves,
      longTermLiabilities,
      currentLiabilities,
      totalLiability,
      fixedAssets,
      nonCurrentAssets,
      currentAssets,
      intangibleAssets,
      totalAssets
    });
  }

  return AFPTable;
}
