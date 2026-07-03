
-- Restrict anon column access on livestock: revoke full SELECT, grant SELECT on non-contact columns only
REVOKE SELECT ON public.livestock FROM anon;
GRANT SELECT (
  id, livestock_code, name, description, price, category, breed, age, weight,
  milk_yield, health, vaccination, location, seller_rating, seller_verified,
  images, featured, created_at
) ON public.livestock TO anon;

-- Same for real_estate
REVOKE SELECT ON public.real_estate FROM anon;
GRANT SELECT (
  id, property_code, name, description, price, price_per_acre, location,
  size, soil_type, water_source, suitable_for, amenities, owner_rating,
  verified, images, featured, created_at
) ON public.real_estate TO anon;
