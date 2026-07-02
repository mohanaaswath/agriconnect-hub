export interface Product {
  id: string;
  product_code: string;
  name: string;
  description: string | null;
  price: number;
  discount_percent: number;
  category: string | null;
  unit: string | null;
  stock: number;
  rating: number;
  reviews: number;
  image_url: string | null;
  images: string[] | null;
  featured: boolean;
  organic: boolean;
  freshness: string | null;
  created_at: string;
}

export interface Livestock {
  id: string;
  livestock_code: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  breed: string | null;
  age: string | null;
  weight: string | null;
  milk_yield: string | null;
  health: string | null;
  vaccination: string | null;
  location: string | null;
  seller_name: string | null;
  seller_phone: string | null;
  seller_rating: number | null;
  seller_verified: boolean;
  images: string[] | null;
  featured: boolean;
  created_at: string;
}

export interface RealEstate {
  id: string;
  property_code: string;
  name: string;
  description: string | null;
  price: number;
  size: string | null;
  price_per_acre: number | null;
  location: string | null;
  water_source: string | null;
  soil_type: string | null;
  suitable_for: string[] | null;
  amenities: string[] | null;
  images: string[] | null;
  featured: boolean;
  verified: boolean;
  owner_name: string | null;
  owner_phone: string | null;
  owner_rating: number | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

export function discountedPrice(p: Pick<Product, "price" | "discount_percent">) {
  return p.discount_percent > 0 ? Math.round(p.price * (1 - p.discount_percent / 100)) : p.price;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}
