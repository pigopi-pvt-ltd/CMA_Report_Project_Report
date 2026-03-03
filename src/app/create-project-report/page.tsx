"use client";
import { UnifiedReportForm } from "@/components/forms/UnifiedReportForm";

export default function CreateProjectPage() {
  return (
    <div className="p-10 flex justify-center">
      <UnifiedReportForm type="project" />
    </div>
  );
}