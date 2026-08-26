import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function HesapAyarlari() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Hesap Bilgileri</h2>
      <p className="mt-3 text-sm text-ink-soft">
        <span className="font-semibold text-ink">E-posta:</span> {user.email}
      </p>
    </div>
  );
}
