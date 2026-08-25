import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EditProfile from "./edit-profile";
import PortfolioSection from "./portfolio-section";
import Avatar from "@/app/components/avatar";

export default async function Profil() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  let myProjects: any[] = [];
  if (profile?.user_type === "founder") {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("founder_id", user.id)
      .order("created_at", { ascending: false });
    myProjects = data ?? [];
  }

  let portfolioItems: any[] = [];
  if (profile?.user_type === "developer") {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("developer_id", user.id)
      .order("created_at", { ascending: false });
    portfolioItems = data ?? [];
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <Avatar
            name={profile?.full_name ?? null}
            role={profile?.user_type === "founder" ? "founder" : "developer"}
            size="lg"
          />
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
            {profile?.full_name ?? "Profilim"}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {profile?.user_type === "founder" ? "Fikir Sahibi" : "Yazılımcı"}
          </p>

          {profile?.user_type === "founder" && (
            <a href="/fikir-ekle" className="mt-6 inline-block rounded-full bg-coral px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-coral-dark">
              + Yeni Fikir Ekle
            </a>
          )}
        </div>

        {profile?.user_type === "founder" && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">
              Projelerim
            </h2>

            {myProjects.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
                <p className="text-2xl">💡</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Henüz bir fikir eklemedin.
                </p>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-4">
               
{myProjects.map((project) => (
  <a
    key={project.id}
    href={`/proje/${project.id}`}
    className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-5 transition-colors hover:border-coral/40"
  >
    <div>
      <h3 className="font-display text-lg font-semibold text-ink">
        {project.title}
      </h3>

      {!project.generated_prd ? (
        <span className="mt-1 inline-flex items-center gap-2 text-xs text-coral-dark">
          <span className="h-2 w-2 animate-spin rounded-full border-2 border-coral border-t-transparent" />
          PRD hazırlanıyor
        </span>
      ) : (
        <span
          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
            project.status === "published"
              ? "bg-periwinkle-dark text-white"
              : "bg-petal text-coral-dark"
          }`}
        >
          {project.status === "published" ? "Yayında" : "Taslak"}
        </span>
      )}
    </div>

    <span className="text-ink-soft">→</span>
  </a>
))}

              </div>
            )}
          </div>
        )}

        {profile?.user_type === "developer" && (
          <EditProfile
            userId={user.id}
            initialBio={profile?.bio ?? null}
            initialSkills={profile?.skills ?? null}
          />
        )}

        {profile?.user_type === "developer" && (
          <PortfolioSection userId={user.id} items={portfolioItems} />
        )}
      </div>
    </div>
  );
}