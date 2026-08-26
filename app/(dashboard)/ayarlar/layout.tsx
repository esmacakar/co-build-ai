import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SettingsNav from "./settings-nav";

export default async function AyarlarLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 sm:flex-row">
      <SettingsNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
