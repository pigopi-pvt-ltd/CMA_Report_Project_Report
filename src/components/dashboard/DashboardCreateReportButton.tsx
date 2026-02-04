"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateReportButton({
  href,
}: {
  href: string;
}) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(href)}
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
      CREATE NEW REPORT
    </Button>
  );
}
