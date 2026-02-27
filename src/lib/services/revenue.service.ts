export function calculateRevenue(
  salesRevenue: number,
  salesType: string,
  yearlyGrowthRate: number,
  loanPeriod: number
) {
  const result: any[] = [];

  let annualRevenue =
    salesType === "monthly"
      ? salesRevenue * 12
      : salesRevenue;

  const startYear = new Date().getFullYear();

  for (let i = 0; i < loanPeriod; i++) {
    result.push({
      year: startYear + i,
      totalRevenue: Number(annualRevenue.toFixed(2))
    });

    annualRevenue =
      annualRevenue * (1 + yearlyGrowthRate);
  }

  return result;
}