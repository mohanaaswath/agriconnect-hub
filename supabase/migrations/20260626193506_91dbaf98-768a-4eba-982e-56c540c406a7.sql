
DROP POLICY IF EXISTS storage_admin_write ON storage.objects;
DROP POLICY IF EXISTS storage_admin_update ON storage.objects;
DROP POLICY IF EXISTS storage_admin_delete ON storage.objects;

CREATE POLICY storage_auth_write ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = ANY (ARRAY['products','livestock','real-estate']));
CREATE POLICY storage_auth_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = ANY (ARRAY['products','livestock','real-estate']));
CREATE POLICY storage_auth_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = ANY (ARRAY['products','livestock','real-estate']));
