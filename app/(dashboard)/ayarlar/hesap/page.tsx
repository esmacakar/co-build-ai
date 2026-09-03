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
    <div className="rounded-xl bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(17,24,39,0.05),0_2px_8px_rgba(17,24,39,0.05),0_16px_40px_rgba(17,24,39,0.10)] p-8">
      <h2 className="text-lg font-bold text-ink">Hesap Bilgileri</h2>
      <p className="mt-3 text-sm text-ink-soft">
        <span className="font-semibold text-ink">E-posta:</span> {user.email}
      </p>
    </div>
  );
}
