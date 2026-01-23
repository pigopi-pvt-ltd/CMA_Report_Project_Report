import reportsData from "@/data/reports.json";
import { DashboardData } from "@/types/dashboard";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getMonthWiseCount(reports: { createdAt: string }[]) {
  const map = new Map<string, number>();

  reports.forEach((r) => {
    const date = new Date(r.createdAt);
    const month = MONTHS[date.getMonth()];
    map.set(month, (map.get(month) || 0) + 1);
  });

  return MONTHS.map((month) => ({
    month,
    count: map.get(month) ?? 0,
  }));
}

export async function getDashboardData(): Promise<DashboardData> {
  const totalReports =
    reportsData.projectReports.length +
    reportsData.cmaReports.length;

  const today = new Date().toISOString().split("T")[0];

  const todayReports =
    [...reportsData.projectReports, ...reportsData.cmaReports]
      .filter(r => r.createdAt === today).length;

  return {
    projectReports: reportsData.projectReports,
    cmaReports: reportsData.cmaReports,

    // ✅ DYNAMIC GRAPH DATA
    projectGraph: getMonthWiseCount(reportsData.projectReports),
    cmaGraph: getMonthWiseCount(reportsData.cmaReports),

    kpi: {
      totalReports,
      todayReports,
    },
  };
}
