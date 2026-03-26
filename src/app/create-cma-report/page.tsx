"use client";

import { UnifiedReportForm } from '@/components/forms/UnifiedReportForm'; 

const CreateCMAReportPage = () => {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-muted/5 px-4 py-10 md:px-10 flex flex-col">
      <div className="my-auto w-full shrink-0">
        <UnifiedReportForm type="cma" />
      </div>
    </div>
  )
}

export default CreateCMAReportPage;