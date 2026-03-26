type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price: number | null;
  category: string;
  images: string[];
  stock: number;
  is_featured: boolean;
  tags: string[];
  created_at: string;
};

type OrderRow = {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  status: "created" | "paid" | "failed";
  amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "id" | "created_at">;
        Update: Partial<Omit<ProductRow, "id" | "created_at">>;
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, "id" | "created_at">;
        Update: Partial<Omit<OrderRow, "id" | "created_at">>;
      };
    };
  };
};

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
