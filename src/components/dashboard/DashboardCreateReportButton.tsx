"use client";

import { Button } from "@/components/ui/button";

export default function CreateReportButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <Button
    //   onClick={onClick}
      className="
        h-12
        px-8
        rounded-full
        bg-primary
        text-md
        font-semibold
        hover:bg-primary/80
        shadow-none
        border-none
        flex
        items-center
        gap-2
      "
    >
      {/* <Plus className="h-4 w-4" /> */}
      CREATE NEW REPORT
    </Button>
  );
}
