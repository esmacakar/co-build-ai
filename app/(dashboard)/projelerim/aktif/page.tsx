import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Avatar from "@/app/components/avatar";

export default async function UzerindeCalistiklarim() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  // Sadece yazılımcılar bu sayfayı görebilir
  if (profile?.user_type !== "developer") {
    redirect("/panel");
  }

  const { data: offers } = await supabase
    .from("offers")
    .select("id, project_id, payment_type, proposed_amount")
    .eq("developer_id", user.id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  const projectIds = (offers ?? []).map((o) => o.project_id);

  let projects: { id: string; title: string; founder_id: string }[] = [];
  let founders: { id: string; full_name: string | null }[] = [];

  if (projectIds.length > 0) {
    const { data: projectsData } = await supabase
      .from("projects")
      .select("id, title, founder_id")
      .in("id", projectIds);
    projects = projectsData ?? [];

    const founderIds = [...new Set(projects.map((p) => p.founder_id))];
    if (founderIds.length > 0) {
      const { data: foundersData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", founderIds);
      founders = foundersData ?? [];
    }
  }

  const items = (offers ?? []).map((o) => {
    const project = projects.find((p) => p.id === o.project_id);
    const founder = project ? founders.find((f) => f.id === project.founder_id) : null;
    return { ...o, project, founder };
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Üzerinde Çalıştıklarım</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Teklifin kabul edildiği, şu an aktif olarak çalıştığın projeler.
      </p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
          <p className="text-2xl">🛠️</p>
          <p className="mt-2 text-sm text-ink-soft">
            Henüz üzerinde çalıştığın bir proje yok — teklifin kabul edildiğinde burada görünecek.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.project ? `/proje/${item.project.id}` : "#"}
              className="block rounded-xl border border-ink/10 bg-white p-5 transition-colors hover:border-coral/40"
            >
              <h3 className="font-display text-lg font-semibold text-ink">
                {item.project?.title ?? "Bilinmeyen Proje"}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <Avatar name={item.founder?.full_name ?? null} role="founder" size="sm" />
                <span className="text-xs text-ink-soft">
                  {item.founder?.full_name ?? "İsimsiz Fikir Sahibi"}
                </span>
              </div>
              {item.payment_type && (
                <p className="mt-2 text-sm text-ink-soft">
                  <span className="font-semibold text-ink">Anlaşma:</span>{" "}
                  {item.payment_type === "fixed" ? "Sabit Ücret" : "Ortaklık"}
                  {item.proposed_amount
                    ? ` — ${item.proposed_amount}${item.payment_type === "fixed" ? "₺" : "%"}`
                    : ""}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
