"use client";

import { Search } from "lucide-react";

export default function DashboardSearch() {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

      <input
        type="text"
        placeholder="Search Reports"
        className="
          w-full
          rounded-full
          border
          bg-background
          py-3
          pl-11
          pr-4
          text-sm
          outline-none
          transition
          placeholder:text-muted-foreground
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
        "
      />
    </div>
  );
}
