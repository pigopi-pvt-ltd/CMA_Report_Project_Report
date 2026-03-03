export function calculateRevenue(
  salesRevenue: number | string | undefined,
  salesType: string,
  yearlyGrowthRate: number,
  loanPeriod: number
) {
  const result: any[] = [];

  const annualRevenueInitial =
    salesType === "monthly"
      ? Number(salesRevenue) * 12
      : Number(salesRevenue);
  let annualRevenue = annualRevenueInitial || 0;

  const startYear = new Date().getFullYear();

  for (let i = 0; i < loanPeriod; i++) {
    result.push({
      year: startYear + i,
      totalRevenue: Number(annualRevenue.toFixed(2))
    });

    annualRevenue =
      Number(annualRevenue) * (1 + yearlyGrowthRate);
  }

  return result;
}