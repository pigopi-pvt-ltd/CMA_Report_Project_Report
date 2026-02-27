// src/lib/services/capital.service.ts

export function calculateCapital(businessReq: Record<string, number | undefined>) {
  
  const fixedCapitalInvested = Object.entries(businessReq)
    .filter(([key, value]) => key !== "workingExpenses" && typeof value === "number")
    .reduce((sum, [, value]) => sum + (value || 0), 0);

  const workingCapitalInvested = businessReq.workingExpenses || 0;

  const totalProjectCost = fixedCapitalInvested + workingCapitalInvested;

  return {
    fixedCapitalInvested,
    workingCapitalInvested,
    totalProjectCost
  };
}