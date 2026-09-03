"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function CancelProcessingProject({ projectId }: { projectId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);

  async function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Bu taslak proje silinsin mi? PRD üretimi devam ediyor olsa bile taslak kaldırılır.")) {
      return;
    }
    setDeleting(true);
    const { error } = await supabase.from("projects").delete().eq("id", projectId);
    setDeleting(false);

    if (error) {
      console.error("Proje silinemedi:", error);
      alert("Proje silinemedi: " + error.message);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleCancel}
      disabled={deleting}
      title="Bu taslağı iptal et / sil"
      className="shrink-0 rounded-full p-1.5 text-ink-soft hover:bg-coral/10 hover:text-coral-dark disabled:opacity-50"
    >
      <X size={16} />
    </button>
  );
}
