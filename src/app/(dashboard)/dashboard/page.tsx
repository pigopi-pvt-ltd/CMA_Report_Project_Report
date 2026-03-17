"use client";

import { useEffect, useState, Suspense } from "react";

// Sidebar
import { AppSidebar } from "@/components/sidebar/AppSidebar";

// Dashboard UI
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import ReportsKPI from "@/components/dashboard/ReportsKPI";

// Tables
import ProjectReports from "@/components/dashboard/ProjectReports";
import CMAReports from "@/components/dashboard/CMAReports";

// Graphs
import ProjectReportsGraph from "@/components/dashboard/ProjectReportsGraph";
import CMAReportsGraph from "@/components/dashboard/CMAReportsGraph";

// Data layer
import { getDashboardData } from "@/services/dashboard.service";
import { DashboardData } from "@/types/dashboard";

import { useSearchParams } from "next/navigation";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "cma" ? "cma" : "project";

  const [activeTab, setActiveTab] = useState<"project" | "cma">(initialTab);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData()
      .then((res) => setData(res))
      .catch((err) => console.error("Dashboard data error:", err));
  }, []);

  // Sync tab with URL if needed (optional, but good for back button)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "cma") setActiveTab("cma");
    if (tab === "project") setActiveTab("project");
  }, [searchParams]);

// Loading State
  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-muted/10">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      {/* <AppSidebar /> */}

      {/*  Main Content */}
      <div className="flex-1 h-full overflow-y-auto bg-muted/10 pb-12">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground uppercase">
              Reports Dashboard
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
            <DashboardTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>


          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Graph */}
            <div className="xl:col-span-2 flex flex-col h-full rounded-2xl shadow-sm border border-border/50 overflow-hidden bg-card">
              {activeTab === "project" && (
                <ProjectReportsGraph graphData={data.projectGraph} />
              )}
              {activeTab === "cma" && (
                <CMAReportsGraph graphData={data.cmaGraph} />
              )}
            </div>

            {/* KPI */}
            <div className="xl:col-span-1 flex flex-col h-full">
              <ReportsKPI kpi={data.kpi} />
            </div>
          </div>

          {/* Tables */}
          <div className="w-full rounded-2xl shadow-sm border border-border/50 overflow-hidden bg-card mt-4">
            {activeTab === "project" && (
              <ProjectReports reports={data.projectReports} />
            )}
            {activeTab === "cma" && (
              <CMAReports reports={data.cmaReports} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-screen bg-muted/10">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
