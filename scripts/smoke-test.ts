/**
 * Database & RLS smoke tests.
 * Runs against the project's public Data API using the publishable (anon) key.
 * Verifies:
 *   1. Supabase connection works.
 *   2. Public reads succeed on marketplace tables.
 *   3. RLS blocks anonymous writes on protected tables.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type Result = { name: string; ok: boolean; detail?: string };
const results: Result[] = [];

async function check(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (e) {
    results.push({ name, ok: false, detail: (e as Error).message });
  }
}

await check("read products", async () => {
  const { error } = await supabase.from("products").select("id").limit(1);
  if (error) throw error;
});

await check("read livestock", async () => {
  const { error } = await supabase.from("livestock").select("id").limit(1);
  if (error) throw error;
});

await check("read real_estate", async () => {
  const { error } = await supabase.from("real_estate").select("id").limit(1);
  if (error) throw error;
});

await check("RLS blocks anon insert into orders", async () => {
  const { error } = await supabase
    .from("orders")
    .insert({ total_amount: 1 } as never);
  if (!error) throw new Error("Expected RLS to block anonymous insert");
});

await check("RLS blocks anon read of user_roles", async () => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("user_id")
    .limit(1);
  // Either the request errors OR returns zero rows for anon — both acceptable.
  if (!error && data && data.length > 0) {
    throw new Error("Anon should not see user_roles rows");
  }
});

let failed = 0;
for (const r of results) {
  const mark = r.ok ? "✓" : "✗";
  console.log(`${mark} ${r.name}${r.detail ? " — " + r.detail : ""}`);
  if (!r.ok) failed++;
}

if (failed > 0) {
  console.error(`\n${failed} smoke test(s) failed`);
  process.exit(1);
}
console.log(`\nAll ${results.length} smoke tests passed`);
