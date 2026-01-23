export type Report = {
    id: string;
    name: string;
    createdAt: string;
};

export type GraphItem = {
    month: string;
    count: number;
};

export type KPIData = {
    totalReports: number;
    todayReports: number;
};

export type DashboardData = {
    projectReports: Report[];
    cmaReports: Report[];
    projectGraph: GraphItem[];
    cmaGraph: GraphItem[];
    kpi: KPIData;
};
