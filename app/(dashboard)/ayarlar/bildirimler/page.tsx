import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import NotificationToggle from "./notification-toggle";

export default async function BildirimAyarlari() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("notifications_enabled")
    .eq("id", user.id)
    .maybeSingle();

  return <NotificationToggle userId={user.id} initialEnabled={profile?.notifications_enabled ?? true} />;
}
