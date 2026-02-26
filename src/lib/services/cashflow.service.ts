export function calculateCashFlow(
  profitabilityStatement: any[],
  depreciationSchedule: any[],
  projectedBalanceSheet: any[],
  totalProjectCost: number,
  termLoan: number,
  workingCapitalLoan: number,
  fixedCapitalInvested: number
) {
  const projectedCashFlow: any[] = [];
  let runningCashBalance = 0;

  for (let i = 0; i < profitabilityStatement.length; i++) {
    const profit = profitabilityStatement[i];
    const balanceSheet = projectedBalanceSheet[i];
    const previousBalanceSheet = i > 0 ? projectedBalanceSheet[i - 1] : null;

    // SOURCES [A]
    const pbit = profit.profitBeforeTax + profit.interestOnTermLoan + (profit.interestOnWorkingCapital || 0);
    const depreciation = profit.yearDepreciation;
    const increaseInCapital = i === 0 ? (totalProjectCost * 0.10) : 0;
    const increaseInTermLoan = i === 0 ? termLoan : 0;
    const increaseInCashCredit = i === 0 ? workingCapitalLoan : 0;

    const decreaseInDebtors = i > 0 ? Math.max(0, (previousBalanceSheet?.sundryDebtors || 0) - (balanceSheet?.sundryDebtors || 0)) : 0;
    const decreaseInStock = i > 0 ? Math.max(0, (previousBalanceSheet?.stockOfWIP || 0) - (balanceSheet?.stockOfWIP || 0)) : 0;
    const provisions = 0;
    const decreaseInAdvanceDeposits = 0;

    const totalA = pbit + depreciation + increaseInCapital + increaseInTermLoan + increaseInCashCredit + decreaseInAdvanceDeposits + decreaseInDebtors + provisions + decreaseInStock;

    // USES [B]
    const increaseInFixedAssets = i === 0 ? fixedCapitalInvested : 0;
    const interestOnBankLoan = profit.interestOnTermLoan + (profit.interestOnWorkingCapital || 0);
    const drawing = i === 0 ? 0 : Math.round(profit.profitAfterTax * 0.20);
    const taxPayment = profit.provisionForTaxation || 0;

    const totalB = increaseInFixedAssets + interestOnBankLoan + drawing + taxPayment;

    const netSurplusDeficit = totalA - totalB;
    const openCashBalance = Math.round(runningCashBalance);
    const closingCashBalance = Math.round(openCashBalance + netSurplusDeficit);

    projectedCashFlow.push({
      year: profit.year,
      pbit,
      depreciation,
      increaseInCapital,
      increaseInTermLoan,
      increaseInCashCredit,
      decreaseInAdvanceDeposits,
      decreaseInDebtors,
      provisions,
      decreaseInStock,
      totalA,
      increaseInFixedAssets,
      interestOnBankLoan,
      drawing,
      taxPayment,
      totalB,
      openCashBalance,
      netSurplusDeficit,
      closingCashBalance
    });

    runningCashBalance = closingCashBalance;
  }

  return projectedCashFlow;
}
