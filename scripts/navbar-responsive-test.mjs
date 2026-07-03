// Responsive navbar smoke test.
// Usage: node scripts/navbar-responsive-test.mjs [baseUrl]
// Requires: playwright (dev). Verifies navbar behavior on common viewports.
import { chromium, devices } from "playwright";

const BASE = process.argv[2] || "http://localhost:8080";

const VIEWPORTS = [
  { name: "iPhone SE", width: 375, height: 667, mobile: true },
  { name: "iPhone 12", width: 390, height: 844, mobile: true },
  { name: "Pixel 5", width: 393, height: 851, mobile: true },
  { name: "iPad Mini", width: 768, height: 1024, mobile: true },
  { name: "iPad Pro", width: 1024, height: 1366, mobile: false },
  { name: "Laptop", width: 1280, height: 800, mobile: false },
  { name: "Desktop", width: 1536, height: 960, mobile: false },
];

const results = [];
const browser = await chromium.launch();
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "domcontentloaded" });

    const hamburger = page.getByRole("button", { name: /menu/i });
    const desktopNav = page.locator("header nav").first();
    const checks = { viewport: vp.name };

    if (vp.width < 1024) {
      checks.hamburgerVisible = await hamburger.isVisible();
      await hamburger.click();
      const menuTitle = page.getByText("Menu", { exact: true });
      checks.menuOpens = await menuTitle.isVisible();
      // Ensure the drawer nav does not require inner scrolling.
      const nav = page.locator('nav:has-text("Home"):has-text("Contact")').last();
      const box = await nav.boundingBox();
      const scroll = await nav.evaluate((el) => ({ sh: el.scrollHeight, ch: el.clientHeight }));
      checks.navFitsNoScroll = scroll.sh <= scroll.ch + 1;
      checks.navHeight = box?.height;
      await page.getByRole("button", { name: /close menu/i }).click();
    } else {
      checks.desktopNavVisible = await desktopNav.isVisible();
      checks.hamburgerHidden = !(await hamburger.isVisible());
    }
    results.push(checks);
    await ctx.close();
  }
} finally {
  await browser.close();
}

let failed = 0;
for (const r of results) {
  const ok = Object.entries(r)
    .filter(([k]) => k !== "viewport" && k !== "navHeight")
    .every(([, v]) => v === true);
  if (!ok) failed++;
  console.log(ok ? "PASS" : "FAIL", JSON.stringify(r));
}
if (failed) {
  console.error(`${failed} viewport(s) failed`);
  process.exit(1);
}
console.log("All responsive navbar checks passed.");
