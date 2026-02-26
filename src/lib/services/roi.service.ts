export function calculateROI(
  profitabilityStatement: any[],
  depreciationSchedule: any[],
  totalProjectCost: number,
  loanPeriod: number
) {
  const capitalEmployed = totalProjectCost;
  let totalReturnSum = 0;
  const returnOnInvestmentAnalysis: any[] = [];

  for (let i = 0; i < loanPeriod; i++) {
    const profit = profitabilityStatement[i];
    const depr = depreciationSchedule[i].totalDepreciationForYear;

    const yearlyReturn =
      profit.profitBeforeTax +
      depr +
      profit.interestOnTermLoan +
      profit.interestOnWorkingCapital;

    totalReturnSum += yearlyReturn;

    returnOnInvestmentAnalysis.push({
      year: profit.year,
      profitBeforeTax: profit.profitBeforeTax,
      depreciation: depr,
      interestOnTermLoan: profit.interestOnTermLoan,
      interestOnCC: profit.interestOnWorkingCapital,
      totalInvestment: yearlyReturn,
      AverageReturn: 0,
      CapitalEmployed: 0,
      ReturnOnInvestment: 0
    });
  }

  const averageReturn = totalReturnSum / loanPeriod;
  const finalROI = capitalEmployed === 0 ? 0 : (averageReturn / capitalEmployed) * 100;

  if (returnOnInvestmentAnalysis.length > 0) {
    returnOnInvestmentAnalysis[0].AverageReturn = averageReturn;
    returnOnInvestmentAnalysis[0].CapitalEmployed = capitalEmployed;
    returnOnInvestmentAnalysis[0].ReturnOnInvestment = finalROI;
  }

  return returnOnInvestmentAnalysis;
}
