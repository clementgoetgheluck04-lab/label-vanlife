"use client";

import { Suspense } from "react";
import { SuccessContent } from "./SuccessContent";
import { Loader2 } from "lucide-react";

export default function MemberSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
