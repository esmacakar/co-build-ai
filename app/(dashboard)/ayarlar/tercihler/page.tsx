import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import FounderDefaults from "./founder-defaults";
import DeveloperAvailability from "./developer-availability";

export default async function TercihAyarlari() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, default_payment_type, default_payment_amount, availability")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.user_type === "founder") {
    return (
      <FounderDefaults
        userId={user.id}
        initialType={profile?.default_payment_type ?? null}
        initialAmount={profile?.default_payment_amount ?? null}
      />
    );
  }

  if (profile?.user_type === "developer") {
    return <DeveloperAvailability userId={user.id} initialValue={profile?.availability ?? null} />;
  }

  return null;
}
