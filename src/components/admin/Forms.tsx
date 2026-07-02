import { useState, type FormEvent, type ReactNode } from "react";
import { Modal } from "./Modal";
import { ImageUploader } from "./ImageUploader";
import type { Product, Livestock, RealEstate } from "@/lib/types";

export const input =
  "w-full px-3 py-2 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function DeleteConfirm({
  open,
  onClose,
  onConfirm,
  name,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Delete this item?">
      <p className="text-sm text-muted-foreground">
        This will permanently remove <span className="text-foreground font-medium">{name}</span>.
      </p>
      <div className="mt-6 flex gap-2 justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-md border border-border text-sm">
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

function csv(v: string[] | null | undefined) {
  return (v ?? []).join(", ");
}
function parseCsv(v: string) {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProductForm({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial: Partial<Product>;
  onClose: () => void;
  onSave: (v: Partial<Product>) => void;
  saving: boolean;
}) {
  const [f, setF] = useState<Partial<Product>>(initial);
  function submit(e: FormEvent) {
    e.preventDefault();
    onSave(f);
  }
  return (
    <Modal open onClose={onClose} title={initial.id ? "Edit product" : "New product"} wide>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <Field label="Name">
          <input
            className={input}
            required
            value={f.name ?? ""}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        </Field>
        <Field label="Category">
          <input
            className={input}
            value={f.category ?? ""}
            onChange={(e) => setF({ ...f, category: e.target.value })}
          />
        </Field>
        <Field label="Description">
          <textarea
            className={input}
            rows={2}
            value={f.description ?? ""}
            onChange={(e) => setF({ ...f, description: e.target.value })}
          />
        </Field>
        <Field label="Unit">
          <input
            className={input}
            value={f.unit ?? ""}
            onChange={(e) => setF({ ...f, unit: e.target.value })}
          />
        </Field>
        <Field label="Price (₹)">
          <input
            type="number"
            className={input}
            value={f.price ?? 0}
            onChange={(e) => setF({ ...f, price: Number(e.target.value) })}
          />
        </Field>
        <Field label="Discount %">
          <input
            type="number"
            className={input}
            value={f.discount_percent ?? 0}
            onChange={(e) => setF({ ...f, discount_percent: Number(e.target.value) })}
          />
        </Field>
        <Field label="Stock">
          <input
            type="number"
            className={input}
            value={f.stock ?? 0}
            onChange={(e) => setF({ ...f, stock: Number(e.target.value) })}
          />
        </Field>
        <Field label="Freshness">
          <input
            className={input}
            value={f.freshness ?? ""}
            onChange={(e) => setF({ ...f, freshness: e.target.value })}
          />
        </Field>
        <div className="col-span-2">
          <Field label="Image">
            <ImageUploader
              bucket="products"
              value={f.image_url ?? null}
              onChange={(v) => setF({ ...f, image_url: v as string })}
            />
          </Field>
        </div>
        <div className="col-span-2 flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!f.featured}
              onChange={(e) => setF({ ...f, featured: e.target.checked })}
            />{" "}
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!f.organic}
              onChange={(e) => setF({ ...f, organic: e.target.checked })}
            />{" "}
            Organic
          </label>
        </div>
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border text-sm"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function LivestockForm({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial: Partial<Livestock>;
  onClose: () => void;
  onSave: (v: Partial<Livestock>) => void;
  saving: boolean;
}) {
  const [f, setF] = useState<Partial<Livestock>>(initial);
  return (
    <Modal open onClose={onClose} title={initial.id ? "Edit livestock" : "New livestock"} wide>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(f);
        }}
        className="grid grid-cols-2 gap-3"
      >
        <Field label="Name">
          <input
            className={input}
            required
            value={f.name ?? ""}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        </Field>
        <Field label="Category">
          <input
            className={input}
            value={f.category ?? ""}
            onChange={(e) => setF({ ...f, category: e.target.value })}
          />
        </Field>
        <Field label="Breed">
          <input
            className={input}
            value={f.breed ?? ""}
            onChange={(e) => setF({ ...f, breed: e.target.value })}
          />
        </Field>
        <Field label="Price (₹)">
          <input
            type="number"
            className={input}
            value={f.price ?? 0}
            onChange={(e) => setF({ ...f, price: Number(e.target.value) })}
          />
        </Field>
        <Field label="Age">
          <input
            className={input}
            value={f.age ?? ""}
            onChange={(e) => setF({ ...f, age: e.target.value })}
          />
        </Field>
        <Field label="Weight">
          <input
            className={input}
            value={f.weight ?? ""}
            onChange={(e) => setF({ ...f, weight: e.target.value })}
          />
        </Field>
        <Field label="Milk yield">
          <input
            className={input}
            value={f.milk_yield ?? ""}
            onChange={(e) => setF({ ...f, milk_yield: e.target.value })}
          />
        </Field>
        <Field label="Health">
          <input
            className={input}
            value={f.health ?? ""}
            onChange={(e) => setF({ ...f, health: e.target.value })}
          />
        </Field>
        <Field label="Vaccination">
          <input
            className={input}
            value={f.vaccination ?? ""}
            onChange={(e) => setF({ ...f, vaccination: e.target.value })}
          />
        </Field>
        <Field label="Location">
          <input
            className={input}
            value={f.location ?? ""}
            onChange={(e) => setF({ ...f, location: e.target.value })}
          />
        </Field>
        <Field label="Seller name">
          <input
            className={input}
            value={f.seller_name ?? ""}
            onChange={(e) => setF({ ...f, seller_name: e.target.value })}
          />
        </Field>
        <Field label="Seller phone">
          <input
            className={input}
            value={f.seller_phone ?? ""}
            onChange={(e) => setF({ ...f, seller_phone: e.target.value })}
          />
        </Field>
        <div className="col-span-2">
          <Field label="Description">
            <textarea
              rows={2}
              className={input}
              value={f.description ?? ""}
              onChange={(e) => setF({ ...f, description: e.target.value })}
            />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Images">
            <ImageUploader
              bucket="livestock"
              multiple
              value={f.images ?? []}
              onChange={(v) => setF({ ...f, images: v as string[] })}
            />
          </Field>
        </div>
        <div className="col-span-2 flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!f.featured}
              onChange={(e) => setF({ ...f, featured: e.target.checked })}
            />{" "}
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!f.seller_verified}
              onChange={(e) => setF({ ...f, seller_verified: e.target.checked })}
            />{" "}
            Verified seller
          </label>
        </div>
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border text-sm"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function RealEstateForm({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial: Partial<RealEstate>;
  onClose: () => void;
  onSave: (v: Partial<RealEstate>) => void;
  saving: boolean;
}) {
  const [f, setF] = useState<Partial<RealEstate>>(initial);
  return (
    <Modal open onClose={onClose} title={initial.id ? "Edit property" : "New property"} wide>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(f);
        }}
        className="grid grid-cols-2 gap-3"
      >
        <Field label="Name">
          <input
            className={input}
            required
            value={f.name ?? ""}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        </Field>
        <Field label="Location">
          <input
            className={input}
            value={f.location ?? ""}
            onChange={(e) => setF({ ...f, location: e.target.value })}
          />
        </Field>
        <Field label="Size">
          <input
            className={input}
            value={f.size ?? ""}
            onChange={(e) => setF({ ...f, size: e.target.value })}
          />
        </Field>
        <Field label="Price (₹)">
          <input
            type="number"
            className={input}
            value={f.price ?? 0}
            onChange={(e) => setF({ ...f, price: Number(e.target.value) })}
          />
        </Field>
        <Field label="Price / acre (₹)">
          <input
            type="number"
            className={input}
            value={f.price_per_acre ?? 0}
            onChange={(e) => setF({ ...f, price_per_acre: Number(e.target.value) })}
          />
        </Field>
        <Field label="Water source">
          <input
            className={input}
            value={f.water_source ?? ""}
            onChange={(e) => setF({ ...f, water_source: e.target.value })}
          />
        </Field>
        <Field label="Soil type">
          <input
            className={input}
            value={f.soil_type ?? ""}
            onChange={(e) => setF({ ...f, soil_type: e.target.value })}
          />
        </Field>
        <Field label="Owner name">
          <input
            className={input}
            value={f.owner_name ?? ""}
            onChange={(e) => setF({ ...f, owner_name: e.target.value })}
          />
        </Field>
        <Field label="Owner phone">
          <input
            className={input}
            value={f.owner_phone ?? ""}
            onChange={(e) => setF({ ...f, owner_phone: e.target.value })}
          />
        </Field>
        <div className="col-span-2">
          <Field label="Description">
            <textarea
              rows={2}
              className={input}
              value={f.description ?? ""}
              onChange={(e) => setF({ ...f, description: e.target.value })}
            />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Suitable for (comma separated)">
            <input
              className={input}
              defaultValue={csv(f.suitable_for)}
              onChange={(e) => setF({ ...f, suitable_for: parseCsv(e.target.value) })}
            />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Amenities (comma separated)">
            <input
              className={input}
              defaultValue={csv(f.amenities)}
              onChange={(e) => setF({ ...f, amenities: parseCsv(e.target.value) })}
            />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Images">
            <ImageUploader
              bucket="real-estate"
              multiple
              value={f.images ?? []}
              onChange={(v) => setF({ ...f, images: v as string[] })}
            />
          </Field>
        </div>
        <div className="col-span-2 flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!f.featured}
              onChange={(e) => setF({ ...f, featured: e.target.checked })}
            />{" "}
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!f.verified}
              onChange={(e) => setF({ ...f, verified: e.target.checked })}
            />{" "}
            Verified
          </label>
        </div>
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border text-sm"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
