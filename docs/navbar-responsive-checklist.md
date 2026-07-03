# Responsive Navbar Checklist

Run automated check: `node scripts/navbar-responsive-test.mjs http://localhost:8080`

Test on: iPhone SE (375), iPhone 12 (390), Pixel 5 (393), iPad Mini (768), iPad Pro (1024), Laptop (1280), Desktop (1536).

## Mobile / Tablet (< 1024px)
- [ ] Hamburger button visible; desktop nav hidden
- [ ] Tapping hamburger opens right-side drawer with dim backdrop
- [ ] Drawer background is solid (no bleed-through of hero content)
- [ ] All nav items (Home, Products, Livestock, Real Estate, Contact) + Sign in / Admin fit **without inner scroll**
- [ ] Close (X) and backdrop click both dismiss the drawer
- [ ] Logo + brand text truncate cleanly, no horizontal scroll on page
- [ ] Cart badge count renders correctly

## Desktop (≥ 1024px)
- [ ] Inline nav visible; hamburger hidden
- [ ] Active route highlighted in gold
- [ ] WhatsApp CTA and Sign in / Admin visible

## Accessibility
- [ ] All icon buttons have aria-labels
- [ ] Keyboard: Tab reaches menu button; Enter opens; Esc/Tab through drawer works
