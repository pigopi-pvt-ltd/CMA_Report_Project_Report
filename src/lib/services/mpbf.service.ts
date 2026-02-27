export function calculateMPBF(
    profitabilityStatement: any[],
    purchaseCostStatement: any[],
    depreciationSchedule: any[],
    workingCapitalLoan: number,
    loanPeriod: number
) {
    const mpbfAnalysis: any[] = [];

    for (let i = 0; i < loanPeriod; i++) {
        const profit = profitabilityStatement[i] || {};
        const purExp = purchaseCostStatement[i] || {};

        // Using a simplified version of expenses for mpbf if not fully available here, 
        // but originally it used generalExpensesStatement.
        // For now let's assume profit object has what we need or we can calculate.

        const inventory = Math.round((purExp.indigenous || 0) / 12);
        const receivables = Math.round((profit.totalA || 0) / 12);
        // cashInHand originally used genExp.totalGeneralExpenses / 24
        // We'll use profit.totalB (which includes interest and depr) or maybe just ops exp.
        // In original code: const cashInHand = Math.round((genExp.totalGeneralExpenses || 0) / 24);
        // totalGeneralExpenses = totalOpsExp + yearDepr
        const totalOpsExp = profit.totalB - profit.interestOnTermLoan - profit.interestOnWorkingCapital;
        const cashInHand = Math.round(totalOpsExp / 24);

        const totalCurrentAssets = inventory + receivables + cashInHand;

        const creditors = Math.round((purExp.indigenous || 0) / 24);
        const outstandingExp = Math.round(((profit.salary || 0) + (profit.rent || 0)) / 12);
        const bankBorrowing = Math.round(workingCapitalLoan);
        const otherCurrentLiabilities = creditors + outstandingExp;
        const totalCurrentLiabilities = otherCurrentLiabilities + bankBorrowing;

        const gap = totalCurrentAssets - otherCurrentLiabilities;
        mpbfAnalysis.push({
            year: profit.year,
            totalCurrentAssets,
            totalCurrentLiabilities,
            bankBorrowing,
            otherCurrentLiabilities,
            mpbfMethod1: gap > 0 ? Math.round(gap * 0.75) : 0,
            mpbfMethod2: Math.round((totalCurrentAssets * 0.75) - otherCurrentLiabilities) > 0 ? Math.round((totalCurrentAssets * 0.75) - otherCurrentLiabilities) : 0
        });
    }

    return mpbfAnalysis;
}
