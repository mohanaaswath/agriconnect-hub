
GRANT SELECT (id, livestock_code, name, description, price, category, breed, age, weight, milk_yield, health, vaccination, location, seller_rating, seller_verified, images, featured, created_at)
  ON public.livestock TO anon;

GRANT SELECT (id, property_code, name, description, price, size, price_per_acre, location, water_source, soil_type, suitable_for, amenities, images, featured, verified, owner_rating, created_at)
  ON public.real_estate TO anon;
