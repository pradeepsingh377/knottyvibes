"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";

type Category = {
  id: string; name: string; slug: string; emoji: string;
  description: string; is_active: boolean; sort_order: number;
};

const emptyForm = { name: "", slug: "", emoji: "🧶", description: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm(emptyForm); setShowForm(true); }
  function openEdit(cat: Category) {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, emoji: cat.emoji, description: cat.description });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (editing) {
      const res = await fetch(`/api/admin/categories/${editing.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug }),
      });
      const updated = await res.json();
      setCategories((c) => c.map((x) => (x.id === updated.id ? updated : x)));
    } else {
      const res = await fetch("/api/admin/categories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug, sort_order: categories.length + 1 }),
      });
      const created = await res.json();
      setCategories((c) => [...c, created]);
    }
    setShowForm(false);
    setSaving(false);
  }

  async function toggleActive(cat: Category) {
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !cat.is_active }),
    });
    const updated = await res.json();
    setCategories((c) => c.map((x) => (x.id === updated.id ? updated : x)));
  }

  async function deleteCategory(cat: Category) {
    if (!confirm(`Delete "${cat.name}"? Products in this category won't be deleted.`)) return;
    await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    setCategories((c) => c.filter((x) => x.id !== cat.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-brown-dark">Categories</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-display text-xl text-brown-dark mb-5">
              {editing ? "Edit Category" : "New Category"}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-brown/60 mb-1">Emoji</label>
                  <input value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                    className="w-full border border-sand rounded-xl px-3 py-2.5 text-center text-lg focus:outline-none focus:border-terracotta" />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-brown/60 mb-1">Name</label>
                  <input value={form.name} onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }));
                  }} className="w-full border border-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta" placeholder="Category name" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-brown/60 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta font-mono" />
              </div>
              <div>
                <label className="block text-xs text-brown/60 mb-1">Description</label>
                <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta" placeholder="Short description" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving || !form.name} className="btn-primary flex-1">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p className="text-brown/50">Loading...</p> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-brown/60 font-medium w-8"></th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Slug</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className={`hover:bg-gray-50/50 ${!cat.is_active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3 text-gray-300"><GripVertical size={16} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.emoji}</span>
                      <div>
                        <p className="font-medium text-brown-dark">{cat.name}</p>
                        <p className="text-xs text-brown/50">{cat.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-brown/60">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cat.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {cat.is_active ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(cat)} title={cat.is_active ? "Hide" : "Show"}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        {cat.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => openEdit(cat)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => deleteCategory(cat)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && <p className="text-center py-12 text-brown/40">No categories yet</p>}
        </div>
      )}
    </div>
  );
}
