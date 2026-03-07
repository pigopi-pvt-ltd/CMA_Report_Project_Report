"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FolderOpen, ArrowDown, Pencil, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardCreateReportButton from "./DashboardCreateReportButton";
import DashboardSearch from "./DashboardSearch";
import axios from "axios";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

type CMAReport = {
  id: string;
  name: string;
  createdAt: string;
};

export default function CMAReports({ reports }: { reports: CMAReport[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Search filter
  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReports = filteredReports.length;
  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalReports);
  const visibleReports = filteredReports.slice(startIndex, endIndex);

  const hasPrev = page > 0;
  const hasNext = page < Math.ceil(totalReports / rowsPerPage) - 1;

  const handleDownload = async (reportId: string, name: string) => {
    try {
      setIsDownloading(reportId);
      const response = await axios.post("/api/unified-reports/download",
        { projectId: reportId, reportType: 'cma' },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `CMA_Report_${name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started");
    } catch (error) {
      toast.error("Download failed");
    } finally {
      setIsDownloading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/unified-reports/delete?id=${deleteId}&type=cma`);
      toast.success("CMA report deleted");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    setPage(0);
  }, [searchQuery, rowsPerPage]);

  return (
    <div className="p-1 w-full">
      <Card className="w-full bg-card">
        <CardHeader className="pt-2 pb-2 -mt-5">
          <CardTitle className="grid grid-cols-[20%_45%_35%] items-center w-full text-md">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">CMA REPORTS</span>
            </div>

            <div className="flex justify-center items-center gap-3">
              <DashboardSearch value={searchQuery} onChange={setSearchQuery} />
              <DashboardCreateReportButton href="/create-cma-report" />
            </div>

            <div className="flex items-center justify-end gap-4 px-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Rows:</span>
                <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="border rounded px-1 py-1 bg-background">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
              <div>{totalReports === 0 ? "0 of 0" : `${startIndex + 1}–${endIndex} of ${totalReports}`}</div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" disabled={!hasPrev} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" disabled={!hasNext} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="overflow-x-auto -mt-10">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 w-16"></th>
                  <th className="px-4 py-3 text-left">REPORT NAME</th>
                  <th className="px-4 py-3 text-left">CREATED DATE</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {visibleReports.length > 0 ? (
                  visibleReports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0" onClick={() => handleDownload(report.id, report.name)} disabled={isDownloading === report.id}>
                          <ArrowDown className="h-4 w-4 text-white" strokeWidth={3} />
                        </Button>
                      </td>
                      <td className="px-4 py-3 font-medium">{report.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{report.createdAt}</td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <Link href={`/edit-report/${report.id}?type=cma`}>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0"><Pencil className="h-4 w-4" /></Button>
                        </Link>
                        <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => setDeleteId(report.id)}><Trash className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted-foreground">No reports found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Confirm deletion?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}