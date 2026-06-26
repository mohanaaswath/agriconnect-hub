
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role)
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SEQUENCES for codes ============
CREATE SEQUENCE public.product_code_seq START 1;
CREATE SEQUENCE public.livestock_code_seq START 1;
CREATE SEQUENCE public.property_code_seq START 1;

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text UNIQUE NOT NULL DEFAULT ('prod-' || lpad(nextval('public.product_code_seq')::text, 3, '0')),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  discount_percent numeric NOT NULL DEFAULT 0,
  category text,
  unit text,
  stock integer NOT NULL DEFAULT 0,
  rating numeric NOT NULL DEFAULT 0,
  reviews integer NOT NULL DEFAULT 0,
  image_url text,
  images text[] DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  organic boolean NOT NULL DEFAULT false,
  freshness text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products_admin_insert" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "products_admin_update" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "products_admin_delete" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ LIVESTOCK ============
CREATE TABLE public.livestock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_code text UNIQUE NOT NULL DEFAULT ('ls-' || lpad(nextval('public.livestock_code_seq')::text, 3, '0')),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  category text,
  breed text,
  age text,
  weight text,
  milk_yield text,
  health text,
  vaccination text,
  location text,
  seller_name text,
  seller_phone text,
  seller_rating numeric DEFAULT 0,
  seller_verified boolean NOT NULL DEFAULT false,
  images text[] DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.livestock TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.livestock TO authenticated;
GRANT ALL ON public.livestock TO service_role;
ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "livestock_public_read" ON public.livestock FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "livestock_admin_insert" ON public.livestock FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "livestock_admin_update" ON public.livestock FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "livestock_admin_delete" ON public.livestock FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ REAL ESTATE ============
CREATE TABLE public.real_estate (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_code text UNIQUE NOT NULL DEFAULT ('fl-' || lpad(nextval('public.property_code_seq')::text, 3, '0')),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  size text,
  price_per_acre numeric,
  location text,
  water_source text,
  soil_type text,
  suitable_for text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  verified boolean NOT NULL DEFAULT false,
  owner_name text,
  owner_phone text,
  owner_rating numeric DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.real_estate TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.real_estate TO authenticated;
GRANT ALL ON public.real_estate TO service_role;
ALTER TABLE public.real_estate ENABLE ROW LEVEL SECURITY;
CREATE POLICY "real_estate_public_read" ON public.real_estate FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "real_estate_admin_insert" ON public.real_estate FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "real_estate_admin_update" ON public.real_estate FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "real_estate_admin_delete" ON public.real_estate FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ CART ============
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cart_owner_all" ON public.cart_items FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============ ORDERS ============
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT UPDATE, DELETE ON public.orders TO authenticated;
GRANT INSERT ON public.orders TO anon;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_owner_read" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders_insert_auth" ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "orders_insert_anon" ON public.orders FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "orders_admin_update" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders_admin_delete" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT INSERT ON public.order_items TO anon;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_read" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
);
CREATE POLICY "order_items_insert_auth" ON public.order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "order_items_insert_anon" ON public.order_items FOR INSERT TO anon WITH CHECK (true);

-- ============ CONTACT MESSAGES ============
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_insert_anyone" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_admin_read" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "contact_admin_delete" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Storage RLS for buckets (created via tool)
CREATE POLICY "storage_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id IN ('products','livestock','real-estate'));
CREATE POLICY "storage_admin_write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('products','livestock','real-estate') AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "storage_admin_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('products','livestock','real-estate') AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "storage_admin_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('products','livestock','real-estate') AND public.has_role(auth.uid(),'admin'));
