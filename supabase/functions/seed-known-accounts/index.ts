// One-shot seeder: creates the two demo accounts (member + admin) with known
// credentials, marks them Active, and assigns admin role to the admin profile.
// Idempotent: re-running upserts cleanly. Public, no auth required, but only
// inserts the two specific allowed emails.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACCOUNTS = [
  {
    email: "member.thakira@gmail.com",
    password: "MemberAccess2026",
    display_name: "Community Member",
    is_admin: false,
  },
  {
    email: "admin.thakira@gmail.com",
    password: "AdminSecure2026",
    display_name: "Thakira Administrator",
    is_admin: true,
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  const results: Record<string, unknown>[] = [];

  for (const acct of ACCOUNTS) {
    // Try to find existing user
    const { data: list } = await admin.auth.admin.listUsers();
    let user = list?.users.find((u) => u.email?.toLowerCase() === acct.email.toLowerCase());

    if (!user) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: acct.email,
        password: acct.password,
        email_confirm: true,
        user_metadata: { display_name: acct.display_name },
      });
      if (createErr) {
        results.push({ email: acct.email, ok: false, error: createErr.message });
        continue;
      }
      user = created.user!;
    } else {
      // Reset password & confirm in case it drifted.
      await admin.auth.admin.updateUserById(user.id, {
        password: acct.password,
        email_confirm: true,
        user_metadata: { display_name: acct.display_name },
      });
    }

    // Ensure profile row reflects desired state (trigger inserts default; we update flags)
    await admin.from("profiles").upsert({
      id: user.id,
      email: acct.email,
      display_name: acct.display_name,
      status: "Active",
      is_admin: acct.is_admin,
    });

    // Ensure role row
    if (acct.is_admin) {
      await admin.from("user_roles").upsert(
        { user_id: user.id, role: "admin" },
        { onConflict: "user_id,role" },
      );
    }

    results.push({ email: acct.email, ok: true, user_id: user.id });
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
