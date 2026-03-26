"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import type { Product } from "@/types/database";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/products");
    setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  async function toggleFeatured(product: Product) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: !product.is_featured }),
    });
    const updated = await res.json();
    setProducts((p) => p.map((x) => (x.id === updated.id ? updated : x)));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-brown-dark">Products</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-brown/50">Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Product</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Stock</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Featured</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-sand/30 flex-shrink-0">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-brown-dark line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-brown/60 capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-brown-dark font-medium">
                    ₹{p.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.stock === 0 ? "bg-red-100 text-red-600" :
                      p.stock < 5 ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(p)} title="Toggle featured">
                      <Star
                        size={18}
                        className={p.is_featured ? "fill-terracotta text-terracotta" : "text-gray-300"}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center py-12 text-brown/40">No products yet</p>
          )}
        </div>
      )}
    </div>
  );
}
