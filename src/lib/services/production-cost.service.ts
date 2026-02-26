export function calculateProductionCost(
    costStatement: any[],
    fixedCapitalInvested: number,
    yearlyGrowthRate: number,
    loanPeriod: number,
    businessReq: any = {}
) {
    let purchaseYear = new Date().getFullYear();
    const purchaseCostStatement: any[] = [];
    let currentGrowthFactor = 1;

    // Get base raw material cost from requirements if available
    const rawMaterialBase = (typeof businessReq.get === 'function'
        ? businessReq.get('rawMaterials')
        : businessReq.rawMaterials) || 0;

    const consumableBase = (typeof businessReq.get === 'function'
        ? businessReq.get('consumablesStocks')
        : businessReq.consumablesStocks) || 0;

    const baseCost = rawMaterialBase + consumableBase;

    for (let i = 0; i < loanPeriod; i++) {
        const currentYearSales = costStatement[i].netSales;
        if (i > 0) {
            currentGrowthFactor = currentGrowthFactor * (1 + yearlyGrowthRate);
        }

        // Logic: If user provided base cost, use it and grow it. 
        // Otherwise, assume 40% of sales is material cost.
        let indigenous = baseCost > 0
            ? baseCost * currentGrowthFactor
            : currentYearSales * 0.4;

        // 1. Freight & Direct Expenses (Assume 1% of materials)
        const freightAndOtherExpenses = Math.round(indigenous * 0.01);
        const totalDirectExpenses = freightAndOtherExpenses;
        const subTotal = indigenous + totalDirectExpenses;

        // 2. Work In Progress (WIP) Logic (Assume 2% of inventory)
        const openingStockOfWIP = i === 0 ? 0 : Math.round(subTotal * 0.02);
        const subTotalAfterOpeningStock = subTotal + openingStockOfWIP;
        const closingStockOfWIP = Math.round(subTotal * 0.02);

        // 3. Cost of Production
        const totalCostOfProduction = subTotalAfterOpeningStock - closingStockOfWIP;

        // 4. Finished Goods Logic (Assume 3% of production)
        const openingStockOfFinishedGoods = i === 0 ? 0 : Math.round(totalCostOfProduction * 0.03);
        const subTotalAfterOpeningStockFinishedGoods = totalCostOfProduction + openingStockOfFinishedGoods;
        const closingStockOfFinishedGoods = Math.round(totalCostOfProduction * 0.03);

        // 5. Final Cost of Sales & Profit
        const totalCostOfSales = subTotalAfterOpeningStockFinishedGoods - closingStockOfFinishedGoods;
        const grossProfit = currentYearSales - totalCostOfSales;

        purchaseCostStatement.push({
            year: purchaseYear + i,
            imported: 0,
            indigenous: Math.round(indigenous),
            freightAndOtherExpenses,
            totalDirectExpenses,
            subTotal: Math.round(subTotal),
            openingStockOfWIP,
            subTotalAfterOpeningStock: Math.round(subTotalAfterOpeningStock),
            closingStockOfWIP,
            totalCostOfProduction: Math.round(totalCostOfProduction),
            openingStockOfFinishedGoods,
            subTotalAfterOpeningStockFinishedGoods: Math.round(subTotalAfterOpeningStockFinishedGoods),
            closingStockOfFinishedGoods,
            totalCostOfSales: Math.round(totalCostOfSales),
            grossProfit: Math.round(grossProfit)
        });
    }

    return purchaseCostStatement;
}
