import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Pencil,
  Plus,
  Trash2,
  ShoppingBag,
  Beef,
  Trees,
  ClipboardList,
  MessageSquare,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/Loader";
import {
  ProductForm,
  LivestockForm,
  RealEstateForm,
  DeleteConfirm,
} from "@/components/admin/Forms";
import { toast } from "sonner";
import type { Product, Livestock, RealEstate, Order, ContactMessage } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Tab = "dashboard" | "products" | "livestock" | "real_estate" | "orders" | "messages";

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");

  if (loading) return <Loader />;
  if (!isAdmin)
    return (
      <div className="max-w-md mx-auto py-32 text-center">
        <h1 className="font-display text-2xl font-bold">Admins only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in, but your account doesn't have admin access.
        </p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Back home
        </button>
      </div>
    );

  const tabs: { key: Tab; label: string; icon: LucideIcon }[] = [
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
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← View site
        </Link>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${tab === t.key ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
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
      return {
        p: p.count ?? 0,
        l: l.count ?? 0,
        r: r.count ?? 0,
        o: o.count ?? 0,
        m: m.count ?? 0,
      };
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
          <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============== HELPERS ==============
function CrudShell<T extends { id: string }>({
  title,
  rows,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  render,
}: {
  title: string;
  rows: T[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (r: T) => void;
  onDelete: (r: T) => void;
  render: (r: T) => React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto glass rounded-2xl">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3 hidden md:table-cell">Details</th>
                <th className="p-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/50 last:border-0">
                  {render(r)}
                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEdit(r)}
                      className="p-2 rounded-md hover:bg-accent text-muted-foreground"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(r)}
                      className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted-foreground">
                    No items yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============== PRODUCTS ==============
function ProductsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [del, setDel] = useState<Product | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
  const save = useMutation({
    mutationFn: async (p: Partial<Product>) => {
      const payload: any = { ...p };
      delete payload.id;
      delete payload.product_code;
      delete payload.created_at;
      if (p.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
    },
    onError: (e) => toast.error((e as Error).message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <>
      <CrudShell
        title="Products"
        rows={data}
        isLoading={isLoading}
        onAdd={() => setEditing({})}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => setDel(r)}
        render={(r) => (
          <>
            <td className="p-3">
              <div className="flex items-center gap-3">
                {r.image_url && (
                  <img src={r.image_url} className="w-10 h-10 rounded object-cover" alt="" />
                )}
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.product_code} · {r.category}
                  </div>
                </div>
              </div>
            </td>
            <td className="p-3 hidden md:table-cell text-muted-foreground">
              ₹{r.price} · stock {r.stock} {r.featured && "· Featured"} {r.organic && "· Organic"}
            </td>
          </>
        )}
      />
      {editing && (
        <ProductForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
      <DeleteConfirm
        open={!!del}
        onClose={() => setDel(null)}
        name={del?.name ?? ""}
        onConfirm={() => del && remove.mutate(del.id)}
      />
    </>
  );
}

// ============== LIVESTOCK ==============
function LivestockAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Livestock> | null>(null);
  const [del, setDel] = useState<Livestock | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-livestock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("livestock")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Livestock[];
    },
  });
  const save = useMutation({
    mutationFn: async (p: Partial<Livestock>) => {
      const payload: any = { ...p };
      delete payload.id;
      delete payload.livestock_code;
      delete payload.created_at;
      if (p.id) {
        const { error } = await supabase.from("livestock").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("livestock").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-livestock"] });
      qc.invalidateQueries({ queryKey: ["livestock"] });
      setEditing(null);
    },
    onError: (e) => toast.error((e as Error).message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("livestock").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-livestock"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <>
      <CrudShell
        title="Livestock"
        rows={data}
        isLoading={isLoading}
        onAdd={() => setEditing({})}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => setDel(r)}
        render={(r) => (
          <>
            <td className="p-3">
              <div className="flex items-center gap-3">
                {r.images?.[0] && (
                  <img src={r.images[0]} className="w-10 h-10 rounded object-cover" alt="" />
                )}
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.livestock_code} · {r.breed}
                  </div>
                </div>
              </div>
            </td>
            <td className="p-3 hidden md:table-cell text-muted-foreground">
              ₹{r.price.toLocaleString("en-IN")} · {r.location}
            </td>
          </>
        )}
      />
      {editing && (
        <LivestockForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
      <DeleteConfirm
        open={!!del}
        onClose={() => setDel(null)}
        name={del?.name ?? ""}
        onConfirm={() => del && remove.mutate(del.id)}
      />
    </>
  );
}

// ============== REAL ESTATE ==============
function RealEstateAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<RealEstate> | null>(null);
  const [del, setDel] = useState<RealEstate | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-real-estate"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("real_estate")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RealEstate[];
    },
  });
  const save = useMutation({
    mutationFn: async (p: Partial<RealEstate>) => {
      const payload: any = { ...p };
      delete payload.id;
      delete payload.property_code;
      delete payload.created_at;
      if (p.id) {
        const { error } = await supabase.from("real_estate").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("real_estate").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-real-estate"] });
      qc.invalidateQueries({ queryKey: ["real-estate"] });
      setEditing(null);
    },
    onError: (e) => toast.error((e as Error).message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("real_estate").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-real-estate"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <>
      <CrudShell
        title="Real Estate"
        rows={data}
        isLoading={isLoading}
        onAdd={() => setEditing({})}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => setDel(r)}
        render={(r) => (
          <>
            <td className="p-3">
              <div className="flex items-center gap-3">
                {r.images?.[0] && (
                  <img src={r.images[0]} className="w-10 h-10 rounded object-cover" alt="" />
                )}
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.property_code} · {r.size}
                  </div>
                </div>
              </div>
            </td>
            <td className="p-3 hidden md:table-cell text-muted-foreground">
              ₹{(r.price / 100000).toFixed(1)}L · {r.location}
            </td>
          </>
        )}
      />
      {editing && (
        <RealEstateForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
      <DeleteConfirm
        open={!!del}
        onClose={() => setDel(null)}
        name={del?.name ?? ""}
        onConfirm={() => del && remove.mutate(del.id)}
      />
    </>
  );
}

// ============== ORDERS ==============
function OrdersAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  if (isLoading) return <Loader />;
  return (
    <div className="glass rounded-2xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="p-3">Customer</th>
            <th className="p-3 hidden md:table-cell">Address</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3 hidden sm:table-cell">When</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o: any) => (
            <tr key={o.id} className="border-b border-border/50 last:border-0">
              <td className="p-3">
                <div className="font-medium">{o.customer_name}</div>
                <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
              </td>
              <td className="p-3 hidden md:table-cell text-muted-foreground text-xs max-w-xs">
                {o.customer_address}
              </td>
              <td className="p-3 font-semibold">
                ₹{Number(o.total_amount).toLocaleString("en-IN")}
              </td>
              <td className="p-3">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                  className="px-2 py-1 bg-input rounded-md text-xs"
                >
                  <option>pending</option>
                  <option>confirmed</option>
                  <option>shipped</option>
                  <option>delivered</option>
                  <option>cancelled</option>
                </select>
              </td>
              <td className="p-3 hidden sm:table-cell text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                No orders yet.
              </td>
            </tr>
          )}
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
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });
  if (isLoading) return <Loader />;
  return (
    <div className="space-y-3">
      {data.map((m: any) => (
        <div key={m.id} className="glass rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">
                {m.name}{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  · {m.email} {m.phone && `· ${m.phone}`}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => remove.mutate(m.id)}
              className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No messages yet.</div>
      )}
    </div>
  );
}
