export function calculateEBITDA(
  profitabilityStatement: any[],
  depreciationSchedule: any[]
) {
  return profitabilityStatement.map((profit, i) => {
    const depr = depreciationSchedule[i]?.totalDepreciationForYear || 0;

    const ebidta = profit.netCredit + profit.provisionForTaxation + profit.interestOnTermLoan + profit.interestOnWorkingCapital + depr;
    const ebit = ebidta - depr;

    return {
      year: profit.year,
      netIncome: profit.netCredit,
      taxExpense: profit.provisionForTaxation,
      interestOnTermLoan: profit.interestOnTermLoan,
      interestOnCC: profit.interestOnWorkingCapital,
      depreciation: depr,
      ebit: ebit,
      ebidta: ebidta
    };
  });
}
