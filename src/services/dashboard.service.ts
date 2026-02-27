import reportsData from "@/data/reports.json";
import { DashboardData } from "@/types/dashboard";
import axios from "axios";

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
  let projectReports: { id: string; name: string; createdAt: string }[] = [];
  let cmaReports: { id: string; name: string; createdAt: string }[] = [];

  try {
    const [projectRes, cmaRes] = await Promise.all([
      axios.get("/api/get-report", { withCredentials: true }),
      axios.get("/api/get-cma-reports", { withCredentials: true })
    ]);
    projectReports = projectRes.data.data || [];
    cmaReports = cmaRes.data.data || [];
  } catch (err) {
    console.warn("Failed to fetch dashboard reports from API, falling back to empty list.", err);
  }

  const totalReports = projectReports.length + cmaReports.length;
  const today = new Date().toISOString().split("T")[0];

  const todayReports = [...projectReports, ...cmaReports].filter(
    (r) => r.createdAt === today
  ).length;

  return {
    projectReports,
    cmaReports,

    projectGraph: getMonthWiseCount(projectReports),
    cmaGraph: getMonthWiseCount(cmaReports),

    kpi: {
      totalReports,
      todayReports,
    },
  };
}
