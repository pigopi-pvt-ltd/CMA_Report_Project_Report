"use client";

import { cn } from "@/lib/utils";

type TabType = "project" | "cma";

type Props = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

export default function DashboardTabs({
  activeTab,
  onTabChange,
}: Props) {
  return (
    <div className="inline-flex rounded-lg border  bg-muted p-1">
      <button
        onClick={() => onTabChange("project")}
        className={cn(
          "px-4 py-2 text-text font-bold rounded-md transition",
          activeTab === "project"
            ? "bg-primary text-primary-foreground shadow"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        PROJECT REPORTS
      </button>

      <button
        onClick={() => onTabChange("cma")}
        className={cn(
          "px-5 py-3 text-text font-bold bg-green rounded-md transition",
          activeTab === "cma"
            ? "bg-green-600 text-white shadow"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        CMA REPORTS
      </button>
    </div>
  );
}
