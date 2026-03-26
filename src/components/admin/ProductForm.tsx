"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import type { Product } from "@/types/database";

const CATEGORIES = [
  { label: "Woolen Jewellery", value: "woolen-jewellery" },
  { label: "Hair Accessories", value: "hair-accessories" },
  { label: "Home Decor", value: "home-decor" },
  { label: "Keychains & Charms", value: "keychains" },
];

type FormData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_price: string;
  category: string;
  stock: string;
  is_featured: boolean;
  tags: string;
  images: string[];
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    compare_price: product?.compare_price?.toString() ?? "",
    category: product?.category ?? CATEGORIES[0].value,
    stock: product?.stock?.toString() ?? "0",
    is_featured: product?.is_featured ?? false,
    tags: product?.tags?.join(", ") ?? "",
    images: product?.images ?? [],
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm((f) => ({ ...f, images: [...f.images, data.url] }));
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      slug: form.slug || autoSlug(form.name),
      description: form.description,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      category: form.category,
      stock: parseInt(form.stock),
      is_featured: form.is_featured,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      images: form.images,
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed to save");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Images */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-medium text-brown-dark mb-4">Product Images</h2>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.images.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden group">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center cursor-pointer hover:border-terracotta transition-colors">
            <Upload size={18} className="text-brown/40" />
            <span className="text-xs text-brown/40 mt-1">{uploading ? "..." : "Upload"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploading} />
          </label>
        </div>
        <p className="text-xs text-brown/40">First image is the main product photo.</p>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-medium text-brown-dark mb-2">Product Details</h2>

        <Field label="Product Name">
          <input
            name="name" value={form.name} onChange={(e) => {
              handleChange(e);
              if (!product) setForm((f) => ({ ...f, slug: autoSlug(e.target.value) }));
            }}
            required className={inputCls} placeholder="Boho Woolen Earrings"
          />
        </Field>

        <Field label="Slug (URL)">
          <input name="slug" value={form.slug} onChange={handleChange} required className={inputCls} placeholder="boho-woolen-earrings" />
        </Field>

        <Field label="Description">
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className={inputCls + " resize-none"} placeholder="Describe your product..." />
        </Field>

        <Field label="Category">
          <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₹)">
            <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" className={inputCls} placeholder="299" />
          </Field>
          <Field label="Compare Price (₹) — optional">
            <input name="compare_price" type="number" value={form.compare_price} onChange={handleChange} min="0" step="0.01" className={inputCls} placeholder="399" />
          </Field>
        </div>

        <Field label="Stock Quantity">
          <input name="stock" type="number" value={form.stock} onChange={handleChange} required min="0" className={inputCls} />
        </Field>

        <Field label="Tags (comma separated)">
          <input name="tags" value={form.tags} onChange={handleChange} className={inputCls} placeholder="earrings, boho, pastel" />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox" name="is_featured" checked={form.is_featured}
            onChange={handleChange}
            className="w-4 h-4 accent-terracotta"
          />
          <span className="text-sm text-brown/70">Feature on homepage</span>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : product ? "Save Changes" : "Add Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-brown/70 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-sand rounded-xl px-4 py-2.5 text-sm text-brown-dark focus:outline-none focus:border-terracotta bg-white";
