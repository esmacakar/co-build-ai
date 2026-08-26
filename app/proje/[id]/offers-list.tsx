"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import ChatBox from "@/app/components/chat-box";
import Avatar from "@/app/components/avatar";
import RatingStars from "@/app/components/rating-stars";
import RateOfferForm from "@/app/components/rate-offer-form";
import AvailabilityBadge from "@/app/components/availability-badge";

type Offer = {
  id: string;
  developer_id: string;
  message: string;
  proposed_amount: number | null;
  proof_link: string | null;
  payment_type: "fixed" | "equity" | null;
  status: "pending" | "accepted" | "rejected";
  developer: {
    full_name: string | null;
    bio: string | null;
    skills: string[] | null;
    availability: string | null;
  } | null;
  developerRatingAvg: number | null;
  developerRatingCount: number;
  alreadyRatedByMe: boolean;
};

const STATUS_LABELS: Record<Offer["status"], string> = {
  pending: "Bekliyor",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};

function describeOfferPayment(paymentType: Offer["payment_type"], amount: number | null) {
  if (!paymentType) return amount ? `${amount}` : null;
  const label = paymentType === "fixed" ? "Sabit Ücret" : "Ortaklık";
  const unit = paymentType === "fixed" ? "₺" : "%";
  return amount ? `${label} — ${amount}${unit}` : label;
}

export default function OffersList({
  projectId,
  projectTitle,
  founderId,
  initialOffers,
}: {
  projectId: string;
  projectTitle: string;
  founderId: string;
  initialOffers: Offer[];
}) {
  const supabase = createClient();
  const [offers, setOffers] = useState(initialOffers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleUpdateStatus(offer: Offer, status: "accepted" | "rejected") {
    setUpdatingId(offer.id);
    await supabase.from("offers").update({ status }).eq("id", offer.id);
    await supabase.from("notifications").insert({
      user_id: offer.developer_id,
      project_id: projectId,
      type: status === "accepted" ? "offer_accepted" : "offer_rejected",
      message: `"${projectTitle}" projesi için verdiğin teklif ${
        status === "accepted" ? "kabul edildi 🎉" : "reddedildi"
      }.`,
    });
    setOffers((prev) => prev.map((o) => (o.id === offer.id ? { ...o, status } : o)));
    setUpdatingId(null);
  }

  if (offers.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-ink/15 bg-white/60 p-8 text-center">
        <p className="text-2xl">📭</p>
        <p className="mt-2 text-sm text-ink-soft">
          Henüz gelen bir teklif yok. Yazılımcılar projeni gördükçe teklifler burada birikecek.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Gelen Teklifler ({offers.length})
      </p>
      <div className="mt-3 flex flex-col gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className="rounded-xl border border-ink/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={offer.developer?.full_name ?? null} role="developer" size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-ink">
                      {offer.developer?.full_name ?? "İsimsiz Yazılımcı"}
                    </h3>
                    <AvailabilityBadge availability={offer.developer?.availability ?? null} />
                  </div>
                  <RatingStars average={offer.developerRatingAvg} count={offer.developerRatingCount} />
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  offer.status === "accepted"
                    ? "bg-periwinkle-dark text-white"
                    : offer.status === "rejected"
                    ? "bg-coral/10 text-coral-dark"
                    : "bg-petal text-coral-dark"
                }`}
              >
                {STATUS_LABELS[offer.status]}
              </span>
            </div>

            {offer.developer?.skills && offer.developer.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {offer.developer.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-periwinkle/20 px-3 py-1 font-mono text-xs text-ink">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-3 whitespace-pre-wrap text-sm text-ink-soft">{offer.message}</p>

            {(offer.payment_type || offer.proposed_amount) && (
              <p className="mt-2 text-sm text-ink-soft">
                <span className="font-semibold text-ink">Teklifi:</span>{" "}
                {describeOfferPayment(offer.payment_type, offer.proposed_amount)}
              </p>
            )}

            {offer.proof_link && (
              <a
                href={offer.proof_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-coral-dark hover:underline"
              >
                Kanıt linki →
              </a>
            )}

            {offer.status === "pending" && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleUpdateStatus(offer, "accepted")}
                  disabled={updatingId === offer.id}
                  className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-white hover:bg-coral-dark disabled:opacity-50"
                >
                  Kabul Et
                </button>
                <button
                  onClick={() => handleUpdateStatus(offer, "rejected")}
                  disabled={updatingId === offer.id}
                  className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink-soft hover:text-ink disabled:opacity-50"
                >
                  Reddet
                </button>
              </div>
            )}

            {offer.status === "accepted" && (
              <RateOfferForm
                offerId={offer.id}
                raterId={founderId}
                ratedUserId={offer.developer_id}
                ratedUserLabel={offer.developer?.full_name ?? "İsimsiz Yazılımcı"}
                alreadyRated={offer.alreadyRatedByMe}
              />
            )}

            <ChatBox
              offerId={offer.id}
              userId={founderId}
              otherUserId={offer.developer_id}
              otherUserName={offer.developer?.full_name ?? "İsimsiz Yazılımcı"}
              projectId={projectId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
