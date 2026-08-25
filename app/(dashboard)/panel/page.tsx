import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Avatar from "@/app/components/avatar";

export default async function Panel() {
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

  let projects: any[] = [];
  let developers: any[] = [];

  if (profile?.user_type === "developer") {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      const founderIds = [...new Set(data.map((p) => p.founder_id))];
      const { data: founderProfiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", founderIds);

      projects = data.map((p) => ({
        ...p,
        founderName: founderProfiles?.find((f) => f.id === p.founder_id)?.full_name ?? null,
      }));
    }
  } else if (profile?.user_type === "founder") {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_type", "developer")
      .order("created_at", { ascending: false });
    developers = data ?? [];
  }

  let processingProjects: any[] = [];
  if (profile?.user_type === "founder") {
    const { data } = await supabase
      .from("projects")
      .select("id, title")
      .eq("founder_id", user.id)
      .is("generated_prd", null)
      .order("created_at", { ascending: false });
    processingProjects = data ?? [];
  }

  return (
    <div>
      {processingProjects.length > 0 && (
        <div className="mb-8 flex flex-col gap-2">
          {processingProjects.map((p) => (
            <a key={p.id} href={`/proje/${p.id}`} className="flex items-center gap-3 rounded-lg border border-coral/30 bg-petal/30 px-4 py-3 text-sm text-ink transition-colors hover:bg-petal/50">
              <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-coral border-t-transparent" />
              <span>
                <strong>{p.title}</strong> için PRD hazırlanıyor, görmek için tıkla →
              </span>
            </a>
          ))}
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {profile?.user_type === "founder" ? "Yazılımcıları Keşfet" : "Yayınlanmış Projeler"}
        </h1>

        {profile?.user_type === "developer" && (
          <div className="mt-6">
            {projects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
                <p className="text-2xl">🔭</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Şu an yayınlanmış bir proje yok. Daha sonra tekrar kontrol et!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {projects.map((project) => (
                  <a
                    key={project.id}
                    href={`/proje/${project.id}`}
                    className="block rounded-xl border border-ink/10 bg-white p-5 transition-colors hover:border-coral/40"
                  >
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {project.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar name={project.founderName} role="founder" size="sm" />
                      <span className="text-xs text-ink-soft">
                        {project.founderName ?? "İsimsiz Fikir Sahibi"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-soft line-clamp-3">
                      {project.raw_idea}
                    </p>
                    {project.required_skills && project.required_skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.required_skills.map((skill: string) => (
                          <span key={skill} className="rounded-full bg-petal px-3 py-1 font-mono text-xs text-coral-dark">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {profile?.user_type === "founder" && (
          <div className="mt-6">
            {developers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
                <p className="text-2xl">🧑‍💻</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Henüz kayıtlı bir yazılımcı yok.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {developers.map((dev) => (
                  <div key={dev.id} className="rounded-xl border border-ink/10 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={dev.full_name} role="developer" />
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {dev.full_name ?? "İsimsiz Yazılımcı"}
                      </h3>
                    </div>
                    {dev.bio && (
                      <p className="mt-2 text-sm text-ink-soft">{dev.bio}</p>
                    )}
                    {dev.skills && dev.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {dev.skills.map((skill: string) => (
                          <span key={skill} className="rounded-full bg-periwinkle/20 px-3 py-1 font-mono text-xs text-ink">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}