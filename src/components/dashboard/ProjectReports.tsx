"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


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
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const totalReports = reports.length;
  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalReports);
  const visibleReports = reports.slice(startIndex, endIndex);

  const hasPrev = page > 0;
  const hasNext = page < Math.ceil(totalReports / rowsPerPage) - 1;

  /* ================= DELETE STATE ================= */
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ================= EDIT STATE ================= */
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [fullEditReport, setFullEditReport] = useState<any | null>(null);

  /* ================= HANDLERS ================= */

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/unified-reports/delete?id=${deleteId}&type=project`);
      setDeleteId(null);
      window.location.reload();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const saveEdit = async () => {
  if (!editId || !fullEditReport) return; 
  
  try {
    const payload = {
      ...fullEditReport,      
      name: editName,         
      businessName: editName  
    };

    await axios.put(`/api/unified-reports/edit?id=${editId}&type=project`, payload);
    toast.success("Updated!");
    window.location.reload();
  } catch (err) {
    // Agar ab bhi error aaye, toh iska matlab fullEditReport mein wo required fields missing hain
    toast.error("Required fields missing in this report's data");
  }
};

  const handleDownload = async (reportId: string) => {
    try {
      const response = await axios.post(
        "/api/unified-reports/download",
        { projectId: reportId, reportType: 'project' },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "project-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download error", err);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [reports, rowsPerPage]);

  return (
    <div className="p-1 w-full">
      <Card className="w-full bg-card">
        <CardHeader className="pt-2 pb-2 -mt-5">
          <CardTitle className="grid grid-cols-[20%_45%_35%] items-center w-full text-md">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">PROJECT REPORTS</span>
            </div>

            <div className="flex justify-center items-center gap-3">
              <DashboardSearch />
              {/* Fixed: href instead of undefined activeTab */}
              <DashboardCreateReportButton href="/create-project-report" />
            </div>

            <div className="flex items-center justify-end gap-4 px-4 text-sm text-muted-foreground">
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
                </select>
              </div>
              <div>
                {totalReports === 0 ? "0 of 0" : `${startIndex + 1}–${endIndex} of ${totalReports}`}
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" disabled={!hasPrev} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" disabled={!hasNext} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="overflow-x-auto -mt-10">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3"></th>
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
                          onClick={() => handleDownload(report.id)}
                        >
                          <ArrowDown className="h-5 w-5 text-white" />
                        </Button>
                      </td>
                      <td className="px-4 py-3 font-medium">{report.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{report.createdAt}</td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        {/* Corrected Edit Link for Projects */}
                        <Link href={`/edit-report/${report.id}?type=project`}>
                          <Button size="sm" variant="secondary">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteId(report.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center">No Project reports found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* DELETE DIALOG */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this report?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
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
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}