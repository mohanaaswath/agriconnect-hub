DROP POLICY IF EXISTS products_admin_insert ON public.products;
DROP POLICY IF EXISTS products_admin_update ON public.products;
DROP POLICY IF EXISTS products_admin_delete ON public.products;
CREATE POLICY products_auth_insert ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY products_auth_update ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY products_auth_delete ON public.products FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS livestock_admin_insert ON public.livestock;
DROP POLICY IF EXISTS livestock_admin_update ON public.livestock;
DROP POLICY IF EXISTS livestock_admin_delete ON public.livestock;
CREATE POLICY livestock_auth_insert ON public.livestock FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY livestock_auth_update ON public.livestock FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY livestock_auth_delete ON public.livestock FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS real_estate_admin_insert ON public.real_estate;
DROP POLICY IF EXISTS real_estate_admin_update ON public.real_estate;
DROP POLICY IF EXISTS real_estate_admin_delete ON public.real_estate;
CREATE POLICY real_estate_auth_insert ON public.real_estate FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY real_estate_auth_update ON public.real_estate FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY real_estate_auth_delete ON public.real_estate FOR DELETE TO authenticated USING (true);