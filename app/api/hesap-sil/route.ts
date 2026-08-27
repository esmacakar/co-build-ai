import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
  }

  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = user.id;

  // Bu kullanıcının founder olarak sahip olduğu projeler
  const { data: ownProjects } = await admin
    .from("projects")
    .select("id")
    .eq("founder_id", userId);
  const ownProjectIds = (ownProjects ?? []).map((p) => p.id);

  // Bu kullanıcının developer olarak verdiği + kendi projelerine gelen teklifler
  const { data: devOffers } = await admin.from("offers").select("id").eq("developer_id", userId);
  let projectOffers: { id: string }[] = [];
  if (ownProjectIds.length > 0) {
    const { data } = await admin.from("offers").select("id").in("project_id", ownProjectIds);
    projectOffers = data ?? [];
  }
  const offerIds = [...new Set([...(devOffers ?? []), ...projectOffers].map((o) => o.id))];

  // Puanlar tekliflere bağlı, o yüzden tekliflerden ÖNCE silinmeli
  if (offerIds.length > 0) {
    await admin.from("ratings").delete().in("offer_id", offerIds);
    await admin.from("messages").delete().in("offer_id", offerIds);
    await admin.from("offers").delete().in("id", offerIds);
  }

  await admin.from("notifications").delete().eq("user_id", userId);
  if (ownProjectIds.length > 0) {
    await admin.from("notifications").delete().in("project_id", ownProjectIds);
  }

  await admin.from("project_nda_acceptances").delete().eq("developer_id", userId);
  await admin.from("project_views").delete().eq("viewer_id", userId);
  if (ownProjectIds.length > 0) {
    await admin.from("project_nda_acceptances").delete().in("project_id", ownProjectIds);
    await admin.from("project_views").delete().in("project_id", ownProjectIds);
  }

  await admin.from("portfolio_items").delete().eq("developer_id", userId);

  if (ownProjectIds.length > 0) {
    await admin.from("projects").delete().in("id", ownProjectIds);
  }

  // Profil silinmeden önce, bu kullanıcıyı işaret eden puanlar temizlenmeli
  // (yukarıdaki teklif bazlı silme bunları çoğunlukla kapsar, bu bir güvence)
  await admin.from("ratings").delete().eq("rater_id", userId);
  await admin.from("ratings").delete().eq("rated_user_id", userId);

  await admin.from("profiles").delete().eq("id", userId);

  const { error: deleteUserError } = await admin.auth.admin.deleteUser(userId);

  if (deleteUserError) {
    return NextResponse.json({ error: deleteUserError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
