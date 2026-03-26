import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ProductForm from "@/components/admin/ProductForm";

async function getProduct(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return data;
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-brown-dark mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
