"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, Pencil, Trash } from "lucide-react";
import DashboardCreateReportButton from "./DashboardCreateReportButton";
import DashboardSearch from "./DashboardSearch";

/* ================= TYPES ================= */

type CMAReport = {
  id: string;
  name: string;
  createdAt: string;
};

/* ================= COMPONENT ================= */

export default function CMAReports({
  reports,
}: {
  reports: CMAReport[]; // ✅ DashboardPage se aane wala dynamic data
}) {
  return (
    <div className="p-1 w-full">
      <Card className="w-full bg-card">
        {/* ================= HEADER ================= */}
        <CardHeader className="pt-2 pb-2 -mt-5">
          <CardTitle className="flex items-center justify-between w-full text-md">
            <span className="font-semibold">CMA REPORTS</span>

            {/* Search + Create */}
            <div className="flex items-center gap-3">
              <DashboardSearch />
              <DashboardCreateReportButton />
            </div>
          </CardTitle>
        </CardHeader>

        {/* ================= TABLE ================= */}
        <CardContent className="pt-2">
          <div className="overflow-x-auto -mt-10">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left"></th>
                  <th className="px-4 py-3 text-left">REPORT NAME</th>
                  <th className="px-4 py-3 text-left">CREATED DATE</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report.id} className="border-b">
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 p-2"
                        >
                          <ArrowDown
                            className="h-5 w-5 text-white"
                            strokeWidth={3}
                          />
                        </Button>
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {report.name}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {report.createdAt}
                      </td>

                      <td className="px-4 py-3 flex justify-end gap-2">
                        <Button size="sm" variant="secondary">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No CMA reports found. Click{" "}
                      <b>Create CMA Report</b> to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
