"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type OrderStatus = "PENDING" | "CHECKOUT_CREATED" | "PAID" | "CANCELED" | "FAILED" | "REFUNDED";
type OrderProduct = "MEMBERSHIP" | "LABELLISATION";

export function OrderConfirmation({ product }: { product: OrderProduct }) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<OrderStatus | "LOADING" | "UNKNOWN">("LOADING");

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      attempts += 1;
      try {
        const response = await fetch(`/api/orders/status?session_id=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Order status unavailable");
        const order = await response.json() as { status: OrderStatus; product: OrderProduct };
        if (cancelled || order.product !== product) return;
        setStatus(order.status);
        if (["PENDING", "CHECKOUT_CREATED"].includes(order.status) && attempts < 10) {
          timeout = setTimeout(poll, 1_500);
        }
      } catch {
        if (!cancelled) setStatus("UNKNOWN");
      }
    };

    void poll();
    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [product, sessionId]);

  const paid = status === "PAID";
  const failed = status === "FAILED" || status === "CANCELED" || status === "REFUNDED" || status === "UNKNOWN" || !sessionId;
  const title = paid
    ? product === "MEMBERSHIP" ? "Votre carte est activée" : "Paiement confirmé"
    : failed ? "Confirmation impossible" : "Paiement en cours de confirmation";
  const description = paid
    ? product === "MEMBERSHIP"
      ? "Le paiement a été vérifié et votre accès est valable pendant 12 mois."
      : "Votre paiement a été vérifié et un email de confirmation vous est envoyé. Votre dossier passe maintenant en étude. En cas de non-conformité, il sera remboursé intégralement."
    : failed
      ? "Aucun droit n’a été activé. Contactez-nous si votre compte bancaire a été débité."
      : "Stripe nous transmet la confirmation sécurisée. Cette étape prend généralement quelques secondes.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${failed ? "bg-red-50" : "bg-emerald-100"}`}>
          {paid ? <Check className="h-10 w-10 text-emerald-600" /> : failed
            ? <AlertCircle className="h-10 w-10 text-red-500" />
            : <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
          <p className="text-lg text-neutral-500">{description}</p>
        </div>
        <div className="space-y-3">
          {paid && product === "MEMBERSHIP" && (
            <Link href="/member"><Button variant="cta" size="lg" className="w-full">Accéder à mon espace membre</Button></Link>
          )}
          <Link href={failed && product === "MEMBERSHIP" ? "/devenir-membre" : "/"}>
            <Button variant={paid ? "secondary" : "cta"} size="lg" className="w-full">
              {failed && product === "MEMBERSHIP" ? "Revenir à l’offre" : "Retour à l’accueil"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
