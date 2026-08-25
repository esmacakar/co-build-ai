import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, full_name")
    .eq("id", user.id)
    .single();

  const userType = profile?.user_type ?? null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userType={userType} userName={profile?.full_name ?? null} />
      <div className="flex flex-1 flex-col">
        <Topbar userId={user.id} userName={profile?.full_name ?? null} userType={userType} />
        <main className="flex-1 px-6 py-8 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
