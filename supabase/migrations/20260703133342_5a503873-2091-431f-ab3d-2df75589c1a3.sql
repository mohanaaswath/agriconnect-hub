DROP POLICY IF EXISTS "Public can read approved feedback" ON public.feedback;
CREATE POLICY "Public can read all feedback" ON public.feedback FOR SELECT USING (true);
GRANT SELECT ON public.feedback TO anon;