import { useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadImage } from "@/lib/storage";
import { toast } from "sonner";

type Bucket = "products" | "livestock" | "real-estate";

export function ImageUploader({
  bucket,
  value,
  onChange,
  multiple = false,
}: {
  bucket: Bucket;
  value: string | string[] | null;
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const list = multiple ? (Array.isArray(value) ? value : value ? [value] : []) : value ? [value as string] : [];

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadImage(bucket, f)));
      if (multiple) onChange([...(list as string[]), ...urls]);
      else onChange(urls[0]);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function remove(url: string) {
    if (multiple) onChange((list as string[]).filter((u) => u !== url));
    else onChange("");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {list.map((url) => (
          <div key={url} className="relative w-20 h-20 rounded-md overflow-hidden group border border-border">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <label className="w-20 h-20 rounded-md border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-accent">
          <input type="file" accept="image/*" multiple={multiple} className="hidden"
            onChange={(e) => handle(e.target.files)} disabled={uploading} />
          <Upload className="w-5 h-5 text-muted-foreground" />
        </label>
      </div>
      {uploading && <div className="text-xs text-muted-foreground">Uploading…</div>}
    </div>
  );
}
