export function calculateGeneralExpenses(
  monthlyExpenses: Record<string, number>,
  loanPeriod: number
) {
  const yearlyExpenses: any[] = [];

  const yearlyTotal =
    Object.values(monthlyExpenses || {}).reduce(
      (sum, val) => sum + (val || 0),
      0
    ) * 12;

  const currentYear = new Date().getFullYear();

  for (let i = 0; i < loanPeriod; i++) {
    yearlyExpenses.push({
      year: currentYear + i,
      totalExpense: yearlyTotal,
    });
  }

  return yearlyExpenses;
}