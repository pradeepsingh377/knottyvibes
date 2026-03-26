"use client";

const SORT_OPTIONS = [
  { label: "Newest", value: "created_at-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function SortSelect({ value }: { value: string }) {
  return (
    <select
      defaultValue={value}
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
  );
}
