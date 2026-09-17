import { NextRequest, NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, readJsonRequest, RequestBodyError } from "@/server/request-security";
import { readVisitProofMetadata, VISIT_PROOF_BUCKET, writeVisitProofMetadata } from "@/server/visit-proof";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminUser();
    const reviews = await getPrisma().placeReview.findMany({
      include: { place: { select: { name: true, slug: true, city: true, email: true } }, user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
    const supabase = createAdminClient();
    const rows = await Promise.all(reviews.map(async (review) => {
      const proof = readVisitProofMetadata(review.photos);
      if (!proof) return null;
      const { data } = await supabase.storage.from(VISIT_PROOF_BUCKET).createSignedUrls(proof.paths, 60 * 60);
      return { id: review.id, rating: review.rating, comment: review.comment, isVerified: review.isVerified, updatedAt: review.updatedAt, place: review.place, member: { email: review.user.email, name: [review.user.profile?.firstName, review.user.profile?.lastName].filter(Boolean).join(" ") || "Membre" }, proof, photoUrls: (data || []).map((item) => item.signedUrl) };
    }));
    return NextResponse.json({ reviews: rows.filter(Boolean) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error, "admin-reviews-list");
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await requireAdminUser();
    const body = await readJsonRequest(request, 4_096) as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id : "";
    const action = typeof body.action === "string" ? body.action : "";
    if (!/^[a-z0-9_-]{8,64}$/i.test(id) || !["publish", "mediate", "reject"].includes(action)) throw new RequestBodyError("Action invalide.", 400);
    const prisma = getPrisma();
    const review = await prisma.placeReview.findUnique({ where: { id }, select: { id: true, rating: true, photos: true, userId: true, place: { select: { name: true, slug: true } } } });
    if (!review) return NextResponse.json({ error: "Retour introuvable." }, { status: 404 });
    const proof = readVisitProofMetadata(review.photos);
    if (!proof) throw new RequestBodyError("Preuve de visite invalide.", 400);
    if (action === "publish" && review.rating <= 2 && proof.status !== "MEDIATION") {
      return NextResponse.json({ error: "Un avis de 1 ou 2 étoiles doit d’abord passer par l’étape d’échange avec le lieu." }, { status: 409 });
    }
    const status = action === "publish" ? "PUBLISHED" : action === "mediate" ? "MEDIATION" : "REJECTED";
    const updatedProof = writeVisitProofMetadata({ ...proof, status, moderatedAt: new Date().toISOString() });
    await prisma.$transaction([
      prisma.placeReview.update({ where: { id }, data: { isVerified: action === "publish", photos: updatedProof } }),
      prisma.notification.create({ data: { userId: review.userId, type: "REVIEW_MODERATION", title: action === "publish" ? `Retour publié · ${review.place.name}` : action === "mediate" ? `Suivi qualité · ${review.place.name}` : `Retour non publié · ${review.place.name}`, body: action === "publish" ? "Votre retour d’expérience a été validé et publié." : action === "mediate" ? "Votre retour nécessite un échange avec le lieu avant toute publication." : "Votre retour reste dans votre passeport mais ne sera pas publié.", data: { placeSlug: review.place.slug, reviewStatus: status } } }),
    ]);
    return NextResponse.json({ success: true, status });
  } catch (error) {
    return apiError(error, "admin-reviews-action");
  }
}
