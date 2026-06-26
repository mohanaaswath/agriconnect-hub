## Dhandapani Farmer Business Website — Build Plan

A premium dark-themed (black / green / gold) agriculture marketplace with products, livestock, farm land, cart, orders, contact, and an admin dashboard, backed by Lovable Cloud (Supabase under the hood).

### Stack note (important)

Your project is already scaffolded on **TanStack Start + TypeScript + Tailwind v4** (not plain React + Vite + React Router). I'll keep that stack — it gives you the same React + TS + Tailwind + Framer Motion + Supabase experience you asked for, plus SSR. Routing uses TanStack Router file-based routes instead of `react-router-dom`; everything else (Framer Motion, Swiper, Zod, React Hook Form, sonner toasts, Zustand) maps over 1:1. If you'd rather I rip this out and rebuild on Vite + React Router, say so before I start.

### 1. Backend (Lovable Cloud)

Enable Lovable Cloud, then create migrations for:

- `profiles` (auto-created on signup via trigger), `user_roles` + `app_role` enum + `has_role()` security-definer fn (admin role kept off `profiles` to prevent privilege escalation)
- `products`, `livestock`, `real_estate` with the exact fields you listed + auto-generated codes (`prod-001`, `ls-001`, `fl-001`) via sequence + trigger
- `cart_items`, `orders`, `order_items`, `contact_messages`
- Storage buckets: `products`, `livestock`, `real-estate` (public read)
- RLS on every table + GRANTs:
  - Public SELECT on products / livestock / real_estate
  - Authenticated users: own cart, own orders, insert contact messages
  - Admin (via `has_role`): full CRUD on listings + read all orders & messages
- Seed sample rows (Groundnut, Banana, Palm Tree; Gir/Kangayam cow, native goat; two farm land listings)

### 2. Auth

- Email/password via Lovable Cloud
- `/auth` public route (sign in / sign up)
- `/admin/*` protected by `_authenticated` layout + admin role check
- First admin promoted manually via SQL (I'll show you the one-liner)

### 3. Routes

```
/                  Home (hero, about, stats, featured products/livestock/land, testimonials, contact)
/products          Product marketplace + search/filter
/products/$code    Product detail
/livestock         Livestock marketplace
/livestock/$code   Livestock detail
/farm-land         Real estate marketplace
/farm-land/$code   Property detail
/contact           Contact form
/auth              Login / signup
/_authenticated/admin                Dashboard overview
/_authenticated/admin/products       CRUD
/_authenticated/admin/livestock      CRUD
/_authenticated/admin/real-estate    CRUD
/_authenticated/admin/orders         View
/_authenticated/admin/messages       View
```

Each public route gets its own SEO `head()` (title, description, OG).

### 4. UI / Components

Premium dark theme defined as oklch tokens in `src/styles.css`: deep black background, emerald/forest green primary, gold accent, glass surface tokens, gradient + shadow tokens. No hardcoded colors in components.

Components: `Navbar` (sticky, cart badge, admin link, WhatsApp CTA), `Hero` (full-screen, animated), `About`, `Statistics`, `Testimonials`, `Footer`, `BackToTop`, `WhatsAppFab`, `ProductCard` / `LivestockCard` / `RealEstateCard`, `CategoryFilter`, `CartDrawer` (slide-in), `CheckoutModal`, `ProductFormModal` / `LivestockFormModal` / `RealEstateFormModal` with image upload, `DeleteConfirmModal`, `AdminLayout`, `Loader`.

State: Zustand cart store (localStorage for guests, syncs to `cart_items` when signed in). Server data via TanStack Query (already wired). Forms via React Hook Form + Zod. Toasts via sonner. Animations via Framer Motion. Carousels via Swiper.

### 5. WhatsApp integration

A configurable business number (constant). Product / livestock / property "Inquire" buttons open `wa.me/<number>?text=<prefilled>`. Floating WhatsApp FAB on every page.

### 6. Quality

- TypeScript interfaces for Product, Livestock, RealEstate, CartItem, Order, Profile
- Loading + error states on every Supabase call
- Mobile-first responsive
- Build passes `bun run build`

### Things I'm NOT doing unless you ask

- Payment gateway (orders go to `pending`; admin updates status)
- Email notifications
- Multi-language / i18n
- Real testimonials (placeholder content)
- Custom WhatsApp Business API (using simple `wa.me` deep links)

### Confirm before I build

1. Stick with **TanStack Start** (recommended, no rebuild) or force **Vite + React Router** (full rewrite)?
2. WhatsApp business number to hardcode? (placeholder `+91 99999 99999` otherwise)
3. Admin email for the seed admin account? (I'll create it and you set the password on first login)
