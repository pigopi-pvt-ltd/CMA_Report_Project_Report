"use client";

import { useEffect, useState } from "react";

// Sidebar
import { AppSidebar } from "@/components/sidebar/AppSidebar";

// Dashboard UI
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import DashboardSearch from "@/components/dashboard/DashboardSearch";
import DashboardCreateReportButton from "@/components/dashboard/DashboardCreateReportButton";
import ReportsKPI from "@/components/dashboard/ReportsKPI";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";

// Tables
import ProjectReports from "@/components/dashboard/ProjectReports";
import CMAReports from "@/components/dashboard/CMAReports";

// Graphs
import ProjectReportsGraph from "@/components/dashboard/ProjectReportsGraph";
import CMAReportsGraph from "@/components/dashboard/CMAReportsGraph";

// Data layer
import { getDashboardData } from "@/services/dashboard.service";
import { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"project" | "cma">("project");
  const [data, setData] = useState<DashboardData | null>(null);

  // 🔒 IMPORTANT:
  // Data fetch ko delay kiya gaya hai
  // taaki login redirect / auth flow disturb na ho
  useEffect(() => {
    const timer = setTimeout(() => {
      getDashboardData()
        .then(setData)
        .catch((err) => console.error("Dashboard data error:", err));
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 p-1">
        {/* Header */}
        <div className="p-3 mt-3">
          <h1 className="text-3xl font-bold text-foreground">
            REPORTS DASHBOARD
          </h1>
        </div>

        {/* Tabs + Graph + KPI */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4">
          {/* Tabs */}
          <DashboardTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Graph */}
          {activeTab === "project" && (
            <ProjectReportsGraph graphData={data.projectGraph} />
          )}
          {activeTab === "cma" && (
            <CMAReportsGraph graphData={data.cmaGraph} />
          )}

          {/* KPI */}
          <ReportsKPI kpi={data.kpi} />
        </div>

        {/* Search + Create */}
        {/* <div className="flex items-center justify-between px-4 mt-4">
          <DashboardSearch />
          <DashboardCreateReportButton />
        </div> */}

        {/* Tables */}
        <div className="mt-0 px-4">
          {activeTab === "project" && (
            <ProjectReports reports={data.projectReports} />
          )}
          {activeTab === "cma" && (
            <CMAReports reports={data.cmaReports} />
          )}
        </div>
             
      </div>
    </div>
  );
}
