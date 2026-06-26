import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, ShoppingBag, Beef, Trees, ClipboardList, MessageSquare, LayoutDashboard } from "lucide-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/Loader";
import { Modal } from "@/components/admin/Modal";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";
import type { Product, Livestock, RealEstate } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Tab = "dashboard" | "products" | "livestock" | "real_estate" | "orders" | "messages";

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");

  if (loading) return <Loader />;
  if (!isAdmin) return (
    <div className="max-w-md mx-auto py-32 text-center">
      <h1 className="font-display text-2xl font-bold">Admins only</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You're signed in, but your account doesn't have admin access.
      </p>
      <button onClick={() => navigate({ to: "/" })} className="mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground">Back home</button>
    </div>
  );

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "dashboard", label: "Overview", icon: LayoutDashboard },
    { key: "products", label: "Products", icon: ShoppingBag },
    { key: "livestock", label: "Livestock", icon: Beef },
    { key: "real_estate", label: "Real Estate", icon: Trees },
    { key: "orders", label: "Orders", icon: ClipboardList },
    { key: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold">Admin</div>
          <h1 className="mt-1 font-display text-3xl font-bold">Dashboard</h1>
        </div>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← View site</Link>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border mb-8">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${tab === t.key ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <Overview />}
      {tab === "products" && <ProductsAdmin />}
      {tab === "livestock" && <LivestockAdmin />}
      {tab === "real_estate" && <RealEstateAdmin />}
      {tab === "orders" && <OrdersAdmin />}
      {tab === "messages" && <MessagesAdmin />}
    </div>
  );
}

// ============== OVERVIEW ==============
function Overview() {
  const { data } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [p, l, r, o, m] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("livestock").select("id", { count: "exact", head: true }),
        supabase.from("real_estate").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      ]);
      return { p: p.count ?? 0, l: l.count ?? 0, r: r.count ?? 0, o: o.count ?? 0, m: m.count ?? 0 };
    },
  });
  const cards = [
    { label: "Products", value: data?.p, icon: ShoppingBag },
    { label: "Livestock", value: data?.l, icon: Beef },
    { label: "Properties", value: data?.r, icon: Trees },
    { label: "Orders", value: data?.o, icon: ClipboardList },
    { label: "Messages", value: data?.m, icon: MessageSquare },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="glass rounded-2xl p-5">
          <c.icon className="w-5 h-5 text-gold" />
          <div className="mt-3 font-display text-3xl font-bold">{c.value ?? "—"}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

// ============== HELPERS ==============
function CrudShell<T extends { id: string }>({
  title, rows, isLoading, onAdd, onEdit, onDelete, render,
}: {
  title: string; rows: T[]; isLoading: boolean;
  onAdd: () => void; onEdit: (r: T) => void; onDelete: (r: T) => void;
  render: (r: T) => React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {isLoading ? <Loader /> : (
        <div className="overflow-x-auto glass rounded-2xl">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-3">Item</th><th className="p-3 hidden md:table-cell">Details</th><th className="p-3 w-24"></th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/50 last:border-0">
                  {render(r)}
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => onEdit(r)} className="p-2 rounded-md hover:bg-accent text-muted-foreground"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(r)} className="p-2 rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (<tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No items yet.</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DeleteConfirm({ open, onClose, onConfirm, name }: { open: boolean; onClose: () => void; onConfirm: () => void; name: string }) {
  return (
    <Modal open={open} onClose={onClose} title="Delete this item?">
      <p className="text-sm text-muted-foreground">This will permanently remove <span className="text-foreground font-medium">{name}</span>.</p>
      <div className="mt-6 flex gap-2 justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-md border border-border text-sm">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm">Delete</button>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const input = "w-full px-3 py-2 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary";

// ============== PRODUCTS ==============
function ProductsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [del, setDel] = useState<Product | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
  const save = useMutation({
    mutationFn: async (p: Partial<Product>) => {
      const payload: any = { ...p };
      delete payload.id; delete payload.product_code; delete payload.created_at;
      if (p.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["products"] }); setEditing(null); },
    onError: (e) => toast.error((e as Error).message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <>
      <CrudShell title="Products" rows={data} isLoading={isLoading}
        onAdd={() => setEditing({})}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => setDel(r)}
        render={(r) => (
          <>
            <td className="p-3">
              <div className="flex items-center gap-3">
                {r.image_url && <img src={r.image_url} className="w-10 h-10 rounded object-cover" alt="" />}
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.product_code} · {r.category}</div>
                </div>
              </div>
            </td>
            <td className="p-3 hidden md:table-cell text-muted-foreground">₹{r.price} · stock {r.stock} {r.featured && "· Featured"} {r.organic && "· Organic"}</td>
          </>
        )}
      />
      {editing && <ProductForm initial={editing} onClose={() => setEditing(null)} onSave={(v) => save.mutate(v)} saving={save.isPending} />}
      <DeleteConfirm open={!!del} onClose={() => setDel(null)} name={del?.name ?? ""} onConfirm={() => del && remove.mutate(del.id)} />
    </>
  );
}

function ProductForm({ initial, onClose, onSave, saving }: { initial: Partial<Product>; onClose: () => void; onSave: (v: Partial<Product>) => void; saving: boolean }) {
  const [f, setF] = useState<Partial<Product>>(initial);
  function submit(e: FormEvent) { e.preventDefault(); onSave(f); }
  return (
    <Modal open onClose={onClose} title={initial.id ? "Edit product" : "New product"} wide>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <Field label="Name"><input className={input} required value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Category"><input className={input} value={f.category ?? ""} onChange={(e) => setF({ ...f, category: e.target.value })} /></Field>
        <Field label="Description"><textarea className={input} rows={2} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <Field label="Unit"><input className={input} value={f.unit ?? ""} onChange={(e) => setF({ ...f, unit: e.target.value })} /></Field>
        <Field label="Price (₹)"><input type="number" className={input} value={f.price ?? 0} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} /></Field>
        <Field label="Discount %"><input type="number" className={input} value={f.discount_percent ?? 0} onChange={(e) => setF({ ...f, discount_percent: Number(e.target.value) })} /></Field>
        <Field label="Stock"><input type="number" className={input} value={f.stock ?? 0} onChange={(e) => setF({ ...f, stock: Number(e.target.value) })} /></Field>
        <Field label="Freshness"><input className={input} value={f.freshness ?? ""} onChange={(e) => setF({ ...f, freshness: e.target.value })} /></Field>
        <div className="col-span-2"><Field label="Image">
          <ImageUploader bucket="products" value={f.image_url ?? null} onChange={(v) => setF({ ...f, image_url: v as string })} />
        </Field></div>
        <div className="col-span-2 flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.organic} onChange={(e) => setF({ ...f, organic: e.target.checked })} /> Organic</label>
        </div>
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-border text-sm">Cancel</button>
          <button disabled={saving} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </Modal>
  );
}

// ============== LIVESTOCK ==============
function LivestockAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Livestock> | null>(null);
  const [del, setDel] = useState<Livestock | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-livestock"],
    queryFn: async () => { const { data, error } = await supabase.from("livestock").select("*").order("created_at", { ascending: false }); if (error) throw error; return (data ?? []) as Livestock[]; },
  });
  const save = useMutation({
    mutationFn: async (p: Partial<Livestock>) => {
      const payload: any = { ...p }; delete payload.id; delete payload.livestock_code; delete payload.created_at;
      if (p.id) { const { error } = await supabase.from("livestock").update(payload).eq("id", p.id); if (error) throw error; }
      else { const { error } = await supabase.from("livestock").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-livestock"] }); qc.invalidateQueries({ queryKey: ["livestock"] }); setEditing(null); },
    onError: (e) => toast.error((e as Error).message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("livestock").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-livestock"] }); },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <>
      <CrudShell title="Livestock" rows={data} isLoading={isLoading}
        onAdd={() => setEditing({})} onEdit={(r) => setEditing(r)} onDelete={(r) => setDel(r)}
        render={(r) => (<>
          <td className="p-3">
            <div className="flex items-center gap-3">
              {r.images?.[0] && <img src={r.images[0]} className="w-10 h-10 rounded object-cover" alt="" />}
              <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.livestock_code} · {r.breed}</div></div>
            </div>
          </td>
          <td className="p-3 hidden md:table-cell text-muted-foreground">₹{r.price.toLocaleString("en-IN")} · {r.location}</td>
        </>)}
      />
      {editing && <LivestockForm initial={editing} onClose={() => setEditing(null)} onSave={(v) => save.mutate(v)} saving={save.isPending} />}
      <DeleteConfirm open={!!del} onClose={() => setDel(null)} name={del?.name ?? ""} onConfirm={() => del && remove.mutate(del.id)} />
    </>
  );
}

function LivestockForm({ initial, onClose, onSave, saving }: { initial: Partial<Livestock>; onClose: () => void; onSave: (v: Partial<Livestock>) => void; saving: boolean }) {
  const [f, setF] = useState<Partial<Livestock>>(initial);
  return (
    <Modal open onClose={onClose} title={initial.id ? "Edit livestock" : "New livestock"} wide>
      <form onSubmit={(e) => { e.preventDefault(); onSave(f); }} className="grid grid-cols-2 gap-3">
        <Field label="Name"><input className={input} required value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Category"><input className={input} value={f.category ?? ""} onChange={(e) => setF({ ...f, category: e.target.value })} /></Field>
        <Field label="Breed"><input className={input} value={f.breed ?? ""} onChange={(e) => setF({ ...f, breed: e.target.value })} /></Field>
        <Field label="Price (₹)"><input type="number" className={input} value={f.price ?? 0} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} /></Field>
        <Field label="Age"><input className={input} value={f.age ?? ""} onChange={(e) => setF({ ...f, age: e.target.value })} /></Field>
        <Field label="Weight"><input className={input} value={f.weight ?? ""} onChange={(e) => setF({ ...f, weight: e.target.value })} /></Field>
        <Field label="Milk yield"><input className={input} value={f.milk_yield ?? ""} onChange={(e) => setF({ ...f, milk_yield: e.target.value })} /></Field>
        <Field label="Health"><input className={input} value={f.health ?? ""} onChange={(e) => setF({ ...f, health: e.target.value })} /></Field>
        <Field label="Vaccination"><input className={input} value={f.vaccination ?? ""} onChange={(e) => setF({ ...f, vaccination: e.target.value })} /></Field>
        <Field label="Location"><input className={input} value={f.location ?? ""} onChange={(e) => setF({ ...f, location: e.target.value })} /></Field>
        <Field label="Seller name"><input className={input} value={f.seller_name ?? ""} onChange={(e) => setF({ ...f, seller_name: e.target.value })} /></Field>
        <Field label="Seller phone"><input className={input} value={f.seller_phone ?? ""} onChange={(e) => setF({ ...f, seller_phone: e.target.value })} /></Field>
        <div className="col-span-2"><Field label="Description"><textarea rows={2} className={input} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field></div>
        <div className="col-span-2"><Field label="Images"><ImageUploader bucket="livestock" multiple value={f.images ?? []} onChange={(v) => setF({ ...f, images: v as string[] })} /></Field></div>
        <div className="col-span-2 flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.seller_verified} onChange={(e) => setF({ ...f, seller_verified: e.target.checked })} /> Verified seller</label>
        </div>
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-border text-sm">Cancel</button>
          <button disabled={saving} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </Modal>
  );
}

// ============== REAL ESTATE ==============
function RealEstateAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<RealEstate> | null>(null);
  const [del, setDel] = useState<RealEstate | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-real-estate"],
    queryFn: async () => { const { data, error } = await supabase.from("real_estate").select("*").order("created_at", { ascending: false }); if (error) throw error; return (data ?? []) as RealEstate[]; },
  });
  const save = useMutation({
    mutationFn: async (p: Partial<RealEstate>) => {
      const payload: any = { ...p }; delete payload.id; delete payload.property_code; delete payload.created_at;
      if (p.id) { const { error } = await supabase.from("real_estate").update(payload).eq("id", p.id); if (error) throw error; }
      else { const { error } = await supabase.from("real_estate").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-real-estate"] }); qc.invalidateQueries({ queryKey: ["real-estate"] }); setEditing(null); },
    onError: (e) => toast.error((e as Error).message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("real_estate").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-real-estate"] }); },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <>
      <CrudShell title="Real Estate" rows={data} isLoading={isLoading}
        onAdd={() => setEditing({})} onEdit={(r) => setEditing(r)} onDelete={(r) => setDel(r)}
        render={(r) => (<>
          <td className="p-3">
            <div className="flex items-center gap-3">
              {r.images?.[0] && <img src={r.images[0]} className="w-10 h-10 rounded object-cover" alt="" />}
              <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.property_code} · {r.size}</div></div>
            </div>
          </td>
          <td className="p-3 hidden md:table-cell text-muted-foreground">₹{(r.price / 100000).toFixed(1)}L · {r.location}</td>
        </>)}
      />
      {editing && <RealEstateForm initial={editing} onClose={() => setEditing(null)} onSave={(v) => save.mutate(v)} saving={save.isPending} />}
      <DeleteConfirm open={!!del} onClose={() => setDel(null)} name={del?.name ?? ""} onConfirm={() => del && remove.mutate(del.id)} />
    </>
  );
}

function csv(v: string[] | null | undefined) { return (v ?? []).join(", "); }
function parseCsv(v: string) { return v.split(",").map((s) => s.trim()).filter(Boolean); }

function RealEstateForm({ initial, onClose, onSave, saving }: { initial: Partial<RealEstate>; onClose: () => void; onSave: (v: Partial<RealEstate>) => void; saving: boolean }) {
  const [f, setF] = useState<Partial<RealEstate>>(initial);
  return (
    <Modal open onClose={onClose} title={initial.id ? "Edit property" : "New property"} wide>
      <form onSubmit={(e) => { e.preventDefault(); onSave(f); }} className="grid grid-cols-2 gap-3">
        <Field label="Name"><input className={input} required value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Location"><input className={input} value={f.location ?? ""} onChange={(e) => setF({ ...f, location: e.target.value })} /></Field>
        <Field label="Size"><input className={input} value={f.size ?? ""} onChange={(e) => setF({ ...f, size: e.target.value })} /></Field>
        <Field label="Price (₹)"><input type="number" className={input} value={f.price ?? 0} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} /></Field>
        <Field label="Price / acre (₹)"><input type="number" className={input} value={f.price_per_acre ?? 0} onChange={(e) => setF({ ...f, price_per_acre: Number(e.target.value) })} /></Field>
        <Field label="Water source"><input className={input} value={f.water_source ?? ""} onChange={(e) => setF({ ...f, water_source: e.target.value })} /></Field>
        <Field label="Soil type"><input className={input} value={f.soil_type ?? ""} onChange={(e) => setF({ ...f, soil_type: e.target.value })} /></Field>
        <Field label="Owner name"><input className={input} value={f.owner_name ?? ""} onChange={(e) => setF({ ...f, owner_name: e.target.value })} /></Field>
        <Field label="Owner phone"><input className={input} value={f.owner_phone ?? ""} onChange={(e) => setF({ ...f, owner_phone: e.target.value })} /></Field>
        <div className="col-span-2"><Field label="Description"><textarea rows={2} className={input} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field></div>
        <div className="col-span-2"><Field label="Suitable for (comma separated)"><input className={input} defaultValue={csv(f.suitable_for)} onChange={(e) => setF({ ...f, suitable_for: parseCsv(e.target.value) })} /></Field></div>
        <div className="col-span-2"><Field label="Amenities (comma separated)"><input className={input} defaultValue={csv(f.amenities)} onChange={(e) => setF({ ...f, amenities: parseCsv(e.target.value) })} /></Field></div>
        <div className="col-span-2"><Field label="Images"><ImageUploader bucket="real-estate" multiple value={f.images ?? []} onChange={(v) => setF({ ...f, images: v as string[] })} /></Field></div>
        <div className="col-span-2 flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.verified} onChange={(e) => setF({ ...f, verified: e.target.checked })} /> Verified</label>
        </div>
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-border text-sm">Cancel</button>
          <button disabled={saving} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </Modal>
  );
}

// ============== ORDERS ==============
function OrdersAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => { const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }); if (error) throw error; return data ?? []; },
  });
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("orders").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-orders"] }); },
  });

  if (isLoading) return <Loader />;
  return (
    <div className="glass rounded-2xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr><th className="p-3">Customer</th><th className="p-3 hidden md:table-cell">Address</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3 hidden sm:table-cell">When</th></tr>
        </thead>
        <tbody>
          {data.map((o: any) => (
            <tr key={o.id} className="border-b border-border/50 last:border-0">
              <td className="p-3"><div className="font-medium">{o.customer_name}</div><div className="text-xs text-muted-foreground">{o.customer_phone}</div></td>
              <td className="p-3 hidden md:table-cell text-muted-foreground text-xs max-w-xs">{o.customer_address}</td>
              <td className="p-3 font-semibold">₹{Number(o.total_amount).toLocaleString("en-IN")}</td>
              <td className="p-3">
                <select value={o.status} onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                  className="px-2 py-1 bg-input rounded-md text-xs">
                  <option>pending</option><option>confirmed</option><option>shipped</option><option>delivered</option><option>cancelled</option>
                </select>
              </td>
              <td className="p-3 hidden sm:table-cell text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No orders yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

// ============== MESSAGES ==============
function MessagesAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => { const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }); if (error) throw error; return data ?? []; },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("contact_messages").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-messages"] }); },
  });
  if (isLoading) return <Loader />;
  return (
    <div className="space-y-3">
      {data.map((m: any) => (
        <div key={m.id} className="glass rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{m.name} <span className="text-xs text-muted-foreground font-normal">· {m.email} {m.phone && `· ${m.phone}`}</span></div>
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
              <div className="mt-2 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
            </div>
            <button onClick={() => remove.mutate(m.id)} className="p-2 rounded-md hover:bg-destructive/10 text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      {data.length === 0 && <div className="text-center py-12 text-muted-foreground">No messages yet.</div>}
    </div>
  );
}
