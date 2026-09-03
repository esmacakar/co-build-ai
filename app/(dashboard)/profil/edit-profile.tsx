"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function EditProfile({
  userId,
  fullName,
  initialBio,
  initialSkills,
  initialCvUrl,
}: {
  userId: string;
  fullName: string | null;
  initialBio: string | null;
  initialSkills: string[] | null;
  initialCvUrl: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(initialBio ?? "");
  const [skillsText, setSkillsText] = useState((initialSkills ?? []).join(", "));
  const [cvUrl, setCvUrl] = useState(initialCvUrl ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const skillsArray = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    await supabase
      .from("profiles")
      .update({ bio, skills: skillsArray, cv_url: cvUrl.trim() || null })
      .eq("id", userId);

    // Eşleştirme motorunun anlamsal aramada bulabilmesi için profili
    // AI sunucusunda yeniden vektörle (aynı developer_id ile upsert)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/gelistirici/vektorle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_id: userId,
          ad_soyad: fullName ?? "",
          uzmanlik_alanlari: [],
          bildigi_diller: skillsArray,
          bio,
        }),
      });
    } catch {
      // AI sunucusuna ulaşılamazsa profil yine de kaydedilmiş olur,
      // sadece eşleştirme motorunda güncel görünmeyebilir
    }

    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="mt-8 rounded-xl bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(17,24,39,0.05),0_2px_8px_rgba(17,24,39,0.05),0_16px_40px_rgba(17,24,39,0.10)] p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">
            Hakkımda
          </h2>
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-semibold text-coral-dark hover:underline"
          >
            Düzenle
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {initialBio || "Henüz bir tanıtım yazısı eklenmedi."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {initialSkills && initialSkills.length > 0 ? (
            initialSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-periwinkle/20 px-3 py-1 font-mono text-xs text-ink">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-xs text-ink-soft">Henüz beceri etiketi eklenmedi.</p>
          )}
        </div>

        <div className="mt-4">
          {initialCvUrl ? (
            <a
              href={initialCvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-coral-dark hover:underline"
            >
              CV&apos;yi Görüntüle →
            </a>
          ) : (
            <p className="text-xs text-ink-soft">Henüz CV eklenmedi.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-coral/30 bg-white p-6">
      <h2 className="text-lg font-bold text-ink">
        Profilini Düzenle
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-ink">Hakkımda</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Kendini kısaca tanıt: hangi alanlarda deneyimlisin, ne tür projelerde çalıştın..."
            className="mt-1 w-full resize-none rounded-lg bg-ink/5 shadow-[inset_0_2px_5px_rgba(17,24,39,0.08)] px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-coral/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Beceriler</label>
          <input
            type="text"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="örn. React, Node.js, PostgreSQL (virgülle ayır)"
            className="mt-1 w-full rounded-lg bg-ink/5 shadow-[inset_0_2px_5px_rgba(17,24,39,0.08)] px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-coral/30"
          />
          <p className="mt-1 text-xs text-ink-soft">Becerileri virgülle ayırarak yaz.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">CV Linki</label>
          <input
            type="url"
            value={cvUrl}
            onChange={(e) => setCvUrl(e.target.value)}
            placeholder="örn. Google Drive, LinkedIn veya kişisel sitendeki CV linkin"
            className="mt-1 w-full rounded-lg bg-ink/5 shadow-[inset_0_2px_5px_rgba(17,24,39,0.08)] px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-coral/30"
          />
          <p className="mt-1 text-xs text-ink-soft">CV dosyanı bir yere yükleyip linkini buraya yapıştır.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-coral px-6 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_0_0_var(--color-coral-dark),0_10px_20px_rgba(239,68,104,0.35)] transition-all hover:brightness-105 active:translate-y-1 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0px_0_0_var(--color-coral-dark),0_2px_6px_rgba(239,68,104,0.30)] disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-full bg-ink/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-2px_0_rgba(17,24,39,0.06)] active:shadow-[inset_0_2px_4px_rgba(17,24,39,0.10)] active:translate-y-px px-6 py-2.5 text-sm font-semibold text-ink-soft hover:bg-ink/10 hover:text-ink"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}