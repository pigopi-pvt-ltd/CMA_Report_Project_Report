"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ProjectReportForm } from "@/components/forms/ProjectReportForm";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function EditProjectReportPage() {
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/api/edit-report?id=${id}`); 
        
        if (response.data && response.data.data) {
          setInitialData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to load report data for editing.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!initialData) {
    return <div className="text-center mt-20 text-muted-foreground">Report not found! Please check backend API.</div>;
  }

  return (
    <div className="flex w-full min-h-screen items-center justify-center font-sans p-10">
      <ProjectReportForm 
        initialData={initialData} 
        reportId={id} 
        isEditMode={true} 
      />
    </div>
  );
}