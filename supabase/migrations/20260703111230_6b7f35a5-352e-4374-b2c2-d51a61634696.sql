
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY IF EXISTS orders_owner_read ON public.orders;
DROP POLICY IF EXISTS orders_admin_update ON public.orders;
DROP POLICY IF EXISTS orders_admin_delete ON public.orders;
DROP POLICY IF EXISTS order_items_read ON public.order_items;
DROP POLICY IF EXISTS contact_admin_read ON public.contact_messages;
DROP POLICY IF EXISTS contact_admin_delete ON public.contact_messages;

CREATE POLICY orders_owner_read ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY orders_admin_update ON public.orders FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY orders_admin_delete ON public.orders FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY order_items_read ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id
    AND (o.user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'::public.app_role))));
CREATE POLICY contact_admin_read ON public.contact_messages FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY contact_admin_delete ON public.contact_messages FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

DROP POLICY IF EXISTS products_auth_insert ON public.products;
DROP POLICY IF EXISTS products_auth_update ON public.products;
DROP POLICY IF EXISTS products_auth_delete ON public.products;
DROP POLICY IF EXISTS livestock_auth_insert ON public.livestock;
DROP POLICY IF EXISTS livestock_auth_update ON public.livestock;
DROP POLICY IF EXISTS livestock_auth_delete ON public.livestock;
DROP POLICY IF EXISTS real_estate_auth_insert ON public.real_estate;
DROP POLICY IF EXISTS real_estate_auth_update ON public.real_estate;
DROP POLICY IF EXISTS real_estate_auth_delete ON public.real_estate;

CREATE POLICY products_admin_insert ON public.products FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY products_admin_update ON public.products FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY products_admin_delete ON public.products FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY livestock_admin_insert ON public.livestock FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY livestock_admin_update ON public.livestock FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY livestock_admin_delete ON public.livestock FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY real_estate_admin_insert ON public.real_estate FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY real_estate_admin_update ON public.real_estate FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY real_estate_admin_delete ON public.real_estate FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

REVOKE SELECT ON public.livestock FROM anon;
GRANT SELECT (
  id, livestock_code, name, description, price, category, breed, age, weight,
  milk_yield, health, vaccination, location, seller_rating, seller_verified,
  images, featured, created_at
) ON public.livestock TO anon;

REVOKE SELECT ON public.real_estate FROM anon;
GRANT SELECT (
  id, property_code, name, description, price, size, price_per_acre, location,
  water_source, soil_type, suitable_for, amenities, images, featured, verified,
  owner_rating, created_at
) ON public.real_estate TO anon;
