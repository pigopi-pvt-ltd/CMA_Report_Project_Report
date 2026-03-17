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

  //  The "Double Division" Catcher
  let actualGrowthRate = Number(yearlyGrowthRate);
  
  // If by mistake, user enters 0.08 instead of 8 for 8%, this will convert it to 8%
  if (actualGrowthRate > 0 && actualGrowthRate < 0.01) {
    actualGrowthRate = actualGrowthRate * 100;
  } 
  // If rate is given as 8 (percent) instead of 0.08, convert it to decimal
  else if (actualGrowthRate >= 1) {
    actualGrowthRate = actualGrowthRate / 100;
  }

  for (let i = 0; i < loanPeriod; i++) {
    result.push({
      year: startYear + i,
      totalRevenue: Math.round(annualRevenue) 
    });

    // Apply growth for next year
    annualRevenue = Number(annualRevenue) * (1 + actualGrowthRate);
  }

  return result;
}