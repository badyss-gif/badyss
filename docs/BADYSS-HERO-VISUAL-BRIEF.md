# BADYSS Hero Visual Brief

Phase 5A — documentation only. No image has been generated. Nothing here has been sent to fal.ai. This brief translates the approved `docs/BADYSS-VISUAL-ART-DIRECTION.md` into a single, specific concept for the one image that fills the homepage hero (`HeroSection.tsx`, `CreativeVisual kind="hero"`). PROPOSED, pending your review before generation.

Reflects the approved model/representation direction: the hero represents BADYSS's **general** contemporary menswear identity (natural body-type diversity, not positioned exclusively as plus-size) — the Grandes Tailles section carries its own dedicated, stronger visual emphasis separately (per Decision 3 approval), not duplicated here.

---

## Exact Visual Concept

A man in contemporary urban streetwear, mid-stride, photographed from a side/three-quarter angle on a modern Moroccan city street at golden hour. The image reads as a candid editorial moment — someone moving through their city with confidence — not a posed fashion-catalog shot. Full-body or strong 3/4-body framing; the face is present but not the compositional focus.

## Subject / Model Direction

- Adult man, contemporary styling, natural/authentic body type — no exaggerated proportions in either direction.
- Body oriented side-on or three-quarter-turned relative to camera; walking or mid-movement, not a static frontal stance.
- Face visible but secondary — three-quarter or profile angle, not looking directly into the lens in a posed "catalog" way. No tight facial close-up.
- Natural, unforced posture and gait — the specific thing to avoid is a stiff, symmetrical "stock fashion pose."

## Clothing Direction

- Urban streetwear silhouette consistent with the real catalog's core categories: relaxed-fit ensemble (matching top/bottom set) or layered cargo pants + tee + light jacket.
- Sneakers visible (ties to the real footwear catalog).
- Palette: warm neutrals — black, warm charcoal, off-white — with **one piece carrying the terracotta accent** (a jacket, cap, or similar), so the brand accent color exists physically in the scene rather than only as a CSS overlay (per art direction §7).
- No visible logos, graphics, or brand marks on any garment — avoid implying a specific real brand or trademark.

## Environment

Contemporary urban Moroccan street or building exterior — modern, minimalist architecture (concrete lines, geometric shadow patterns). A soft-focus glimpse of a traditional architectural motif (an arch, a zellige-tile detail) is acceptable as a distant, blurred background accent — never the dominant subject of the frame. Any background signage must be blurred/illegible, not readable text.

**Explicitly not**: souks, market stalls, camels, "exotic" tourist staging, or any orientalist-cliché framing of Morocco.

## Architecture

Modern building facade or a minimalist concrete stairwell/urban corner — strong geometric lines and shadow play that reinforce "contemporary," not "historic/heritage-tourism."

## Lighting

Golden-hour natural daylight — warm, directional, long soft shadows, warm rim light along the subject's silhouette. Not flat midday light. Not artificial studio strobe/beauty lighting.

## Time of Day

Late afternoon / golden hour — this drives the warm color temperature naturally rather than needing to be forced in post.

## Camera Angle

Slight low angle (subtle — conveys confidence/premium scale, not distorted or extreme).

## Lens Feel

~35–50mm-equivalent natural perspective. Moderate depth of field: subject sharp, background softened but still legibly urban (not reduced to abstract bokeh).

## Composition

Subject positioned right-of-center, occupying roughly the right two-thirds of the frame, moving across or into frame. The lower-left third of the frame is kept compositionally clean — open pavement, wall, soft shadow, sky — genuinely empty of visual clutter, not just "dark."

## Negative Space Location

Lower-left third of the frame.

## Text-Safe Area

Lower-left ~40% width × ~45% height. This area should be visually calm *before* any CSS treatment — `CreativeVisual`'s `overlay="scrim-bottom"` (a bottom-anchored dark gradient) is applied in code, not baked into the image. The generated image itself should not be pre-darkened at the bottom; it should simply be compositionally uncluttered there so the code-applied scrim + real HTML text both work cleanly together, rather than covering up a busy shot.

## Desktop Composition

Wide frame (16:9 — matches the existing `CreativeVisual` `hero` preset's desktop ratio). More environment visible on both sides of the subject; subject can read smaller relative to the full frame without losing presence.

## Mobile Composition

Tighter, more vertical (4:5 — matches the `hero` preset's mobile ratio). **Not** a squeeze-cropped version of the desktop frame — per the art direction's mobile-crop rule (§14), this needs either a dedicated tighter generation or enough native resolution/framing headroom to re-crop intentionally, keeping the subject vertically prominent and the lower-left negative space proportionally preserved.

## Aspect Ratio

Matches the already-built `CreativeVisual kind="hero"` preset exactly — no new component work needed: **4:5 mobile → 16:9 desktop**.

## Color Grading

Warm, filmic, gently desaturated. Shadows lean warm near-black (close to the site's `--inverse` `#171412`), highlights lean warm off-white (close to `--background` `#F7F5F2`). Subtle film grain — not a plastic-smooth AI-render look. Avoid punchy/oversaturated "commercial stock photo" color.

## Mood

Confident, contemporary, quietly premium — someone who belongs in this city, dressed well, moving with purpose. Urban energy without aggression or hyper-stylization.

## What to Avoid

- Any text, logo, watermark, fake brand name, product label, or UI element baked into the image
- Tight facial close-up as the compositional focus
- Stiff, symmetrical, "stock catalog" fashion pose
- Orientalist/tourist Moroccan clichés (souks, camels, exotic staging, medina-as-backdrop)
- Oversaturated/neon color grading or an artificial "AI stock photo" look
- Readable background signage or text of any kind
- Exaggerated or unrealistic body proportions
- Malformed hands/limbs or other common generative-image artifacts — a technical quality-control check at generation time, not just an art-direction preference
- Flat midday light or obvious studio strobe lighting
- Any recognizable real-world landmark (rights/branding risk)

---

## Generation Readiness Note

This brief is written to translate directly into a fal.ai prompt using the fixed style scaffold already defined in `docs/BADYSS-VISUAL-ART-DIRECTION.md` §15 (consistent lens/lighting/grain/negative-prompt language across all future generations, so this hero image and later category/campaign images read as one continuous shoot). No prompt has been written or submitted — this is the brief awaiting your go-ahead to proceed to actual generation.

## Decisions Requiring Your Approval

1. Confirm the specific wardrobe direction (ensemble/tracksuit vs. cargo-pants-and-tee layering) — both are consistent with the real catalog; either is fine, but worth your preference before generation.
2. Confirm whether a single high-resolution master image (re-cropped per breakpoint) is acceptable, or whether you'd rather commission two distinct generations (desktop-framed and mobile-framed) for a cleaner result at both ratios.
3. Everything else above is ready to proceed once you approve — no generation will happen without an explicit go-ahead.

No source files were modified this phase — quality gate not re-run (nothing to regress).
