import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/database";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Macrame", value: "macrame" },
  { label: "Candles", value: "candles" },
  { label: "Jewellery", value: "jewelry" },
  { label: "Home Decor", value: "home-decor" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "created_at-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

async function getProducts(category?: string, sort?: string): Promise<Product[]> {
  let query = supabase.from("products").select("*");

  if (category) query = query.eq("category", category);

  const [col, dir] = (sort ?? "created_at-desc").split("-");
  query = query.order(col as "created_at" | "price", { ascending: dir === "asc" });

  const { data } = await query;
  return data ?? [];
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const category = params.category ?? "";
  const sort = params.sort ?? "created_at-desc";
  const products = await getProducts(category, sort);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="section-title mb-2">
        {category
          ? CATEGORIES.find((c) => c.value === category)?.label ?? "Shop"
          : "All Products"}
      </h1>
      <p className="text-brown/60 mb-8">{products.length} product{products.length !== 1 ? "s" : ""}</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        <div className="flex flex-wrap gap-2 flex-1">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.value}
              href={`/shop${cat.value ? `?category=${cat.value}` : ""}`}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                category === cat.value
                  ? "bg-terracotta text-white border-terracotta"
                  : "border-sand text-brown hover:border-terracotta"
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        <select
          defaultValue={sort}
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("sort", e.target.value);
            window.location.href = url.toString();
          }}
          className="border border-sand rounded-full px-4 py-1.5 text-sm text-brown bg-white focus:outline-none focus:border-terracotta"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-brown/50">
          <p className="text-4xl mb-4">🪴</p>
          <p className="font-display text-xl">No products found</p>
          <p className="text-sm mt-2">Check back soon — more pieces coming!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
