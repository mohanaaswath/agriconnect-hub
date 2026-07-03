ALTER TABLE public.feedback ADD COLUMN role TEXT;
ALTER TABLE public.feedback ADD COLUMN approved BOOLEAN NOT NULL DEFAULT false;

CREATE POLICY "Public can read approved feedback"
  ON public.feedback FOR SELECT
  TO anon
  USING (approved = true);

CREATE INDEX idx_feedback_approved_created_at ON public.feedback (approved, created_at DESC);