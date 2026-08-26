"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import ChatBox from "@/app/components/chat-box";
import Avatar from "@/app/components/avatar";
import RatingStars from "@/app/components/rating-stars";
import RateOfferForm from "@/app/components/rate-offer-form";

type PaymentType = "fixed" | "equity";
type ProjectPaymentType = PaymentType | "flexible";

type Offer = {
  id: string;
  message: string;
  proposed_amount: number | null;
  proof_link: string | null;
  payment_type: PaymentType | null;
  status: "pending" | "accepted" | "rejected";
  alreadyRatedByMe: boolean;
};

export default function DeveloperProjectView({
  projectId,
  userId,
  founderId,
  founderName,
  founderRatingAvg,
  founderRatingCount,
  requiredSkills,
  prd,
  alreadyAccepted,
  paymentType,
  paymentAmount,
  initialOffer,
}: {
  projectId: string;
  userId: string;
  founderId: string;
  founderName: string | null;
  founderRatingAvg: number | null;
  founderRatingCount: number;
  requiredSkills: string[] | null;
  prd: string;
  alreadyAccepted: boolean;
  paymentType: ProjectPaymentType | null;
  paymentAmount: number | null;
  initialOffer: Offer | null;
}) {
  const supabase = createClient();
  const [accepted, setAccepted] = useState(alreadyAccepted);
  const [loading, setLoading] = useState(false);
  const hasLoggedView = useRef(false);

  // Kullanıcı NDA'yı daha önce kabul etmişse, bu görüntülemeyi de logla
  useEffect(() => {
    if (alreadyAccepted && !hasLoggedView.current) {
      hasLoggedView.current = true;
      supabase
        .from("project_views")
        .insert({ project_id: projectId, viewer_id: userId })
        .then();
    }
  }, [alreadyAccepted, projectId, userId, supabase]);

  async function handleAccept() {
    setLoading(true);
    await supabase
      .from("project_nda_acceptances")
      .insert({ project_id: projectId, developer_id: userId });
    await supabase
      .from("project_views")
      .insert({ project_id: projectId, viewer_id: userId });
    setLoading(false);
    setAccepted(true);
  }

  if (!accepted) {
    return (
      <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-ink/10 bg-white p-8 text-center">
        <h2 className="font-display text-lg font-semibold text-ink">
          Gizlilik Onayı
        </h2>
        <p className="max-w-md text-sm text-ink-soft">
          Bu projenin detaylarını (PRD) görüntülemeden önce, burada
          paylaşılan bilgileri gizli tutmayı ve fikir sahibinin izni
          olmadan üçüncü kişilerle paylaşmamayı kabul etmen gerekiyor.
        </p>
        <button
          onClick={handleAccept}
          disabled={loading}
          className="rounded-full bg-coral px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Onaylıyorum, PRD'yi Görüntüle"}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 flex items-center gap-2">
        <Avatar name={founderName} role="founder" size="sm" />
        <div>
          <p className="text-sm text-ink-soft">
            <span className="font-semibold text-ink">Fikir Sahibi:</span>{" "}
            {founderName ?? "İsimsiz"}
          </p>
          <RatingStars average={founderRatingAvg} count={founderRatingCount} />
        </div>
      </div>

      {requiredSkills && requiredSkills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {requiredSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-periwinkle/20 px-3 py-1 font-mono text-xs text-ink"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {paymentType && (
        <p className="mt-4 text-sm text-ink-soft">
          <span className="font-semibold text-ink">Ödeme:</span>{" "}
          {paymentType === "flexible"
            ? "Esnek — sabit ücret veya ortaklık, teklifinde sen belirtebilirsin"
            : paymentType === "fixed"
            ? `Sabit ücret${paymentAmount ? ` — ${paymentAmount}₺` : ""}`
            : `Ortaklık${paymentAmount ? ` — %${paymentAmount}` : ""}`}
        </p>
      )}

      <div className="mt-8 rounded-xl border border-ink/10 border-l-4 border-l-periwinkle-dark bg-white p-6 shadow-sm">
        <span className="inline-flex items-center rounded-full bg-petal px-3 py-1 font-mono text-xs font-medium text-coral-dark">
          AI Tarafından Üretildi
        </span>
        <h2 className="mt-3 font-display text-xl font-semibold text-ink">
          Ürün Gereksinim Dokümanı (PRD)
        </h2>
        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
          {prd}
        </div>
      </div>

      <OfferSection
        projectId={projectId}
        userId={userId}
        founderId={founderId}
        founderName={founderName}
        projectPaymentType={paymentType}
        initialOffer={initialOffer}
      />
    </>
  );
}

const STATUS_LABELS: Record<Offer["status"], string> = {
  pending: "Bekliyor",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};

function describeOfferPayment(paymentType: PaymentType | null, amount: number | null) {
  if (!paymentType) return amount ? `${amount}` : null;
  const label = paymentType === "fixed" ? "Sabit Ücret" : "Ortaklık";
  const unit = paymentType === "fixed" ? "₺" : "%";
  return amount ? `${label} — ${amount}${unit}` : label;
}

function OfferSection({
  projectId,
  userId,
  founderId,
  founderName,
  projectPaymentType,
  initialOffer,
}: {
  projectId: string;
  userId: string;
  founderId: string;
  founderName: string | null;
  projectPaymentType: ProjectPaymentType | null;
  initialOffer: Offer | null;
}) {
  const supabase = createClient();
  const [offer, setOffer] = useState(initialOffer);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [offerPaymentType, setOfferPaymentType] = useState<PaymentType>(
    projectPaymentType === "equity" ? "equity" : "fixed"
  );
  const [proposedAmount, setProposedAmount] = useState("");
  const [proofLink, setProofLink] = useState("");

  // Founder tek bir tipe sabitlediyse, teklifin tipi de onu takip eder
  const typeIsChoosable = projectPaymentType === "flexible" || !projectPaymentType;

  async function handleSubmit() {
    if (!message.trim()) return;
    setSaving(true);

    const { data } = await supabase
      .from("offers")
      .insert({
        project_id: projectId,
        developer_id: userId,
        message,
        proposed_amount: proposedAmount ? Number(proposedAmount) : null,
        proof_link: proofLink || null,
        payment_type: offerPaymentType,
        status: "pending",
      })
      .select()
      .single();

    setSaving(false);
    if (data) setOffer(data as Offer);
  }

  if (offer) {
    return (
      <div className="mt-8 rounded-xl border border-ink/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Teklifin
          </h2>
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
        <p className="mt-3 whitespace-pre-wrap text-sm text-ink-soft">{offer.message}</p>
        {(offer.payment_type || offer.proposed_amount) && (
          <p className="mt-2 text-sm text-ink-soft">
            <span className="font-semibold text-ink">Teklifin:</span>{" "}
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

        {offer.status === "accepted" && (
          <RateOfferForm
            offerId={offer.id}
            raterId={userId}
            ratedUserId={founderId}
            ratedUserLabel={founderName ?? "Fikir Sahibi"}
            alreadyRated={offer.alreadyRatedByMe}
          />
        )}

        <ChatBox
          offerId={offer.id}
          userId={userId}
          otherUserId={founderId}
          otherUserName={founderName ?? "Fikir Sahibi"}
          projectId={projectId}
        />
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-ink/10 bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Teklif Ver</h2>
      <div className="mt-4 flex flex-col gap-3">
        {typeIsChoosable && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOfferPaymentType("fixed")}
              className={`flex-1 rounded-full px-4 py-1.5 text-sm font-semibold ${
                offerPaymentType === "fixed" ? "bg-coral text-white" : "border border-ink/15 text-ink-soft"
              }`}
            >
              Sabit Ücret
            </button>
            <button
              type="button"
              onClick={() => setOfferPaymentType("equity")}
              className={`flex-1 rounded-full px-4 py-1.5 text-sm font-semibold ${
                offerPaymentType === "equity" ? "bg-periwinkle-dark text-white" : "border border-ink/15 text-ink-soft"
              }`}
            >
              Ortaklık
            </button>
          </div>
        )}
        <textarea
          placeholder="Bu proje için neden doğru kişi olduğunu anlat..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="resize-none rounded-lg border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
        <input
          type="number"
          min="0"
          placeholder={
            offerPaymentType === "fixed" ? "Teklif ettiğin tutar, ₺ (isteğe bağlı)" : "Teklif ettiğin pay, % (isteğe bağlı)"
          }
          value={proposedAmount}
          onChange={(e) => setProposedAmount(e.target.value)}
          className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
        <input
          type="text"
          placeholder="Kanıt linki: portfolyo, GitHub, vb. (isteğe bağlı)"
          value={proofLink}
          onChange={(e) => setProofLink(e.target.value)}
          className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="self-start rounded-full bg-coral px-6 py-2 text-sm font-semibold text-white hover:bg-coral-dark disabled:opacity-50"
        >
          {saving ? "Gönderiliyor..." : "Teklifi Gönder"}
        </button>
      </div>
    </div>
  );
}
