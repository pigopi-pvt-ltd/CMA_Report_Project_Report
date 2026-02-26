export function calculateSensitivity(
  profitabilityStatement: any[],
  purchaseCostStatement: any[],
  loanPeriod: number
) {
  const scenarioSalesDecrease: any[] = [];
  const scenarioVariableCostIncrease: any[] = [];
  const scenarioFixedCostIncrease: any[] = [];

  for (let i = 0; i < loanPeriod; i++) {
    const profit = profitabilityStatement[i];
    const purExp = purchaseCostStatement[i] || {};

    // Common values for calculation
    const sales = profit.totalA || 0;
    const varCostsBase = (purExp.indigenous || 0) + (purExp.freightAndOtherExpenses || 0);

    // Calculate total fixed costs used in original code logic
    // profit.totalB = expenses + interestCC + interestTL + depreciation
    // So fixed costs logic can be derived
    const depr = profit.yearDepreciation || 0;
    const interest = profit.interestOnTermLoan + (profit.interestOnWorkingCapital || 0);
    const fixedCostsBase = profit.totalB - varCostsBase - interest - depr;

    // 1. Scenario: Sales Decrease by 5%
    const s1_sales = Math.round(sales * 0.95);
    const s1_ebitda = s1_sales - (varCostsBase + fixedCostsBase);
    scenarioSalesDecrease.push({
      financialYear: profit.year,
      totalRevenueIncome: s1_sales,
      ebitdaValue: s1_ebitda,
      ebitValue: s1_ebitda - depr,
      profitBeforeTaxValue: (s1_ebitda - depr) - interest
    });

    // 2. Scenario: Variable Cost Increase by 5%
    const s2_varCosts = Math.round(varCostsBase * 1.05);
    const s2_ebitda = sales - (s2_varCosts + fixedCostsBase);
    scenarioVariableCostIncrease.push({
      financialYear: profit.year,
      totalRevenueIncome: sales,
      ebitdaValue: s2_ebitda,
      ebitValue: s2_ebitda - depr,
      profitBeforeTaxValue: (s2_ebitda - depr) - interest
    });

    // 3. Scenario: Fixed Cost Increase by 5%
    const s3_fixedCosts = Math.round(fixedCostsBase * 1.05);
    const s3_ebitda = sales - (varCostsBase + s3_fixedCosts);
    scenarioFixedCostIncrease.push({
      financialYear: profit.year,
      totalRevenueIncome: sales,
      ebitdaValue: s3_ebitda,
      ebitValue: s3_ebitda - depr,
      profitBeforeTaxValue: (s3_ebitda - depr) - interest
    });
  }

  return {
    scenarioSalesDecrease,
    scenarioVariableCostIncrease,
    scenarioFixedCostIncrease
  };
}
