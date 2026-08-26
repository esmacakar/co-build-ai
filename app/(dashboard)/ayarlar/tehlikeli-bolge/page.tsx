import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DeleteAccount from "./delete-account";

export default async function TehlikeliBolge() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  return <DeleteAccount userEmail={user.email ?? ""} />;
}
