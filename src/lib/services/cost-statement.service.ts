export function generateCostStatement(
  revenueData: any[],
  loanData: any
) {
  return revenueData.map((r, index) => {
    const repaymentAmount = Math.round(loanData.getYearlyPrincipal(index + 1) || 0);
    return {
      year: r.year,
      domesticSales: r.totalRevenue,
      subTotal: r.totalRevenue,
      netSales: r.totalRevenue,
      totalGrossIncome: r.totalRevenue,
      principalRepayment: repaymentAmount > 0 ? repaymentAmount : 0
    };
  });
}
