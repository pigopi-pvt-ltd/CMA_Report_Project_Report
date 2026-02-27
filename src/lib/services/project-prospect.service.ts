// src/lib/services/project-prospect.service.ts

export function generateProjectProspects(
  industryType: string,
  averageDSCR: number
) {
  let riskLevel = "Moderate";

  if (averageDSCR > 1.5) riskLevel = "Low";
  if (averageDSCR < 1.2) riskLevel = "High";

  return {
    industryType,
    averageDSCR,
    riskLevel,
    summary:
      `This project in ${industryType} sector shows an average DSCR of ${averageDSCR}.
       Based on projections, financial risk level is ${riskLevel}.`
  };
}