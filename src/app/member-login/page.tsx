"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { LoginContent } from "./LoginContent";

export default function MemberLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}