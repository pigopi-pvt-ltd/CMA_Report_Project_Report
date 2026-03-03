"use client";
import { UnifiedReportForm } from "@/components/forms/UnifiedReportForm";
import { useParams, useSearchParams } from "next/navigation";

export default function EditReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const type = (searchParams.get("type") as 'cma' | 'project') || 'cma';

  return (
    <div className="flex w-full min-h-screen items-center justify-center p-10">
      <UnifiedReportForm reportId={id} type={type} />
    </div>
  );
}