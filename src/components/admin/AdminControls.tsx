import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

import { toast } from "sonner";
import type { Product, Livestock, RealEstate } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

import { ProductForm, LivestockForm, RealEstateForm, DeleteConfirm } from "./Forms";


type Kind = "product" | "livestock" | "real_estate";

type BaseItem = Product | Livestock | RealEstate;

const META: Record<
  Kind,
  {
    table: "products" | "livestock" | "real_estate";
    queryKey: string;
    codeField: string;
    label: string;
  }
> = {
  product: { table: "products", queryKey: "products", codeField: "product_code", label: "product" },
  livestock: {
    table: "livestock",
    queryKey: "livestock",
    codeField: "livestock_code",
    label: "livestock",
  },
  real_estate: {
    table: "real_estate",
    queryKey: "real-estate",
    codeField: "property_code",
    label: "property",
  },
};

export function AddButton({ kind, label }: { kind: Kind; label?: string }) {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const m = META[kind];



  const save = useMutation({
    mutationFn: async (p: Record<string, unknown>) => {
      const payload = { ...p };
      delete payload.id;
      delete payload[m.codeField];
      delete payload.created_at;
      const { error } = await supabase.from(m.table).insert(payload as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Added");
      qc.invalidateQueries({ queryKey: [m.queryKey] });
      setOpen(false);
    },
    onError: (e) => toast.error((e as Error).message),
  });

  if (!isAdmin) return null;

  return (

    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-gold text-gold-foreground text-sm font-semibold whitespace-nowrap hover:opacity-90"
      >
        <Plus className="w-4 h-4" /> {label ?? `Add ${m.label}`}
      </button>
      {open && kind === "product" && (
        <ProductForm
          initial={{}}
          onClose={() => setOpen(false)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
      {open && kind === "livestock" && (
        <LivestockForm
          initial={{}}
          onClose={() => setOpen(false)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
      {open && kind === "real_estate" && (
        <RealEstateForm
          initial={{}}
          onClose={() => setOpen(false)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
    </>
  );
}

export function AdminRowControls({
  kind,
  item,
}: {
  kind: Kind;
  item: Product | Livestock | RealEstate;
}) {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [del, setDel] = useState(false);
  const qc = useQueryClient();
  const m = META[kind];




  const save = useMutation({
    mutationFn: async (p: Record<string, unknown>) => {
      const payload = { ...p };
      delete payload.id;
      delete payload[m.codeField];
      delete payload.created_at;
      const { error } = await supabase
        .from(m.table)
        .update(payload as never)
        .eq("id", item.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: [m.queryKey] });
      setEditing(false);
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from(m.table).delete().eq("id", item.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: [m.queryKey] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <>
      <div className="flex gap-2 px-4 pb-4 -mt-2">
        <button
          onClick={() => setEditing(true)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          onClick={() => setDel(true)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-destructive/40 text-destructive text-xs font-medium hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
      {editing && kind === "product" && (
        <ProductForm
          initial={item as Product}
          onClose={() => setEditing(false)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
      {editing && kind === "livestock" && (
        <LivestockForm
          initial={item as Livestock}
          onClose={() => setEditing(false)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
      {editing && kind === "real_estate" && (
        <RealEstateForm
          initial={item as RealEstate}
          onClose={() => setEditing(false)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
      <DeleteConfirm
        open={del}
        onClose={() => setDel(false)}
        name={item.name}
        onConfirm={() => remove.mutate()}
      />
    </>
  );
}
