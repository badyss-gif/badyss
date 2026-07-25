# BADYSS Visual Art Direction

Phase 4 — documentation only. Nothing here has been generated, implemented, or approved. This document is the creative brief that will drive fal.ai prompt-writing in a future phase, and the reference for elevating the homepage's visual execution once approved. Everything is **PROPOSED**.

Builds directly on the approved Phase 1 design system (`PROJECT_STATUS.md`) — this is not a second, parallel visual system. Colors, type, and the `CreativeVisual` aspect/overlay/focal-point API are treated as fixed constraints, not starting points to reinvent.

---

## 1. Overall Visual Identity

**"Urban Editorial Commerce," made cinematic.** The gap between the current placeholder homepage and the target isn't a new palette or a new font — it's photographic and compositional ambition. Concretely, the target look is: contemporary fashion-campaign photography (think a modern menswear lookbook, not a product catalog), asymmetric editorial layout, generous negative space used as a design element rather than empty margin, and a recurring warm/terracotta color signature that makes real photography and the site's UI chrome feel like one continuous system rather than photos dropped into a template.

The single biggest lever for "major transformation from the old site" is **photography quality and composition**, not additional UI decoration. Every section below is written with that priority.

## 2. Hero Art Direction

Reject the generic centered-text-over-image template explicitly ruled out in this phase's brief. Proposed composition: **off-center subject, deliberate negative space**, not a symmetrical hero banner.

- Subject positioned right-of-center or occupying the right two-thirds of the frame, camera-aware of leaving the lower-left third genuinely empty (not just dark) for text — the model/subject should be framed so the composition looks intentional even before any text is overlaid, not "text slapped on top of a full-bleed photo."
- Environmental, not studio: an urban Moroccan backdrop (see §10) visible in the frame, not a seamless backdrop — the hero should read as "somewhere," not "nowhere."
- Desktop: wide environmental frame (16:9 territory), subject can be smaller in frame, more scene visible either side.
- Mobile: tighter, more vertical crop (4:5) — the same shoot, re-cropped or re-composed to keep the subject legible at phone width rather than shrunk-and-cropped from the desktop frame (a different focal point per breakpoint, using the already-built `focalPoint` prop, not a fixed single crop stretched across sizes).
- Entrance: subtle, not decorative — a restrained fade/reveal on the image itself on first load is acceptable (a few hundred ms, opacity + very slight scale, e.g. 1.03→1.0), but text stays immediately legible (per the Phase 3 correction: the LCP element should not wait on JS to become visible — if any entrance motion is used on the image, the text layer either renders immediately or uses a near-zero perceptible delay, not a scroll-triggered fade-from-invisible).
- Subtle image motion where appropriate: a very slow, barely perceptible Ken-Burns-style drift (scale 1.0→1.04 over 8–12s) is acceptable *if* it doesn't compete with legibility or cost mobile battery/performance — treat as optional polish, not a requirement, and always paired with a `prefers-reduced-motion` static fallback.

## 3. Category Visual Direction

Elevate beyond equal-sized cards into genuine editorial asymmetry:

- One category (proposed: **Grandes tailles**, the strategic differentiator) gets a large, tall, dominant tile; the other two are smaller supporting tiles — matches what's already structurally built (`CategoryShowcase`'s tall/portrait split), the elevation here is photographic, not structural.
- Each tile's photography should feel like a fashion-editorial fragment (cropped-in, confident framing — a torso-and-garment moment, an environmental full-length shot, a texture/detail shot) rather than a "model standing centered against a wall" catalog shot.
- Hover (desktop): subtle image scale (1.0→1.05, ~400–600ms ease-out) already implemented at the placeholder level — carry this through with real imagery; consider a secondary crop/detail reveal only if it doesn't add a second image request per tile unnecessarily.
- Touch (mobile): no hover state exists — the image's own composition and the label typography carry the "editorial" feeling; tap targets stay full-tile (already the case).

## 4. Editorial Campaign Direction

This section's job is "BADYSS is a fashion brand," not "BADYSS sells clothes." Proposed direction:

- Large-format single image (not a collage), asymmetric split with text — matches the already-built `CampaignBlock` (image + text side by side, alternating left/right per section). Elevate the *image* to feel like a standalone editorial spread page, cropped tight enough to show fabric/texture/movement rather than a full head-to-toe "product on a person" shot.
- Typography does real work here: the heading should be large enough to compete with the image for attention (already using `text-display-md`/`Archivo` — at full visual execution this can push toward `text-display-lg`+ if the layout supports it), not a small caption next to a big photo.
- Scroll-triggered reveal (already built via `Reveal`) is appropriate here — this section is genuinely below the fold, unlike the hero.

## 5. Grandes Tailles Campaign Direction

Strategically the most important non-hero visual moment — treat it with hero-level ambition, not category-tile-level ambition.

- Proposed: full-bleed or near-full-bleed image (wider than the standard `CampaignBlock` image column), genuinely large-scale — this may warrant a dedicated layout variant rather than reusing the same side-by-side `CampaignBlock` proportions as the generic editorial campaign, so the two sections don't feel identical in weight.
- Photography must show real size-inclusive representation authentically and confidently — not a token single image, not a "before/after" framing, not exaggerated proportions. Confident, camera-forward energy, matching the "style, à toutes les tailles" positioning already written for this section.
- Strong CTA treatment: larger touch target, possibly a different visual weight (e.g., the CTA sits over the image itself with a scrim, rather than below the text block) to signal this is a destination, not a footnote.

## 6. Product Photography Direction

Real WooCommerce photography, not AI-generated (architecturally enforced already — `ProductImage` vs. `CreativeVisual` can never be substituted). Direction here concerns *presentation*, not generation:

- Consistent, neutral background across the real product catalog is out of our control (WooCommerce photos are whatever they are) — the card design should compensate with consistent surrounding whitespace and consistent aspect ratio (`3:4`, already fixed in `ProductImage`) so visual rhythm stays intact regardless of photo-background inconsistency.
- Secondary image on hover: **conditional** — only where a product actually has more than one real image (`product.images.length > 1`); falls back to the current single-image-only behavior otherwise. Never fabricate a second angle.
- Subtle zoom on hover (scale ~1.03–1.05, matching the category-tile treatment) for consistency across the site's hover language.
- Price hierarchy stays as already built: sale price in `--error` red, strikethrough regular price in `--muted-foreground` — no change needed, already matches "clean price hierarchy."

## 7. Color Grading

The photography's natural palette should already read close to the site's token palette (`PROJECT_STATUS.md` §Color System) — the goal is that real photos and UI chrome feel unified without needing a heavy CSS filter/overlay trick to force it:

- Warm, slightly desaturated grade — avoid punchy, oversaturated "stock photography" color.
- Shadows lean warm dark brown/near-black (matching `--inverse` `#171412`), not cold blue-black.
- Highlights lean warm off-white (matching `--background` `#F7F5F2`), not clinical white.
- The terracotta accent (`--accent` `#9C4A1E`) should appear *within* the photography itself where plausible — a garment color, a wall, a light quality — rather than only existing as a UI overlay color. This is what makes the accent feel like a genuine brand color instead of a website-only decoration.
- Filmic contrast (gentle roll-off in highlights/shadows) over harsh digital contrast.

## 8. Lighting

- Natural or natural-appearing light — golden-hour or soft overcast urban daylight, consistent with an outdoor/urban environment direction (§10), rather than flat studio strobe lighting.
- Directional, not flat: visible light direction and shadow to give images dimension and a "shot at a specific time and place" feeling.
- Avoid harsh midday flat light and avoid obviously artificial ring-light/beauty-lighting looks — both read as generic/AI-stock rather than editorial.

## 9. Model Direction

- **Genuine size diversity, including plus-size representation, is a real business differentiator (verified: grandes-tailles is a substantial, real category) and must be reflected authentically across the campaign, not tokenized into a single separate "grandes tailles only" image set.**
- Confident, natural movement and posture over stiff, symmetrical "catalog pose" — walking, turning, adjusting a garment, mid-gesture — rather than a static frontal stance.
- Known AI-image weakness: faces, especially in tight close-up, are where generative models most often produce uncanny/artificial results. Proposed mitigation, which also happens to be good editorial practice: **favor environmental, three-quarter, or partial-body/action framing over tight face-forward close-ups**, especially for hero and campaign imagery. Where a face is visible, keep it a supporting element of the composition, not the focal point requiring pixel-perfect scrutiny.
- Wardrobe direction should stay generic/styling-level (urban streetwear silhouettes, layering, sneakers) — not tied to specific real SKUs, since AI visuals must never be mistaken for real product photography.

## 10. Environment Direction

- Contemporary, urban Morocco — modern architecture, concrete and geometric urban textures, city streets, contemporary interiors.
- Deliberately avoid orientalist/tourist clichés (souks-as-backdrop, camels, "exotic" staging) — the brand position is a *contemporary* urban Moroccan identity, not a heritage-tourism aesthetic.
- Traditional Moroccan pattern/craft motifs (zellige geometry, architectural arches) may appear as **subtle background texture or environmental detail**, never as the dominant subject of the frame — an accent, not the theme.
- Locations should feel specific enough to have character (a real-feeling street corner, a concrete stairwell, a modern building facade) without being a recognizable, brand-liability-risk real landmark.

## 11. Camera Direction

- Lens language: roughly 35–50mm-equivalent field of view — natural, editorial, not a wide-angle distortion or a compressed telephoto look.
- Shallow-to-moderate depth of field: enough separation to feel premium, not so shallow that the urban environment (which is doing real brand-positioning work) disappears into mush.
- Mix of eye-level (authentic, relatable) and a slight low angle (confidence, premium scale) — reserve the low angle for hero/campaign moments, keep category/product-adjacent shots more neutral/eye-level.
- Occasional genuine motion blur or mid-stride framing is preferable to static, stiff compositions — reinforces "urban energy."

## 12. Composition Rules

- Rule of thirds / off-center subject placement as the default, not center-frame — matches the hero direction (§2) and prevents every image from feeling like a stock-photo template.
- Deliberate negative space is a requirement, not an accident: every hero/campaign image must be briefed with an explicit "this area stays clear for text" instruction (tied to the `contentPosition` values already built: `bottom-left`, `bottom-center`, `center`).
- Never bake text, logos, or watermarks into a generated image — all text is rendered as real HTML/CSS on top (via `CreativeVisual`'s overlay + content slot), both for accessibility/SEO (real text, not text-in-image) and so copy can be edited without regenerating the image.

## 13. Desktop Aspect Ratios

Formalizes the presets already implemented in `CreativeVisual` — no new component API needed, this is the content brief for what fills them:

| Use | Preset | Desktop ratio |
|---|---|---|
| Hero | `hero` | 16:9 |
| Editorial campaign | `campaign` via `tall` | 3:4 |
| Grandes Tailles (proposed wider treatment, §5) | new/extended — see Decisions below | wider than 3:4, TBD |
| Category — large/dominant tile | `tall` | 3:4 |
| Category — supporting tiles | `portrait` | 3:4 |
| Background/texture use | `background` via `wide` | 16:9 |

## 14. Mobile Aspect Ratios

| Use | Preset | Mobile ratio |
|---|---|---|
| Hero | `hero` | 4:5 |
| Editorial campaign | `tall` | 4:5 |
| Category tiles (all) | `portrait`/`tall` | 4:5 (unified — mobile stacks tiles full-width, so the desktop large/small distinction collapses to consistent portrait framing) |

Mobile crops are **not** the desktop image mathematically cropped down — each image needs its own `focalPoint` (already supported) so the subject stays correctly framed at the taller mobile ratio, and in the eventual fal.ai generation phase, mobile-critical images may warrant a distinct generation/crop pass rather than a single shared master crop.

## 15. AI Image Consistency Rules

So multiple generations feel like one campaign, not a grab-bag of unrelated AI images:

- Fixed style-keyword scaffold reused across every generation prompt: *contemporary editorial fashion photography, natural daylight, warm filmic color grade, 35–50mm lens, shallow-to-moderate depth of field, urban Moroccan architecture, confident natural movement* — plus per-image specifics (subject, framing, negative-space direction).
- Consistent negative-prompt discipline: no baked-in text/logos/watermarks, no oversaturated/neon color, no obviously synthetic "AI stock photo" lighting, no orientalist staging clichés.
- Consistent grain/texture amount across all generations (subtle film grain, not a plastic-smooth AI look) — treat as a fixed post-processing step, not a per-image variable.
- Consistent color grade pass (§7) applied uniformly, ideally as a shared post-generation step rather than relying on prompt wording alone to produce matching color every time.
- A running reference set: once the first 2–3 images are generated and approved, subsequent generations should be briefed with those as style references (fal.ai supports reference/style-conditioning workflows), not generated independently from text alone each time.

## 16. Animation Philosophy

Extends, does not replace, the Phase 1 motion philosophy (`PROJECT_STATUS.md`): CSS transitions for micro-interactions, a single JS animation library reserved for orchestrated moments, `prefers-reduced-motion` respected everywhere.

**Recommendation: do not add GSAP.** Framer Motion (already installed, already used via `Reveal`) has its own scroll-linked primitives (`useScroll` + `useTransform`) that can produce the "subtle scroll-linked movement" this phase asks for — parallax-style image drift, scroll-progress-driven reveals — without a second animation dependency. GSAP/ScrollTrigger would only be justified by a specific effect Framer Motion genuinely cannot do; nothing identified so far meets that bar. This is a direct application of "prefer the simplest technology" from this phase's brief.

Motion inventory, all Framer-Motion-based:
- Page/section entrance: existing `Reveal` (fade + slight rise, scroll-triggered) — unchanged.
- Image reveal: same `Reveal` wrapping applies to campaign/category images, not just text.
- Hover transitions: CSS only (`transition-transform`/`transition-colors`) — no JS needed for hover states, already the pattern in `ProductCard`/category tiles.
- Text reveal: same `Reveal`, potentially with a slightly longer stagger delay for headline vs. subcopy vs. CTA within one section (already supported via `Reveal`'s `delay` prop).
- Subtle scroll-linked movement (e.g., hero image drift): `useScroll`/`useTransform` from Framer Motion, applied narrowly (one or two moments, not every section) and always with a static fallback under reduced motion.

**Hard exclusions carried forward**: no scroll-hijacking, no heavy parallax, no WebGL/3D, no animating every section indiscriminately — motion is applied where it demonstrably supports storytelling (campaign/category reveals), not as decoration.

## 17. Interaction Philosophy

- Every interactive element must have a genuine destination or function — this project has already established (Phase 3) that a button with no action is a real accessibility/UX smell; that principle extends to any new hover/tap interaction introduced for visual polish.
- Desktop hover states (image scale, secondary product image) must have a sensible mobile/touch equivalent — usually "no hover, static composition carries the interest instead," not a broken or invisible desktop-only feature.
- Micro-interactions (button press states, focus rings) stay exactly as built in Phase 1 — nothing about elevating the visual language changes the accessibility-first interaction baseline.

## 18. Responsive Art Direction

Reinforcing the brief's explicit rejection of "desktop shrunk to mobile":

- **Composition changes, not just scale**: hero subject position, category tile proportions, and campaign image/text order are each specified per breakpoint above (§2–§5, §13–§14), not derived by scaling one fixed layout down.
- **Crop changes**: every image gets a mobile-specific `focalPoint`/crop consideration, not a single master crop stretched across ratios (§14).
- **Order changes**: `CampaignBlock`'s existing `imagePosition` alternation (image-left/image-right) collapses to image-first-then-text on mobile — already the current behavior, carried forward as intentional, not a compromise.
- **Interaction model changes**: hover-based reveals (secondary product image, category scale-on-hover) have no mobile equivalent by design — mobile relies on the static composition and typography to carry the same "editorial" feeling, not a tap-triggered imitation of hover.
- **Animation changes**: scroll-linked drift/parallax effects (§16) should be evaluated for mobile performance specifically before shipping — if a scroll-linked effect causes jank on mid-tier mobile hardware, the correct fix is removing it on mobile (via a media-query-gated check), not degrading it into something worse than no animation at all.

---

## Decisions Requiring Your Approval

1. **Grandes Tailles visual treatment** (§5, §13) — I've proposed it get a *wider, more full-bleed* aspect ratio than the standard editorial campaign, meaning `CreativeVisual` would need one new aspect preset (e.g. `"campaign-wide"`) beyond the five that exist today. This is a small, contained component change, not a redesign — flagging because it's a deliberate visual-hierarchy choice (this section should outweigh the generic editorial section), not a neutral technical detail.
2. **GSAP exclusion** (§16) — recommending we do not add it and rely on Framer Motion's scroll primitives instead. If a specific desired effect later proves it genuinely needs GSAP, that's a small, reversible addition — but I'd rather you confirm the "no second animation library" default before any implementation phase assumes it.
3. **Model/representation direction** (§9) — the size-inclusivity emphasis is based on the verified real `grandes-tailles` category, but the specific way AI-generated humans are depicted is inherently a brand-sensitive decision. Worth your explicit sign-off before this becomes the brief fed into fal.ai generation.
4. Everything else in this document remains PROPOSED pending your review, per this phase's instructions — no generation, no homepage changes, and no motion implementation has happened yet.
