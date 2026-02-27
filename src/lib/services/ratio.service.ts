export function calculateRatios(
  profitabilityStatement: any[],
  depreciationSchedule: any[],
  mpbfAnalysis: any[],
  costStatement: any[],
  termLoan: number,
  totalProjectCost: number,
  fixedCapitalInvested: number,
  loanPeriod: number
) {
  const ratioAnalysis: any[] = [];
  let cumulativeRepayment = 0;

  for (let i = 0; i < loanPeriod; i++) {
    const profit = profitabilityStatement[i];
    const depr = depreciationSchedule[i]?.totalDepreciationForYear || 0;
    const mpbf = mpbfAnalysis[i];
    const currentSales = profit.totalA || 0;
    const currentNetProfit = profit.profitAfterTax || 0;

    // PBIT & Interest
    const pbit = profit.profitBeforeTax + profit.interestOnTermLoan + (profit.interestOnWorkingCapital || 0);
    const intTL_Y = profit.interestOnTermLoan || 0;
    const intCC_Y = profit.interestOnWorkingCapital || 0;
    const totalY = intTL_Y + intCC_Y;

    // Ratios
    const iscr = totalY === 0 ? 0 : pbit / totalY;
    const netProfitToSales = currentSales === 0 ? 0 : (currentNetProfit / currentSales) * 100;

    // Term Loan Balance Logic
    cumulativeRepayment += costStatement[i].principalRepayment || 0;
    const currentTermLoanBalance = Math.max(0, termLoan - cumulativeRepayment);

    // Assets & Liabilities
    const currentAssets = mpbf.totalCurrentAssets || 0;
    const currentLiabs = mpbf.totalCurrentLiabilities || 0;
    const totalAssets = currentAssets + fixedCapitalInvested;

    const currentRatio = currentLiabs === 0 ? 0 : currentAssets / currentLiabs;

    // Net Worth Calculation
    const totalAccumulatedProfit = profitabilityStatement
      .slice(0, i + 1)
      .reduce((sum, p) => sum + p.profitAfterTax, 0);

    const tnw = (totalProjectCost * 0.10) + totalAccumulatedProfit; // 10% promoter contribution
    const tol = currentTermLoanBalance + currentLiabs;

    ratioAnalysis.push({
      year: profit.year,
      netProfit: currentNetProfit,                      // 1
      interestOnTermLoan: intTL_Y,                      // 2
      interestOnCC: intCC_Y,                            // 3
      provisionForTaxation: profit.provisionForTaxation, // 4
      totalPbit: pbit,                                  // 5
      interestOnTermLoanY: intTL_Y,                     // 6
      interestOnCCY: intCC_Y,                           // 7
      totalInterestY: totalY,                           // 8
      iscr: iscr,                                       // 9
      netProfitXY: currentNetProfit, // 10
      revenueIncome: currentSales,                      // 11
      netProfitToSales: netProfitToSales,               // 12
      pbit: pbit,                                       // 13
      depreciation: depr,                               // 14
      pbdit: pbit + depr,                               // 15
      totalAssets: totalAssets,                         // 16
      profitToTotalAssetsRatio: totalAssets === 0 ? 0 : pbit / totalAssets, // 17
      netSales: currentSales,                           // 18
      termLoanBalance: currentTermLoanBalance,          // 19
      cashCredit: mpbf.bankBorrowing || 0,              // 20
      totalBankBorrowing: currentTermLoanBalance + (mpbf.bankBorrowing || 0), // 21
      netSalesToBankBorrowing: (mpbf.bankBorrowing || 0) === 0 ? 0 : currentSales / mpbf.bankBorrowing, // 22
      currentAssets: currentAssets,                     // 23
      currentLiabilities: currentLiabs,                 // 24
      currentAssetRatio: currentRatio,                  // 25
      netCapitalWorth: currentAssets - currentLiabs,    // 26
      currentRatio: currentRatio,                       // 27
      tnw: tnw,                                         // 28
      tol: tol,                                         // 29
      tolToTnw: tnw === 0 ? 0 : tol / tnw,              // 30
      termLiabilities: currentTermLoanBalance,          // 31
      termLiabilityToTnw: tnw === 0 ? 0 : currentTermLoanBalance / tnw // 32
    });
  }

  return ratioAnalysis;
}
