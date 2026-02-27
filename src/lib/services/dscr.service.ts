export function calculateDSCR(
  profitabilityStatement: any[],
  depreciationSchedule: any[],
  loanData: any,
  costStatement: any[],
  loanPeriod: number
) {
  const dscrStatement: any[] = [];
  let totalDSCRSum = 0;

  for (let i = 0; i < loanPeriod; i++) {
    const profit = profitabilityStatement[i];
    const depr = depreciationSchedule[i].totalDepreciationForYear;
    const repayment = costStatement[i].principalRepayment || 0;

    // X = Profit + Depr + Interest
    const totalCashAccrual =
      profit.profitAfterTax +
      depr +
      profit.interestOnTermLoan +
      profit.interestOnWorkingCapital;

    // Y = Repayment + Interest
    const installmentOfTermLoan = repayment + profit.interestOnTermLoan;
    const totalDebtService = installmentOfTermLoan + profit.interestOnTermLoan + profit.interestOnWorkingCapital;

    const dscrRatio = totalDebtService === 0 ? 0 : Number((totalCashAccrual / totalDebtService).toFixed(2));

    totalDSCRSum += dscrRatio;

    dscrStatement.push({
      year: profit.year,
      netProfit: profit.profitAfterTax,
      depreciation: depr,
      interestOnTermLoan: profit.interestOnTermLoan,
      interestOnCC: profit.interestOnWorkingCapital,
      totalCashAccrual,
      loanRepayment: repayment,
      installmentOfTermLoan,
      totalDebtService,
      dscrRatio
    });
  }

  const averageDSCR = Number((totalDSCRSum / loanPeriod).toFixed(2));

  return {
    dscrStatement,
    averageDSCR
  };
}
