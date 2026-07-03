
DROP POLICY IF EXISTS storage_auth_write ON storage.objects;
DROP POLICY IF EXISTS storage_auth_update ON storage.objects;
DROP POLICY IF EXISTS storage_auth_delete ON storage.objects;

CREATE POLICY storage_admin_write ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = ANY(ARRAY['products','livestock','real-estate'])
    AND private.has_role(auth.uid(), 'admin')
  );

CREATE POLICY storage_admin_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = ANY(ARRAY['products','livestock','real-estate'])
    AND private.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    bucket_id = ANY(ARRAY['products','livestock','real-estate'])
    AND private.has_role(auth.uid(), 'admin')
  );

CREATE POLICY storage_admin_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = ANY(ARRAY['products','livestock','real-estate'])
    AND private.has_role(auth.uid(), 'admin')
  );

CREATE OR REPLACE FUNCTION public.enforce_order_item_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actual_price NUMERIC;
  discount NUMERIC;
BEGIN
  SELECT price, COALESCE(discount_percentage, 0)
    INTO actual_price, discount
    FROM public.products
   WHERE id = NEW.product_id;

  IF actual_price IS NULL THEN
    RAISE EXCEPTION 'Invalid product_id %', NEW.product_id;
  END IF;

  NEW.price := ROUND(actual_price * (1 - discount / 100.0), 2);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_order_item_price ON public.order_items;
CREATE TRIGGER trg_enforce_order_item_price
  BEFORE INSERT OR UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_order_item_price();

CREATE OR REPLACE FUNCTION public.recompute_order_total()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total NUMERIC;
  oid UUID;
BEGIN
  oid := COALESCE(NEW.order_id, OLD.order_id);
  SELECT COALESCE(SUM(price * quantity), 0) INTO new_total
    FROM public.order_items WHERE order_id = oid;
  UPDATE public.orders SET total_amount = new_total WHERE id = oid;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_recompute_order_total ON public.order_items;
CREATE TRIGGER trg_recompute_order_total
  AFTER INSERT OR UPDATE OR DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.recompute_order_total();
