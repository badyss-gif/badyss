# BADYSS Site Blueprint

Phase 2 — Site Architecture & Experience Strategy. This is a planning document, not an implementation. Nothing here has been built except what's explicitly noted as already existing from Phase 0/1. Every claim is labeled:

- **VERIFIED** — confirmed from the live badyss.ma site or direct client input
- **NOT_VERIFIED** — observed but unconfirmed, or genuinely unknown
- **PROPOSED** — my recommendation, awaiting your approval
- **PLACEHOLDER** — structural only, real content required before launch

---

## 1. Brand Experience

Direction (PROPOSED, from Phase 1): **"Urban Editorial Commerce"** — warm near-monochrome base, one confident terracotta accent, sharp editorial imagery contrasted with soft pill buttons, restrained motion. Full token/typography detail in `PROJECT_STATUS.md`.

What the current live site actually communicates (classified):

| Claim | Status |
|---|---|
| Fashion / casual clothing / sneakers / plus-size ("grandes tailles") focus | VERIFIED — real product catalog confirms this (ensembles/tracksuits, t-shirts, footwear, plus-size pants/tees) |
| "Le quotidien, avec style", "Tenues décontractées, toujours raffinées" and similar taglines | NOT_VERIFIED as final brand voice — observed homepage copy, but this redesign is a full brand reset, not a copy migration. Treat as inspiration for tone, not source text. |
| "Livraison partout au Maroc" | NOT_VERIFIED — contradicted by the live `/info/shipping/` page (theme demo content describing Europe/USA delivery). The homepage claim may still be operationally true; needs direct confirmation, not inference. |
| "Paiement à la livraison" (cash on delivery) | NOT_VERIFIED — same issue: the live `/info/payments/` page lists card processors only, never mentions COD. This is the single most important fact to confirm before launch, since COD is likely central to conversion in this market. |
| Real, functioning order tracking at `/info/online-order-tracking/` | VERIFIED — genuine WooCommerce feature, French UI, order number + billing email lookup. **Must be preserved in the redesign.** |
| Phone `0707003517` | VERIFIED (consistent across header + contact page) — still worth a direct re-confirmation before publishing as the primary public number. |
| Brand story, founder, timeline (currently "Alma Seven" / 1990s milestones on `/info/about/`) | **Not BADYSS content at all** — confirmed theme demo fiction. Will not be adapted or referenced. |

---

## 2. Sitemap

Classification: **REQUIRED** (needed for launch) / **RECOMMENDED** (real value, not launch-blocking) / **OPTIONAL** (nice-to-have) / **NOT_YET_VERIFIED** (depends on an answer we don't have).

### Primary

| Route | Status | Reasoning |
|---|---|---|
| `/` | REQUIRED | Homepage |
| `/shop` | REQUIRED | VERIFIED to exist on the live site already at this exact path — preserve it, zero redirect needed |
| `/product/[slug]` | REQUIRED | VERIFIED existing pattern (`/product/{slug}/`) — preserve exactly, this is the single highest-SEO-value URL pattern on the site (15 real indexed product pages today) |
| `/categories` (all-categories index) | RECOMMENDED | Does **not** exist on the current site. New discovery hub, good for IA/SEO, not launch-blocking |

### Category routes — **decision needed, see §2a below**

Real, VERIFIED WooCommerce category slugs discovered via the live sitemap: `t-shirt`, `grandes-tailles` (with nested `chaussures`, `pantalon`, `pantalons-grande-taille`, `tshirt-grande-taille`), `ensembles-grande-taille`. All REQUIRED — every one has real products behind it today. I have **not** invented any category beyond these.

- `/product-category/t-shirt` — REQUIRED
- `/product-category/grandes-tailles` (+ nested chaussures/pantalon/etc.) — REQUIRED
- `/product-category/ensembles-grande-taille` — REQUIRED (most of the real catalog is "Ensemble" tracksuits/sets — this is arguably the site's core category)
- `/grandes-tailles-categorie/` (standalone, non-nested page found on the live site) — NOT_YET_VERIFIED. Purpose unclear — possibly a duplicate/legacy landing page. Recommend checking WooCommerce admin before deciding whether to migrate or drop it.

**Important open question, not decided by me**: several real footwear products (`sandale-le-suede-slide`, `sabot-hermes`, `under-armour-sk`) only surfaced via the products sitemap, not via any confirmed top-level "Chaussures" category — the only `chaussures` slug found is nested *under* `grandes-tailles`. It's unverified whether general (non-plus-size) footwear has a proper category at all in the current store. Worth checking directly in WooCommerce admin rather than assuming.

#### §2a — URL structure decision (needs your approval, not decided here)

The prompt's example routes (`/categories/{slug}` flat structure) don't match the real, currently-indexed nested structure (`/product-category/grandes-tailles/chaussures/`). Two real options:

- **Option A (PROPOSED default): preserve the exact legacy `/product-category/{slug}/` paths**, including nesting. Zero redirect risk, zero SEO value lost, but perpetuates a somewhat inconsistent legacy IA (e.g., the `/grandes-tailles-categorie/` duplicate above).
- **Option B: adopt a cleaner flat `/categories/{slug}` structure.** Better long-term IA, but requires a real 301 redirect map from every old category URL and carries some transitional SEO risk.

I recommend **Option A** for launch (protect what's already ranking), with Option B as a possible future migration once the new site has established its own ranking signals. This is exactly the kind of decision the project rules ask me to flag rather than decide — your call.

### Brand

| Route | Status |
|---|---|
| `/a-propos` | RECOMMENDED — structure ready, real content NOT_FOUND (see §1) |
| `/contact` | REQUIRED — real contact info exists (phone verified, contact-form pattern real) |

### Trust

| Route | Status |
|---|---|
| `/avis` (reviews hub) | NOT_YET_VERIFIED — depends on whether WooCommerce product reviews are actually enabled/populated. Not confirmed. |
| `/faq` | RECOMMENDED — structure good, real content NOT_FOUND (live version is 100% Lorem Ipsum) |
| `/guide-des-tailles` | RECOMMENDED, high priority given the plus-size ("grandes tailles") focus — but needs real garment measurements from the client, currently NOT_FOUND |
| `/livraison` | REQUIRED conceptually — content NOT_FOUND / contradicted (see §1) |
| `/retours` | REQUIRED conceptually — content NOT_FOUND |
| `/suivi-commande` (order tracking) | REQUIRED — this maps to the VERIFIED real feature at `/info/online-order-tracking/`. Must not be dropped in the redesign. |

### Content

| Route | Status |
|---|---|
| `/journal` | RECOMMENDED, conditional — real SEO upside (see §12), but only worth building if the client commits to ongoing content production. An empty or abandoned blog actively hurts SEO more than not having one. **Flagging as a resourcing decision, not just a design one.** |

### Legal

| Route | Status |
|---|---|
| `/politique-de-confidentialite` | REQUIRED — necessary for any store collecting customer data (Morocco's Loi 09-08 on personal data protection is relevant here — NOT_VERIFIED how the current site handles this, worth a compliance check) |
| `/conditions-generales` | REQUIRED |
| `/politique-de-livraison` | PROPOSED to **merge with `/livraison`** rather than keep as a separate page — avoids duplicate/confusing content. Flagging as a proposed simplification, not decided unilaterally. |
| `/politique-de-retour` | PROPOSED to merge with `/retours`, same reasoning |
| `/cookies` | REQUIRED if any non-essential tracking (analytics, ad pixels) is used — likely, given the project has Meta/Facebook Ads tooling connected |

### Customer

| Route | Status |
|---|---|
| `/recherche` | RECOMMENDED as a route, but PROPOSED to noindex it (search-result pages are typically thin/duplicate content) — primary search UX should be an overlay, not a page users navigate to directly |
| `/panier` (cart) | REQUIRED — PROPOSED as a hybrid: a quick-access drawer for most interactions, plus a full `/panier` page as the "view full cart" destination (mirrors the real existing `/shop/cart/` pattern) |
| `/commande` (checkout) | REQUIRED — **major architecture decision, see §8 (Cart & Checkout UX)**, not decided in this document |
| `/mon-compte` | NOT_YET_VERIFIED whether customer accounts are actually needed. WooCommerce technically supports them (`/shop/my-account/` exists today), but given this looks like a low-price-point, COD-heavy, casual-fashion market, guest checkout may matter more than accounts. PROPOSED: guest checkout as the primary path, accounts as optional/secondary. |

---

## 3. Navigation Architecture

Built so far (Phase 1): sticky header with logo, a reserved (currently empty) primary-nav slot, and a full-screen mobile overlay — no final labels chosen yet, per explicit instruction not to invent IA before the sitemap is confirmed.

Proposed direction now that the sitemap above exists:
- **Desktop**: logo left, primary nav center-right (Shop, the three-to-four real categories, About, Journal if committed to), utility icons right (search, account if built, cart).
- **Mobile**: full-screen overlay (already built) — primary nav items first, secondary links (Contact, FAQ, Order tracking) below a visual separator, so the most-used destinations aren't buried.
- Categories in nav should link to real category routes only (§2) — never a placeholder/invented category.

---

## 4. Homepage Structure

The 15-section strawman in the brief was explicitly flagged as a hypothesis to evaluate, not implement. Given a **15-product catalog**, several sections would either be redundant or thin. Curated, catalog-size-aware structure (PROPOSED):

| # | Section | Keep? | Reasoning |
|---|---|---|---|
| 1 | Announcement/utility bar | CONDITIONAL | Only if the COD/livraison-Maroc claims are re-confirmed (§1) — otherwise this is the single most prominent place to publish an unverified claim |
| 2 | Header/nav | Structural, not a "section" | Already built (Phase 1) |
| 3 | Hero editorial campaign | KEEP | Brand-first, not a product dump — see §5 |
| 4 | Brand positioning | MERGED into #6 | Splitting brand positioning from brand story is padding for a 15-product catalog |
| 5 | Featured category discovery | KEEP | Real entry points into the 3–4 real categories |
| 6 | New arrivals | **MERGED with #8** | With 15 SKUs total, a separate "new arrivals" row and "best sellers" row risk showing near-identical products twice. Proposed: one curated "Sélection du moment" section instead of two. |
| 7 | Editorial campaign (mid-page) | **MERGED into #3/#9** | Two separate full editorial breaks plus a hero is section overload for this catalog size — one strong hero + one mid-page editorial moment is enough |
| 8 | Best sellers | MERGED with #6 (see above) | — |
| 9 | Large-size / inclusive fashion focus | KEEP, combined with brand story | This is a genuine differentiator (grandes-tailles is a real, prominent category) — worth its own editorial moment rather than a generic "about us" blurb |
| 10 | Brand story | MERGED into #9 | — |
| 11 | Customer trust / testimonials | **CUT for now** | No real reviews/testimonials exist (§1) — will not show fake ones. Replaced by #12. |
| 12 | Delivery / payment reassurance | KEEP, lightweight | Icon/text trust bar (COD, livraison Maroc, real phone) — contingent on §1 re-confirmation |
| 13 | Instagram/social proof | **CUT unless verified** | Only found icons, not a confirmed active, decent-content profile. Don't embed a placeholder or dead link. |
| 14 | Newsletter | KEEP, conditional | Needs an actual email service decision (Mailchimp/Klaviyo/other) — NOT_VERIFIED what BADYSS uses, if anything |
| 15 | Footer | KEEP | Already built (Phase 1) |

**Resulting curated homepage (PROPOSED): 7 real content sections**, not 15: Hero → Category discovery → Featured products → Editorial/brand-story moment (grandes-tailles focus) → Trust bar → Newsletter → Footer, with the announcement bar as a conditional 8th pending §1 confirmation.

---

## 5. Hero Strategy

- **Aspect ratio**: reuse the already-built `hero` preset in `CreativeVisual` — 4:5 portrait on mobile, widening to 16:9 on desktop. No new component needed.
- **Mobile behavior**: portrait crop, hero capped around 85–90vh (not a full 100vh lock) so users see a peek of the next section and are invited to scroll; text block kept short — headline + one line of subcopy + one CTA.
- **Desktop behavior**: wider crop, more breathing room, text can sit in the lower-left third; optionally a second, visually secondary link (e.g., "Nouveautés") alongside the primary CTA — never more than two.
- **Text placement**: bottom-left, matching the `contentPosition="bottom-left"` preset already built — this also needs to become an art-direction instruction for the eventual fal.ai prompt (leave negative space lower-left for text, don't center the subject's face there).
- **CTA strategy**: one primary CTA only (e.g. "Découvrir la collection" → `/shop`). Competing CTAs dilute the hero's job.
- **Focal point**: use the already-built `focalPoint` prop (CSS `object-position`) once a real image exists, so mobile cropping doesn't cut off a model's head.
- **Overlay**: `scrim-bottom` (already built) for text legibility — not a full-frame dark overlay, which would mute the photography.
- **Motion**: the existing `Reveal` component (fade + slight slide, reduced-motion aware) for the hero text on load. No Ken Burns pan/zoom on the image itself — reads as generic/dated, and costs more on mobile GPUs than it's worth.

---

## 6. Shop UX

- **Grid**: 2 columns mobile → 3 tablet → 4 desktop (already the established pattern from the Phase 1 `ProductCard`).
- **Filtering**: mobile = full-screen/bottom-sheet filter drawer (not an inline sidebar — saves vertical space); desktop = sidebar or dropdown row. Filter dimensions limited to what's real: category (verified), size (if the attribute is confirmed present — NOT_VERIFIED across all 15 products), price range. **Not** inventing a "color" filter until attribute data confirms it's consistently populated.
- **Sorting**: price asc/desc, newest — these map directly to the already-built `sortProducts()` function. "Popularity" sort deferred until real sales data exists (NOT_VERIFIED whether meaningful at this catalog size).
- **Search**: header-triggered overlay using the already-built `searchProducts()` API function — a small 15-product catalog performs fine even with simple debounced search, no need for a dedicated search service.
- **Pagination**: with only 15 products today, pagination is barely necessary, but the UI should be built as "load more" / infinite-scroll from day one so it degrades gracefully as the catalog grows, rather than needing a rebuild later.
- **Product count, empty states, loading states**: "Aucun produit trouvé" style empty state; loading skeletons reuse the already-built `Skeleton` component.
- **Visual hierarchy**: image-forward grid (established in Phase 1's `ProductCard` — no card borders/shadows), filters and sort collapsed by default on mobile so the grid is the first thing seen.

---

## 7. Category UX

- Featured categories on the homepage and `/categories` link only to real slugs (§2) — Grandes tailles, T-shirts, Ensembles, and Chaussures pending the open question in §2.
- "New arrivals" and "Best sellers" are treated as **sort views of `/shop`** (`?sort=newest`, `?sort=popularity`) rather than separate destination pages — reduces IA complexity for a small catalog. Can be promoted to dedicated landing pages later if/when SEO data justifies it.
- Category pages must be able to render dynamically from whatever WooCommerce returns — no hardcoded category list in the frontend beyond the verified ones already known.

---

## 8. Product Page UX (and Cart/Checkout)

- **Gallery**: real WooCommerce images via the existing `ProductImage` component — swipeable single-image carousel on mobile, stacked thumbnails + larger primary image on desktop.
- **Title / price / sale price**: direct from the domain `Product` type + `formatPrice()` (both already built).
- **Color / size**: rendered only from real `product.attributes` — same principle as the Phase 1 `ProductCard` heuristic, extended into a real variant selector once `ProductVariant` data is confirmed available from the backend (NOT_VERIFIED — no live connection yet).
- **Size guide**: links to `/guide-des-tailles` (content pending, §2).
- **Stock**: domain `ProductStock.status` drives in-stock/out-of-stock/backorder messaging and disables "add to cart" appropriately.
- **Quantity + add to cart**: wires into the already-built `cart-reducer` from Phase 0 — no new state-management architecture needed.
- **Delivery/payment reassurance**: a short block near the buy box — content blocked on the same §1 confirmation (COD, delivery claims).
- **Description/details**: straight from WooCommerce `description`/`short_description` — real data, no invention.
- **Related products**: same-category products via the already-built `getProducts({ category })`.
- **Recently viewed**: OPTIONAL, client-side (localStorage) — a nice-to-have, proposed as a post-launch enhancement, not a launch blocker.
- **Reviews**: NOT_YET_VERIFIED whether WooCommerce reviews are enabled/populated. No fake review UI will be built. If confirmed available, a `Review`/`ReviewSummary` domain type and fetch function (following the exact pattern already used for products/categories) can be added cheaply later.
- **FAQ**: a single sitewide `/faq` is proposed over per-product FAQs unless a specific product category has genuinely recurring questions.

### Cart & Checkout — the one big open architecture decision

Two real paths, not decided here:

- **Option A (PROPOSED for launch): redirect to the existing WooCommerce-hosted checkout** (`/shop/checkout/` equivalent) for the actual payment/order-creation step, while the Next.js frontend owns everything up to "proceed to checkout." Lower risk, reuses already-configured payment methods and COD logic without us having to rebuild/verify that logic, ships faster.
- **Option B: fully custom headless checkout** built in Next.js, calling WooCommerce's Store API/REST API directly for cart and order creation. Better brand consistency at the most critical conversion moment, but real risk: payment gateway integration, COD logic, tax/shipping calculation, and order-status webhooks all need to be understood and rebuilt correctly — a meaningfully bigger, higher-stakes scope than anything built so far.

**Recommendation: start with Option A**, revisit a custom checkout later once real backend access confirms exactly how payments/COD are configured today. This is exactly the kind of decision flagged for your approval rather than made unilaterally.

---

## 9. About Page

Structural slots only, no invented content: Who We Are · Brand Story · Brand Values · Fashion Philosophy · Moroccan Market Positioning. All PLACEHOLDER pending real client input. Explicitly **not** reusing or adapting any part of the "Alma Seven" demo content found on the live site (§1) — that's someone else's fictional brand, not a starting draft.

---

## 10. Contact Page

| Element | Status |
|---|---|
| Phone `0707003517` | VERIFIED, recommend re-confirming directly before publishing |
| Contact form (Name/Email/Phone/Request pattern) | VERIFIED real pattern on the live site, safe to replicate |
| Email address | NOT_FOUND anywhere on the live site — needs to be provided |
| WhatsApp | NOT_VERIFIED whether officially used — no WhatsApp link found, don't assume one exists |
| Business hours | NOT_FOUND |
| Social media (Facebook/YouTube/Instagram) | Icons seen, exact profile URLs NOT_VERIFIED — need real handles from the client |
| Physical address / boutique | NOT_FOUND — consistent with an online-only operation, but worth confirming whether a showroom exists |

---

## 11. Trust System

Real, currently-verifiable trust signals: the phone number, the real order-tracking feature (§1 — must be preserved), and the delivery/payment claims **pending re-confirmation**. No fake reviews, no fake testimonials, no fake "as seen in" logos. Where a trust element requires data we don't have (reviews, WhatsApp, testimonials), it is either omitted from the initial build or shown as a clearly-labeled PLACEHOLDER only in internal tooling (never on the customer-facing site) — matching the same discipline already applied to `/design-system` mock data in Phase 1.

---

## 12. Content Strategy

PROPOSED topic map only — zero articles written, and this entire route (`/journal`) is conditional on a real content-production commitment (§2). Topics chosen to match genuine search intent around the **real** catalog (plus-size menswear, ensembles/tracksuits, casual sneakers), not generic SEO padding:

- Guide des tailles homme (ties directly to `/guide-des-tailles`)
- Mode grande taille homme au Maroc
- Comment porter un ensemble (tracksuit/set styling — matches the bulk of the real catalog)
- Comment choisir ses sneakers
- Comment entretenir un t-shirt / vêtement (care guide, ties to real product care questions)
- Tendances mode homme au Maroc

This is a starting hypothesis for future content planning, not a commitment to write these — flagging explicitly that ongoing content marketing requires a resourcing decision from you/the client.

---

## 13. Mobile-First Strategy

Consolidating everything decided in Phase 0/1 plus new pieces from this phase:

- Header: sticky, minimal, full-screen nav overlay (built)
- Search: overlay, not a dedicated page users navigate to first
- Hero: portrait crop, capped height, single CTA (§5)
- Category discovery: horizontally-scrollable or stacked cards, real categories only
- Product grid: 2 columns from the smallest viewport up (established Phase 1)
- Filters: bottom-sheet/full-screen drawer, not inline sidebar
- Product page: swipeable gallery, sticky "add to cart" bar anticipated for mobile (keeps the primary action reachable without scrolling back up)
- Cart: drawer for quick access, full page for review (§8)
- Checkout: single-column, mobile-first steps regardless of Option A/B (§8)
- Forms: large touch targets, native input types (`tel`, `email`) for correct mobile keyboards
- Footer: already built, stacks cleanly on mobile (Phase 1)

Desktop enhances this baseline (wider grids, side-by-side layouts) — it is never the starting point.

---

## 14. Performance Strategy

- **AI editorial images** (Phase 6, fal.ai): once generated, serve through `next/image` at multiple responsive sizes in modern formats (AVIF/WebP auto-negotiated by Next.js) — never raw unoptimized exports. Only the actual LCP element (hero image) gets `priority`; everything else lazy-loads — already the established pattern in `ProductImage`.
- **Product images**: real WooCommerce media, same `next/image` pipeline, `sizes` attributes already tuned in `ProductImage`.
- **Avoid autoplay hero video** for v1 — heavy for mobile performance/battery; a static image with a restrained `Reveal` text animation covers the "cinematic" ambition without the LCP/INP cost. Revisit only if a specific campaign strongly justifies it.
- **Fonts**: already optimized via `next/font` (Phase 1) — no change needed.
- **Third-party scripts** (analytics, Meta/Facebook ad pixel — relevant given the connected ads tooling): load via `next/script` with `strategy="afterInteractive"` or `"lazyOnload"`, never render-blocking.
- **Animations**: transform/opacity only (already the pattern in `Button`/`Reveal`) — compositor-friendly, no layout thrashing; `prefers-reduced-motion` respected throughout (already built).

---

## 15. WordPress/WooCommerce Data Strategy

Confirms and extends the split already implemented in `src/lib/`:

**From WooCommerce** (commerce data, via `src/lib/woocommerce/`):
- Products, Categories, Attributes/Variations, Stock, Prices, Images, Orders
- Reviews — only if confirmed enabled/populated (NOT_YET_VERIFIED); a `Review` domain type would follow the exact same pattern as `Product`/`ProductCategory` when that's confirmed, at near-zero cost

**From WordPress** (content, via `src/lib/wordpress/`):
- About page content, FAQ content, Journal/blog posts, Size Guide content, brand story — all as regular WP pages/posts, fetched through the already-built `wordPressFetch()` client

This keeps commerce and content cleanly separated at the data layer, exactly as scaffolded in Phase 0 — no architecture change needed to support this strategy, only real credentials and real content.

---

## 16. AI Visual Strategy (fal.ai, Phase 6 — not executed now)

- AI visuals are for hero/editorial/campaign/background use only — never product photography (this separation is already enforced architecturally: `CreativeVisual` vs. `ProductImage`, two distinct components that can never be substituted for each other).
- Art direction themes to brief into fal.ai when that phase starts: Moroccan urban environment, contemporary/streetwear fashion, large-size-inclusive representation, modern architecture, editorial fashion photography — all as **mood/style direction**, not literal scene descriptions invented now.
- Every generated image needs a specified focal point (for the `focalPoint` prop already built) and must leave deliberate negative space for text overlay per §5.
- Output format: optimize for `next/image` (AVIF/WebP, multiple sizes) — no raw exports served directly.

---

## 17. Verified Information (consolidated)

- Standard WooCommerce/WordPress install; real URL conventions (`/product/{slug}/`, `/product-category/{slug}/`, `/shop/*`, `/info/{page}/`)
- 15 real published products (see `PROJECT_STATUS.md` for the full list)
- Real category slugs: `t-shirt`, `grandes-tailles` (+ nested `chaussures`, `pantalon`, `pantalons-grande-taille`, `tshirt-grande-taille`), `ensembles-grande-taille`
- Phone number `0707003517`
- Real, functioning order-tracking feature
- Real contact-form field pattern (Name/Email/Phone/Request)

## 18. Unverified Information (consolidated)

- Whether "Livraison partout au Maroc" and "Paiement à la livraison" are still operationally true (contradicted by live demo content on the shipping/payments info pages)
- Whether WooCommerce product reviews are enabled/populated
- Whether WhatsApp is an officially used contact channel
- Exact social media profile URLs
- Email address, business hours, physical address/boutique existence
- Purpose of `/grandes-tailles-categorie/` and whether general (non-plus-size) footwear has a real top-level category
- WordPress/WooCommerce admin-level access (REST/GraphQL availability, installed plugins, real settings configuration)
- Whether customer accounts are actually required/used vs. guest checkout being sufficient
- What (if any) email service BADYSS uses for newsletters

## 19. Proposed Decisions (mine, awaiting approval)

- Homepage cut down to ~7 curated sections instead of the 15-section strawman (§4)
- Category URL structure: preserve legacy `/product-category/{slug}/` paths (Option A, §2a) rather than a cleaner flat restructure
- Merge `/politique-de-livraison` into `/livraison`, and `/politique-de-retour` into `/retours`
- "New arrivals"/"Best sellers" as sort views of `/shop`, not separate landing pages, for now
- No testimonials/social-proof section until real reviews or a confirmed active Instagram exist
- Checkout: start with a redirect to the existing WooCommerce checkout (Option A, §8) rather than a custom headless build

## 20. Decisions Requiring Your Direct Input (not proposals — genuine unknowns)

1. Is cash on delivery still actually offered? Is delivery genuinely available nationwide?
2. Do you have (or can you get) WordPress admin / WooCommerce REST API credentials?
3. Is there a real, active Instagram/Facebook/YouTube presence worth linking, and what are the exact URLs?
4. Is there a business email address and physical location/showroom?
5. Is WhatsApp an actual support channel?
6. Are customer accounts genuinely needed, or is guest checkout + order tracking sufficient?
7. Is there appetite/resourcing for ongoing `/journal` content production?
8. Custom headless checkout vs. redirect to existing WooCommerce checkout — final call is yours (§8)

## 21. Recommended Implementation Order

1. Resolve the two blockers that gate everything real: (a) shipping/payment/COD facts, (b) WordPress/WooCommerce backend access.
2. Wire the already-built data layer (`src/lib/api`) to real WooCommerce data once credentials exist — no architecture change needed, just real config.
3. Build the homepage using the curated 7-section structure (§4), with real product data but a placeholder hero (AI visual comes later, Phase 6).
4. Build `/shop` and `/product/[slug]` using the already-built `ProductCard`/`ProductImage`/domain types — the single highest-value pair of pages given they map to real, already-indexed URLs.
5. Build `/categories` and the real category routes.
6. Build cart (drawer + `/panier`) using the already-built cart reducer; decide and implement the checkout path (§8).
7. Build `/contact`, `/faq`, `/livraison`, `/retours`, `/guide-des-tailles` once real content exists (blocked on client input, not on engineering).
8. Legal pages (`/politique-de-confidentialite`, `/conditions-generales`, `/cookies`) — can proceed in parallel once source content/legal review is available.
9. `/a-propos` once real brand story exists.
10. `/journal` only if content resourcing is confirmed (§12).
11. AI visual generation (fal.ai) once the homepage/hero structure is finalized and approved.
12. Advanced motion/storytelling polish (GSAP/ScrollTrigger) as a final layer, only where it demonstrably improves the experience.
