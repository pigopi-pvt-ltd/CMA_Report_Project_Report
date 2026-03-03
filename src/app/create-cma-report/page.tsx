"use client";

import { UnifiedReportForm } from '@/components/forms/UnifiedReportForm'; // Change import here

const CreateCMAReportPage = () => {
  return (
    <div className="flex w-full min-h-screen items-center justify-center font-sans p-10">
      {/* Passing type="cma" tells the master form to act as a CMA form.
          Since no reportId is passed, it remains in 'Create Mode'.
      */}
      <UnifiedReportForm type="cma" />
    </div>
  )
}

export default CreateCMAReportPage;