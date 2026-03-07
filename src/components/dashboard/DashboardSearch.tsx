"use client";

import { Search } from "lucide-react";

interface SearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function DashboardSearch({ value, onChange, placeholder = "Search Reports..." }: SearchProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-full border bg-background py-3 pl-11 pr-4 text-sm outline-none transition
          placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20
        "
      />
    </div>
  );
}