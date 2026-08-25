"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function EditProfile({
  userId,
  initialBio,
  initialSkills,
}: {
  userId: string;
  initialBio: string | null;
  initialSkills: string[] | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(initialBio ?? "");
  const [skillsText, setSkillsText] = useState((initialSkills ?? []).join(", "));
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const skillsArray = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    await supabase
      .from("profiles")
      .update({ bio, skills: skillsArray })
      .eq("id", userId);

    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="mt-8 rounded-xl border border-ink/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
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
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-coral/30 bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
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
            className="mt-1 w-full resize-none rounded-lg border border-ink/15 px-4 py-2.5 text-sm text-ink outline-none focus:border-coral"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Beceriler</label>
          <input
            type="text"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="örn. React, Node.js, PostgreSQL (virgülle ayır)"
            className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm text-ink outline-none focus:border-coral"
          />
          <p className="mt-1 text-xs text-ink-soft">Becerileri virgülle ayırarak yaz.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-coral px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-full border border-ink/15 px-6 py-2 text-sm font-semibold text-ink-soft hover:text-ink"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}