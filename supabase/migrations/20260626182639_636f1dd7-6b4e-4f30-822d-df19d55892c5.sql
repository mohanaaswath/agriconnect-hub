
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "order_items_insert_auth" ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert_anon" ON public.order_items;
CREATE POLICY "order_items_insert_auth" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR o.user_id IS NULL))
);
CREATE POLICY "order_items_insert_anon" ON public.order_items FOR INSERT TO anon WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id IS NULL)
);

DROP POLICY IF EXISTS "contact_insert_anyone" ON public.contact_messages;
CREATE POLICY "contact_insert_anyone" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (
  length(trim(name)) > 0 AND length(trim(email)) > 0 AND length(trim(message)) > 0
);
