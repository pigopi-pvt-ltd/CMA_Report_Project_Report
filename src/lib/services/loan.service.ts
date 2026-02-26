export function calculateLoanDetails(
  termLoan: number,
  workingCapitalLoan: number,
  annualRate: number,
  loanPeriodYears: number
) {
  const totalMonths = loanPeriodYears * 12;
  const monthlyRate = annualRate / 12 / 100;

  const emi =
    (termLoan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const loanCalculation: any[] = [];
  const monthlySchedule: { interest: number; principal: number }[] = [];

  let tempBalance = termLoan;
  const reportDate = new Date();

  for (let i = 1; i <= totalMonths; i++) {
    const interestM = tempBalance * monthlyRate;
    const principalM = emi - interestM;

    const paymentDate = new Date(
      reportDate.getFullYear(),
      reportDate.getMonth() + i + 1,
      0
    );

    monthlySchedule.push({
      interest: interestM,
      principal: principalM,
    });

    loanCalculation.push({
      month: i,
      date: paymentDate.toLocaleDateString("en-GB"),
      openingBalance: Math.round(tempBalance),
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(principalM * 100) / 100,
      interest: Math.round(interestM * 100) / 100,
      closingBalance: Math.round((tempBalance - principalM) * 100) / 100,
    });

    tempBalance -= principalM;
  }

  const getYearlyInterest = (yr: number) =>
    monthlySchedule
      .slice((yr - 1) * 12, yr * 12)
      .reduce((sum, m) => sum + m.interest, 0);

  const getYearlyPrincipal = (yr: number) =>
    monthlySchedule
      .slice((yr - 1) * 12, yr * 12)
      .reduce((sum, m) => sum + m.principal, 0);

  const loanInterestTablesDetail = [];
  for (let i = 0; i < loanCalculation.length; i += 12) {
    const yearChunk = loanCalculation.slice(i, i + 12);

    const yearPrincipal = yearChunk.reduce((sum, m) => sum + m.principal, 0);
    const yearInterest = yearChunk.reduce((sum, m) => sum + m.interest, 0);
    const totalEMI = yearChunk.reduce((sum, m) => sum + m.emi, 0);

    const ccInterest = Math.round(workingCapitalLoan * (annualRate / 100));

    loanInterestTablesDetail.push({
      year: yearChunk[0].date.split("/")[2],
      openingBalance: Math.round(yearChunk[0].openingBalance),
      emi: Math.round(totalEMI),
      principal: Math.round(yearPrincipal),
      interest: Math.round(yearInterest),
      closingBalance: Math.round(yearChunk[yearChunk.length - 1].closingBalance),
      ccInterest: ccInterest,
      totalInterest: Math.round(yearInterest + ccInterest),
    });
  }

  return {
    emi,
    loanCalculation,
    loanInterestTablesDetail,
    getYearlyInterest,
    getYearlyPrincipal,
  };
}

