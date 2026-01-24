"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  ArrowDown,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardSearch from "./DashboardSearch";
import DashboardCreateReportButton from "./DashboardCreateReportButton";

/* ================= TYPES ================= */

type ProjectReport = {
  id: string;
  name: string;
  createdAt: string;
};

/* ================= COMPONENT ================= */

export default function ProjectReports({
  reports,
}: {
  reports: ProjectReport[];
}) {
  /* ================= PAGINATION STATE ================= */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const totalReports = reports.length;

  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalReports);

  const visibleReports = reports.slice(startIndex, endIndex);

  const totalPages = Math.ceil(totalReports / rowsPerPage);
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  // reset page when reports / rows change
  useEffect(() => {
    setPage(0);
  }, [reports, rowsPerPage]);

  return (
    <div className="p-1 w-full">
      <Card className="w-full bg-card">
        {/* ================= HEADER ================= */}
        <CardHeader className="pt-2 pb-2 -mt-5">
          <CardTitle className="grid grid-cols-[20%_45%_35%] items-center w-full text-md">

            {/* LEFT — 20% */}
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">PROJECT REPORTS</span>
            </div>

            {/* CENTER — 50% */}
            <div className="flex justify-center items-center gap-3">
              <DashboardSearch />
              <DashboardCreateReportButton />
            </div>

            {/* RIGHT — 30% */}
            <div className="flex items-center justify-end gap-4 px-4 text-sm text-muted-foreground">

              {/* Rows per page */}
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm bg-background"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Range */}
              <div>
                {totalReports === 0
                  ? "0 of 0"
                  : `${startIndex + 1}–${endIndex} of ${totalReports}`}
              </div>

              {/* Pagination arrows */}
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={!hasPrev}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  disabled={!hasNext}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
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
                {visibleReports.length > 0 ? (
                  visibleReports.map((report) => (
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
                      No Project reports found. Click{" "}
                      <b>Create Project Report</b> to get started.
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
