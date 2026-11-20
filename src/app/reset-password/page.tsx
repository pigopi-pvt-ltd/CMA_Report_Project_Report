"use client";

import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans p-4 sm:p-8">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
