import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ChangePassword from "./change-password";

export default async function GuvenlikAyarlari() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  return <ChangePassword />;
}
