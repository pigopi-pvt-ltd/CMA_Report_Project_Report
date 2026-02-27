// src/lib/services/depreciation.service.ts

export function calculateDepreciation(
  businessReq: any,
  loanPeriod: number
) {
  // Assets with their initial values and depreciation rates
  const assetsConfig = [
    { name: "Machinery", key: "machinery", rate: 0.15 },
    { name: "Land", key: "land", rate: 0.00 },
    { name: "Building", key: "building", rate: 0.10 },
    { name: "Computers", key: "computersAndAccessories", rate: 0.40 },
    { name: "Furniture", key: "furnituresAndFixtures", rate: 0.10 },
    { name: "Vehicle", key: "vehicle", rate: 0.15 },
    { name: "Software/Website/App", key: "softwareWebsiteAndApp", rate: 0.25 },
  ];

  // Only include assets with value > 0
  const activeAssets = assetsConfig
    .filter(a => (businessReq[a.key] || 0) > 0)
    .map(a => ({
      assetName: a.name,
      openingBalance: businessReq[a.key] || 0,
      rate: a.rate
    }));

  const result: any[] = [];
  const startYear = new Date().getFullYear();

  // Track running balances
  const balances = activeAssets.map(a => a.openingBalance);

  for (let i = 0; i < loanPeriod; i++) {
    let totalDepreciationForYear = 0;
    const yearAssets: any[] = [];

    activeAssets.forEach((asset, idx) => {
      const openingBalance = balances[idx];
      const addition = 0; // No new additions in projected years
      const total = openingBalance + addition;
      const depreciationAmount = Number((total * asset.rate).toFixed(2));
      const closingBalance = Number((total - depreciationAmount).toFixed(2));

      totalDepreciationForYear += depreciationAmount;
      balances[idx] = closingBalance;

      yearAssets.push({
        assetName: asset.assetName,
        openingBalance: Number(openingBalance.toFixed(2)),
        addition,
        total: Number(total.toFixed(2)),
        rate: asset.rate,
        depreciationAmount,
        closingBalance,
      });
    });

    result.push({
      year: startYear + i,
      assets: yearAssets,
      totalDepreciationForYear: Number(totalDepreciationForYear.toFixed(2)),
      // Keep backward-compat field too
      totalDepreciation: Number(totalDepreciationForYear.toFixed(2))
    });
  }

  return result;
}