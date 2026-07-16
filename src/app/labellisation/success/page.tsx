"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export default function LabellisationSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>}>
      <OrderConfirmation product="LABELLISATION" />
    </Suspense>
  );
}
