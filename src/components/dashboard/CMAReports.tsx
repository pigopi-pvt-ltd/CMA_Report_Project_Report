"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FolderOpen,
  ArrowDown,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardCreateReportButton from "./DashboardCreateReportButton";
import DashboardSearch from "./DashboardSearch";

import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  reports: CMAReport[];
}) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = async (reportId: string, name: string) => {
    try {
      setIsDownloading(reportId);
      const response = await axios.post("/api/unified-reports/download",
        {
          projectId: reportId,
          reportType: 'cma'
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `CMA_Report_${name.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download report");
    } finally {
      setIsDownloading(null);
    }
  };

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

  // reset page on search / rows change
  useEffect(() => {
    setPage(0);
  }, [reports, rowsPerPage]);

  /* ================= ACTION STATE ================= */
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [fullEditReport, setFullEditReport] = useState<any>(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/unified-reports/delete?id=${deleteId}&type=cma`);
      toast.success("Report deleted");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete report");
    } finally {
      setDeleteId(null);
    }
  };

  const saveEdit = async () => {
    if (!editId) return;
    try {
      // Update the report with the full data
      await axios.put(`/api/unified-reports/edit?id=${editId}&type=cma`, fullEditReport);
      toast.success("Report updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update report");
    } finally {
      setEditId(null);
      setFullEditReport(null);
    }
  };

  return (
    <div className="p-1 w-full">
      <Card className="w-full bg-card">
        {/* ================= HEADER ================= */}
        <CardHeader className="pt-2 pb-2 -mt-5">
          <CardTitle className="grid grid-cols-[20%_45%_35%] items-center w-full text-md">

            {/* LEFT — 20% */}
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">CMA REPORTS</span>
            </div>

            {/* CENTER — 50% */}
            <div className="flex justify-center items-center gap-3">
              <DashboardSearch />
              <DashboardCreateReportButton href="/create-cma-report" />
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

              {/* Pagination */}
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
              <thead className="border-b  bg-muted/40">
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
                          onClick={() => handleDownload(report.id, report.name)}
                          disabled={isDownloading === report.id}
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
                        <Link href={`/edit-report/${report.id}?type=cma`}>
                          <Button
                            size="sm"
                            variant="secondary"
                            title="Edit Report"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(report.id)}
                        >
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

      {/* ================= DIALOGS ================= */}

      {/* DELETE DIALOG */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this CMA report?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* EDIT DIALOG */}
      <Dialog open={!!editId} onOpenChange={() => setEditId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Business Name</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditId(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
